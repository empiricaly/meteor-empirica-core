// See if everyone is done with this stage
import { Players } from "../players";
import { config } from "../../../server";
import { augmentPlayer } from "../../player-stages/augment";
import { Treatments } from "../../treatments/treatments";
import { GameLobbies } from "../../game-lobbies/game-lobbies";
import { Batches } from "../../batches/batches";

const defaultAssignment = (batches, player) => {
  // Batches will always contain at least one batch. If there are no batches
  // left by this point, the player will be automatically sent to the Exit Steps
  // with player.exitStatus === "noBatchesLeft".
  const batch = batches[0];

  // Let's first try to find games for which their assigned players isn't above
  // the number of expected players
  let availableGames = batch.games.filter(
    l => l.treatment.playerCount > l.players.length
  );

  // If no games still have "availability", just fill any game
  if (availableGames.length === 0) {
    availableGames = batch.games;
  }

  // Try to assign proportially to total expected playerCount
  const gamesPool = [];
  for (const game of availableGames) {
    for (let i = 0; i < game.treatment.playerCount; i++) {
      gamesPool.push(game);
    }
  }
  const game = _.sample(gamesPool);

  // In this assignment model, we always assign to the first batch, in any of
  // the remaining unstarted games, with over-assignment.
  // In other assignment models, you could try to go through multiple batches
  // and never do over-assigning.
  game.assign();
};

export const assign = player => {
  // Get all batches still running
  const runningBatches = Batches.find(
    { status: "running", full: false },
    { sort: { runningAt: 1 } }
  ).fetch();

  // If not batches running, lead player to exit
  if (runningBatches.length === 0) {
    Players.update(_id, {
      $set: {
        exitAt: new Date(),
        exitStatus: "noBatchesLeft"
      }
    });
    return;
  }

  // We will only collect batches that still have unstarted games
  const batches = [];

  // We will go through each batch and collect non-running games
  for (const batch of runningBatches) {
    // We only grab lobbies (games) that haven't started yet
    const lobbies = GameLobbies.find({
      batchId: batch._id,
      status: "running",
      timedOutAt: { $exists: false },
      gameId: { $exists: false }
    }).fetch();

    // If there are none, we will be skipping this batch entirely
    if (lobbies.length === 0) {
      continue;
    }

    let assigned = false;
    for (const lobby of lobbies) {
      lobby.treatment = Treatments.findOne(lobby.treatmentId).factorsObject();

      lobby.assign = () => {
        if (assigned) {
          throw new Error("Attempting to assign a player to 2 different games");
        }
        assigned = true;
        // Adding the player to specified lobby queue
        GameLobbies.update(lobby._id, {
          $addToSet: {
            queuedPlayerIds: player._id
          }
        });
        Players.update(player._id, {
          $set: { gameLobbyId: lobby._id }
        });
        lobby.players.push(player);
      };

      lobby.players = Players.find({
        _id: { $in: lobby.queuedPlayerIds }
      }).fetch();
    }

    // Allow get/set on player
    augmentPlayer(player);

    // We masquarade lobbies as games at this stage
    // TODO add get/set to lobby as game
    batch.games = lobbies;

    // There are games available in this batch, add to batches
    batches.push(batch);
  }

  // If no game was still available in any running batch, lead player to exit
  if (batches.length === 0) {
    Players.update(_id, {
      $set: {
        exitAt: new Date(),
        exitStatus: "noBatchesLeft"
      }
    });
    return;
  }

  if (config.onAssign) {
    config.onAssign(batches, player);
  }

  if (!config.onAssign || !assigned) {
    if (config.onAssign) {
      console.warn(
        "No assignment was made in Empirica.onAssign() callback, so the default assignment is used"
      );
    }
    defaultAssignment(batches, player);
  }
};

Players.after.update(
  function(userId, player, fieldNames, modifier, options) {
    if (fieldNames.includes("preAssignStepsDone")) {
      assign(player);
    }
  },
  { fetchPrevious: false }
);
