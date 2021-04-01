import moment from "moment";
import { config } from "../../server";
import { Games } from "../games/games.js";
import {
  augmentGameStageRound,
  augmentPlayerStageRound
} from "../player-stages/augment.js";
import { augmentGameObject } from "../games/augment.js";
import { Players } from "../players/players.js";
import { Rounds } from "../rounds/rounds.js";
import { Treatments } from "../treatments/treatments.js";
import { Stages } from "./stages.js";
import { GameLobbies } from "../game-lobbies/game-lobbies";

// endOfStage should only ever run once per stageId. If one of the callback
// (or the execution of endOfStage itself) takes too much time, a second
// trigger could try to run endOfStage again (e.g. all players submitted +
// cron). The lock ensures endOfStage can only run once.
const lock = {};

export const endOfStage = stageId => {
  if (lock[stageId]) {
    return;
  }

  lock[stageId] = true;

  const stage = Stages.findOne(stageId);
  const { index, gameId, roundId } = stage;
  const game = Games.findOne(gameId);
  const round = Rounds.findOne(roundId);
  const treatment = Treatments.findOne(game.treatmentId);

  augmentGameObject({ game, treatment, round, stage });

  augmentGameStageRound(game, stage, round);

  const { onStageEnd, onRoundEnd, onRoundStart, onStageStart } = config;
  if (onStageEnd) {
    onStageEnd(game, round, stage);
  }

  const nextStage = Stages.findOne({ gameId, index: index + 1 });

  if ((onRoundEnd && !nextStage) || stage.roundId !== nextStage.roundId) {
    onRoundEnd(game, round);
  }

  if (nextStage && (onRoundStart || onStageStart)) {
    const nextRound = Rounds.findOne(nextStage.roundId);
    augmentGameStageRound(game, nextStage, nextRound);
    game.players.forEach(player => {
      player.round = _.extend({}, nextRound);
      player.stage = _.extend({}, nextStage);
      augmentPlayerStageRound(player, player.stage, player.round, game);
    });

    if (onRoundStart && stage.roundId !== nextStage.roundId) {
      onRoundStart(game, nextRound);
    }

    if (onStageStart) {
      onStageStart(game, nextRound, nextStage);
    }
  }

  if (nextStage) {
    // go to next stage
    const currentStageId = nextStage._id;
    Games.update(gameId, {
      $set: { currentStageId }
    });
    const startTimeAt = moment().add(Stages.stagePaddingDuration);
    Stages.update(currentStageId, {
      $set: {
        startTimeAt: startTimeAt.toDate()
      }
    });
  } else {
    const onGameEnd = config.onGameEnd;
    if (onGameEnd) {
      onGameEnd(game);
    }
    Players.update(
      {
        _id: {
          $in: _.pluck(game.players, "_id"),
          $exists: { exitStatus: false }
        }
      },
      {
        $set: { exitStatus: "finished", exitAt: new Date() }
      },
      { multi: true }
    );
    Games.update(gameId, {
      $set: { finishedAt: new Date(), status: "finished" }
    });
    GameLobbies.update(
      { gameId },
      {
        $set: { status: "finished" }
      }
    );
  }

  delete lock[stageId];
};
