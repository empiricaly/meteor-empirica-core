// See if everyone is done with this stage
import { Players } from "../players";
import { config } from "../../../server";
import { augmentPlayer } from "../../player-stages/augment";

const defaultAssignment = (batch, player, otherBatches) => {
  // games can be empty if all games of the batch the player was assigned to at
  // start are full and have all already started.
  // This happens when we let more players in than there are spots available.
  if (!batch.games) {
    if (otherBatches.length > 0) {
      otherBatches[0].assign();
    } else {
      player.gameFull();
    }
    return;
  }

  // Let's first try to find games for which their queue isn't full yet
  let availableGames = batch.games.filter(
    l => l.availableCount > l.queuedPlayerIds.length
  );

  // If no games still have "availability", just fill any game
  if (availableGames.length === 0) {
    availableGames = batch.games;
  }

  // Book proportially to total expected playerCount
  const weigthedGames = availableGames.map(game => {
    return {
      value: game,
      weight: game.availableCount
    };
  });

  // Choose a game in the available weigthed pool
  const samples = [];
  for (var i = 0; i < weigthedGames.length; i += 1) {
    for (var j = 0; j < weigthedGames[i].weight; j += 1) {
      samples.push(weigthedGames[i].value);
    }
  }
  const game = _.sample(samples);

  game.assign();
};

const previouslyAssignedBatchIds = {};
const assign = player => {
  const { batchId } = player;

  const batch = Batches.findOne(batchId);

  // NOTE should we give all lobbies, or only viable lobbies
  const lobbies = GameLobbies.find({
    batchId,
    status: "running",
    timedOutAt: { $exists: false },
    gameId: { $exists: false }
  }).fetch();

  let assigned = false;
  for (const lobby of lobbies) {
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
      _id: { $in: queuedPlayerIds }
    }).fetch();
  }

  augmentPlayer(player);
  player.gameFull = () => {
    // Mark the player's participation attemp as failed
    Players.update(_id, {
      $set: {
        exitAt: new Date(),
        exitStatus: "gameFull"
      }
    });
  };

  // Find the first running batch (in order of running started time)
  const otherBatches = Batches.find(
    { status: "running", full: false, _id: { $ne: batchId } },
    { sort: { runningAt: 1 } }
  ).fetch();

  let assignedBatch = false;
  if (previouslyAssignedBatchIds[player._id]) {
    previouslyAssignedBatchIds[player._id] = [];
  }
  for (const otherBatch of otherBatches) {
    otherBatch.assign = () => {
      if (assignedBatch) {
        throw new Error("Attempting to assign a player to 2 different batches");
      }
      assignedBatch = true;

      if (previouslyAssignedBatchIds[player._id].includes(otherBatch._id)) {
        throw new Error(
          "Attempting to assign a player to the same batch again"
        );
      }
      previouslyAssignedBatchIds[player._id].push(batch._id);

      Players.update(player._id, {
        $set: {
          batchId: otherBatch._id
        }
      });
      assign(Players.findOne(player._id));
    };
  }

  batch.games = lobbies;

  if (config.onAssign) {
    config.onAssign(batch, lobbies, player, otherBatches);
  }

  if (!config.onAssign || !assigned) {
    if (config.onAssign) {
      console.warn(
        "No assignment was made in Empirica.onAssign() callback, so the default assignment is used"
      );
    }
    defaultAssignment(batch, lobbies, player, otherBatches);
  }
};

Players.after.update(
  function(userId, player, fieldNames, modifier, options) {
    if (fieldNames.includes("introStepsDone")) {
      assign(player);
    }
  },
  { fetchPrevious: false }
);
