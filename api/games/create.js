import moment from "moment";

import { Batches } from "../batches/batches.js";
import { GameLobbies } from "../game-lobbies/game-lobbies.js";
import { Games } from "./games";
import { PlayerRounds } from "../player-rounds/player-rounds";
import { PlayerStages } from "../player-stages/player-stages";
import { Players } from "../players/players";
import { endGame } from "../players/methods.js";
import { Rounds } from "../rounds/rounds";
import { Stages } from "../stages/stages";
import {
  augmentPlayerStageRound,
  augmentGameStageRound
} from "../player-stages/augment.js";
import { config } from "../../server";
import { weightedRandom } from "../../lib/utils.js";
import log from "../../lib/log.js";

const addStageErrMsg = `"round.addStage()" requires an argument object with 3 properties:
- name: internal name you'll use to write conditional logic in your experiment.
- displayName: the name of the Stage the player will see in the UI.
- durationInSeconds: the duration in seconds of the stage

e.g.: round.addStage({
  name: "response",
  displayName: "Response",
  durationInSeconds: 120
});

`;

export const createGameFromLobby = gameLobby => {
  if (Games.find({ gameLobbyId: gameLobby._id }).count() > 0) {
    return;
  }

  const players = gameLobby.players();

  const batch = gameLobby.batch();
  const treatment = gameLobby.treatment();
  const factors = treatment.factorsObject();
  const { batchId, treatmentId, status, debugMode } = gameLobby;

  players.forEach(player => {
    player.data = player.data || {};
    player.set = (key, value) => {
      player.data[key] = value;
    };
    player.get = key => {
      return player.data[key];
    };
    player.endGame = () => {
      endGame.call({ _id: player._id });
    };
  });

  // Ask (experimenter designer) init function to configure this game
  // given the factors and players given.
  const params = { data: {}, rounds: [], players };
  var gameCollector = {
    players,
    treatment: factors,

    get(k) {
      return params.data[k];
    },

    set(k, v) {
      params.data[k] = v;
    },

    addRound(props) {
      const data = props ? props.data : {} || {};
      const round = { data, stages: [] };
      params.rounds.push(round);
      return {
        get(k) {
          return round.data[k];
        },

        set(k, v) {
          round.data[k] = v;
        },

        addStage({ name, displayName, durationInSeconds, data = {} }) {
          if (!name || !displayName || !durationInSeconds) {
            log.error(addStageErrMsg);
            log.error(
              `Got: ${JSON.stringify(
                { name, displayName, durationInSeconds },
                null,
                "  "
              )}
`
            );
            throw "gameInit error";
            return;
          }
          const stage = { name, displayName, durationInSeconds, data };
          round.stages.push(stage);
          return {
            name,
            displayName,
            durationInSeconds,
            get(k) {
              return stage.data[k];
            },
            set(k, v) {
              stage.data[k] = v;
            }
          };
        }
      };
    }
  };
  config.gameInit(gameCollector, factors, players);

  if (!params.rounds || params.rounds.length === 0) {
    throw "at least one round must be added per game";
  }

  params.rounds.forEach(round => {
    if (!round.stages || round.stages.length === 0) {
      throw "at least one stage must be added per round";
    }

    round.stages.forEach(({ name, displayName, durationInSeconds }) => {
      // This should never happen as we already verified it above.
      if (!name || !displayName || !durationInSeconds) {
        log.error(addStageErrMsg);
        throw "invalid stage";
      }
    });
  });

  // Keep debug mode from lobby
  params.debugMode = debugMode;

  // We need to create/configure stuff associated with the game before we
  // create it so we generate the id early
  const gameId = Random.id();
  params._id = gameId;
  params.gameLobbyId = gameLobby._id;
  // We also add a few related objects
  params.treatmentId = treatmentId;
  params.batchId = batchId;
  params.status = status;

  // playerIds is the reference to players stored in the game object
  params.playerIds = _.pluck(params.players, "_id");
  // We then need to verify all these ids exist and are unique, the
  // init function might not have returned them correctly
  const len = _.uniq(_.compact(params.playerIds)).length;
  if (len !== params.players.length || len !== players.length) {
    throw new Error("invalid player count");
  }

  // We want to copy over the changes made by the init function and save the
  // gameId in the player objects already in the DB
  params.players.forEach(({ _id, data }) => {
    Players.update(
      _id,
      { $set: { gameId, data } },
      {
        autoConvert: false,
        filter: false,
        validate: false,
        trimStrings: false
      }
    );
  });

  // Create the round objects
  let stageIndex = 0;
  let totalDuration = 0;
  let firstRoundId;
  params.roundIds = params.rounds.map((round, index) => {
    const roundId = Rounds.insert(_.extend({ gameId, index }, round), {
      autoConvert: false,
      filter: false,
      validate: false,
      trimStrings: false
    });
    const stageIds = round.stages.map(stage => {
      if (batch.debugMode) {
        stage.durationInSeconds = 60 * 60; // Stage time in debugMode is 1h
      }
      totalDuration += stage.durationInSeconds;
      const sParams = _.extend({ gameId, roundId, index: stageIndex }, stage);
      const stageId = Stages.insert(sParams, {
        autoConvert: false,
        filter: false,
        validate: false,
        trimStrings: false
      });
      stageIndex++;
      if (!params.currentStageId) {
        firstRoundId = roundId;
        params.currentStageId = stageId;
      }
      const playerStageIds = params.players.map(({ _id: playerId }) => {
        return PlayerStages.insert({
          playerId,
          stageId,
          roundId,
          gameId,
          batchId
        });
      });
      Stages.update(stageId, { $set: { playerStageIds } });
      return stageId;
    });
    const playerRoundIds = params.players.map(({ _id: playerId }) => {
      return PlayerRounds.insert({
        playerId,
        roundId,
        gameId,
        batchId
      });
    });
    Rounds.update(roundId, { $set: { stageIds, playerRoundIds } });
    return roundId;
  });

  // An estimation of the finish time to help querying.
  // At the moment, this will 100% break with pausing the game/batch.
  params.estFinishedTime = moment()
    // Give it an extra 24h (86400s) window for the inter-stage sync buffer.
    // It was 5 min and that failed on an experiment with many rounds.
    // This value is not extremely useful, it's main purpose is currently
    // to stop querying games indefinitely in the update game background job.
    // It was also meant to be an approximate estimate for when the game could
    // end at the maximum, that we could show in the admin, but it can no longer
    // work, and it is questionable if the "stop querying" "feature" is still
    // adequate.
    .add(totalDuration + 86400, "seconds")
    .toDate();

  // We're no longer filtering out unspecified fields on insert because of a
  // simpleschema bug, so we need to remove invalid params now.
  delete params.players;
  delete params.rounds;

  // Insert game. As soon as it comes online, the game will start for the
  // players so all related object (rounds, stages, players) must be created
  // and ready
  Games.insert(params, {
    autoConvert: false,
    filter: false,
    validate: false,
    trimStrings: false
  });

  // Let Game Lobby know Game ID
  GameLobbies.update(gameLobby._id, { $set: { gameId } });

  //
  // Overbooking
  //

  // Overbooked players that did not finish the intro and won't be in this game
  const failedPlayerIds = _.difference(
    gameLobby.queuedPlayerIds,
    gameLobby.playerIds
  );

  // Find other lobbies that are not full yet with the same treatment
  const runningBatches = Batches.find(
    {
      _id: { $ne: batchId },
      status: "running"
    },
    { sort: { runningAt: 1 } }
  );
  const lobbiesGroups = runningBatches.map(() => []);
  const runningBatcheIds = runningBatches.map(b => b._id);
  lobbiesGroups.push([]);
  const possibleLobbies = GameLobbies.find({
    _id: { $ne: gameLobby._id },
    status: "running",
    timedOutAt: { $exists: false },
    gameId: { $exists: false },
    treatmentId
  }).fetch();
  possibleLobbies.forEach(lobby => {
    if (lobby.batchId === batchId) {
      lobbiesGroups[0].push(lobby);
    } else {
      lobbiesGroups[runningBatcheIds.indexOf(lobby.batchId) + 1].push(lobby);
    }
  });

  // If no lobbies left, lead players to exit
  if (possibleLobbies.length === 0) {
    Players.update(
      { _id: { $in: failedPlayerIds } },
      {
        $set: {
          exitAt: new Date(),
          exitStatus: "gameFull"
        }
      },
      { multi: true }
    );
  } else {
    for (let i = 0; i < lobbiesGroups.length; i++) {
      const lobbies = lobbiesGroups[i];

      if (lobbies.length === 0) {
        continue;
      }

      // If there are lobbies remaining, distribute them across the lobbies
      // proportinally to the initial playerCount
      const weigthedLobbyPool = weightedRandom(
        lobbies.map(lobby => {
          return {
            value: lobby,
            weight: lobby.availableCount
          };
        })
      );

      for (let i = 0; i < failedPlayerIds.length; i++) {
        const playerId = failedPlayerIds[i];
        const lobby = weigthedLobbyPool();

        // Adding the player to specified lobby queue
        const $addToSet = { queuedPlayerIds: playerId };
        if (gameLobby.playerIds.includes(playerId)) {
          $addToSet.playerIds = playerId;
        }
        GameLobbies.update(lobby._id, {
          $addToSet
        });

        Players.update(playerId, { $set: { gameLobbyId: lobby._id } });
      }

      break;
    }
  }

  //
  // Call the callbacks
  //

  const { onRoundStart, onGameStart, onStageStart } = config;
  if ((onGameStart || onRoundStart || onStageStart) && firstRoundId) {
    const game = Games.findOne(gameId);
    const players = Players.find({
      _id: { $in: params.playerIds }
    }).fetch();
    game.treatment = treatment.factorsObject();
    game.players = players;
    game.rounds = Rounds.find({ gameId }).fetch();
    game.rounds.forEach(round => {
      round.stages = Stages.find({ roundId: round._id }).fetch();
    });
    const nextRound = game.rounds.find(r => r._id === firstRoundId);
    const nextStage = nextRound.stages.find(
      s => s._id === params.currentStageId
    );

    augmentGameStageRound(game, nextStage, nextRound);
    players.forEach(player => {
      player.round = _.extend({}, nextRound);
      player.stage = _.extend({}, nextStage);
      augmentPlayerStageRound(player, player.stage, player.round);
    });

    if (onGameStart) {
      onGameStart(game, players);
    }
    if (onRoundStart) {
      onRoundStart(game, nextRound, players);
    }
    if (onStageStart) {
      onStageStart(game, nextRound, nextStage, players);
    }
  }

  //
  // Start the game
  //

  const startTimeAt = moment()
    .add(Stages.stagePaddingDuration)
    .toDate();

  Stages.update(params.currentStageId, {
    $set: {
      startTimeAt
    }
  });
};
