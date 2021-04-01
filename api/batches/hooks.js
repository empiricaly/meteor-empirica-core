import { config } from "../../server";
import { GameLobbies } from "../game-lobbies/game-lobbies";
import { sendPlayersToNextBatches } from "../games/create";
import { Games } from "../games/games";
import { Players } from "../players/players.js";
import { Treatments } from "../treatments/treatments";
import { Batches } from "./batches";

// Create GameLobbies
Batches.after.insert(function(userId, batch) {
  let gameLobbies = [];
  switch (batch.assignment) {
    case "simple":
      _.times(batch.simpleConfig.count, index => {
        const treatment = Random.choice(batch.simpleConfig.treatments);
        const { _id: treatmentId, lobbyConfigId } = treatment;
        gameLobbies.push({
          treatmentId,
          lobbyConfigId,
          index
        });
      });
      break;
    case "complete":
      batch.completeConfig.treatments.forEach(
        ({ count, _id, lobbyConfigId }) => {
          _.times(count, () => {
            gameLobbies.push({ treatmentId: _id, lobbyConfigId });
          });
        }
      );

      gameLobbies = _.shuffle(gameLobbies);
      gameLobbies.forEach((l, index) => {
        l.index = index;
      });
      break;
    default:
      console.error("Batches.after: unknown assignment: " + batch.assignment);
      break;
  }

  const gameLobbyIds = gameLobbies.map(l => {
    l._id = Random.id();
    l.status = batch.status;
    l.batchId = batch._id;

    // This is trully horrific. Sorry.
    // The debug mode is assigned asynchronously onto the batch, which might happen
    // just as this on insert hook is called. Sorry.
    const batchUpdated = Batches.findOne(batch._id);
    l.debugMode = batchUpdated.debugMode;

    const treatment = Treatments.findOne(l.treatmentId);
    l.availableCount = treatment.factor("playerCount").value;
    const botsCountCond = treatment.factor("botsCount");
    if (botsCountCond) {
      const botsCount = botsCountCond.value;
      if (botsCount > l.availableCount) {
        throw "Trying to create a game with more bots than players";
      }
      if (botsCount === l.availableCount) {
        //throw "Creating a game with only bots...";
        //Would be good to display a message "Are you sure you want to create a game with only bots?"
        console.log("Warning: Creating a game with only bots!");
      }
      const botNames = config.bots && _.keys(config.bots);
      if (!config.bots || botNames.length === 0) {
        throw "Trying to create a game with bots, but no bots defined";
      }

      l.playerIds = [];
      _.times(botsCount, () => {
        const params = {
          id: Random.id(),
          gameLobbyId: l._id,
          readyAt: new Date(),
          bot: _.shuffle(botNames)[0]
        };
        console.info("Creating bot:", params);
        const playerId = Players.insert(params);
        l.playerIds.push(playerId);
      });
      l.queuedPlayerIds = l.playerIds;
    }

    return GameLobbies.insert(l);
  });

  Batches.update(batch._id, { $set: { gameLobbyIds } });
});

// Update status on Games and GameLobbies
Batches.after.update(
  function(userId, { _id: batchId, status }, fieldNames, modifier, options) {
    if (!fieldNames.includes("status")) {
      return;
    }

    [Games, GameLobbies].forEach(coll => {
      coll.update(
        {
          batchId,
          status: { $nin: ["finished", "cancelled", "failed", "custom"] }
        },
        { $set: { status } },
        { multi: true }
      );
    });

    if (status !== "cancelled") {
      return;
    }

    const games = Games.find({ batchId }).fetch();
    const gplayerIds = _.flatten(_.pluck(games, "playerIds"));

    Players.update(
      { _id: { $in: gplayerIds }, exitAt: { $exists: false } },
      { $set: { exitStatus: "gameCancelled", exitAt: new Date() } },
      { multi: true }
    );

    const gameLobbies = GameLobbies.find({
      batchId,
      gameId: { $exists: false }
    }).fetch();

    if (gameLobbies.length === 0) {
      return;
    }

    const glplayerIds = _.flatten(_.pluck(gameLobbies, "queuedPlayerIds"));
    const players = Players.find({
      _id: { $in: glplayerIds },
      exitAt: { $exists: false }
    }).fetch();

    const playerIds = _.pluck(players, "_id");

    sendPlayersToNextBatches(playerIds, batchId, gameLobbies[0]);
  },
  { fetchPrevious: false }
);
