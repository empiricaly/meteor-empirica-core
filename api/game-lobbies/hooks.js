import { config } from "../../server";
import { GameLobbies } from "../game-lobbies/game-lobbies";
import { createGameFromLobby } from "../games/create";
import { Games } from "../games/games";
import { checkBatchFull, checkForBatchFinished } from "../games/hooks.js";
import { LobbyConfigs } from "../lobby-configs/lobby-configs.js";
import { earlyExitPlayerLobby } from "../players/methods";
import { Players } from "../players/players.js";

// Check if batch is full or the game finished if this lobby timed out
GameLobbies.after.update(function(
  userId,
  { batchId },
  fieldNames,
  modifier,
  options
) {
  if (!fieldNames.includes("timedOutAt")) {
    return;
  }

  checkBatchFull(batchId);
  checkForBatchFinished(batchId);
});

// Start the game if lobby full
GameLobbies.after.update(
  function(userId, doc, fieldNames, modifier, options) {
    if (
      !(
        fieldNames.includes("playerIds") ||
        (fieldNames.includes("status") && doc.status == "running")
      )
    ) {
      return;
    }

    const gameLobby = this.transform();
    const humanPlayers = [];

    if (gameLobby.playerIds && gameLobby.playerIds.length > 0) {
      const players = Players.find({
        _id: { $in: gameLobby.playerIds }
      }).fetch();
      humanPlayers.push(...players.filter(p => !p.bot));
    }

    const readyPlayersCount = gameLobby.playerIds.length;

    // If the lobby timeout it hasn't started yet and the lobby isn't full yet
    // (single player), try to start the timeout timer.
    if (
      humanPlayers.length > 0 &&
      gameLobby.availableCount != 1 &&
      !gameLobby.timeoutStartedAt
    ) {
      const lobbyConfig = LobbyConfigs.findOne(gameLobby.lobbyConfigId);
      if (lobbyConfig.timeoutType === "lobby") {
        GameLobbies.update(gameLobby._id, {
          $set: { timeoutStartedAt: new Date() }
        });
      }
    }

    // If the readyPlayersCount went to 0 (disconnections for example), reset the
    // lobby timeout.
    if (humanPlayers.length === 0 && gameLobby.timeoutStartedAt) {
      const lobbyConfig = LobbyConfigs.findOne(gameLobby.lobbyConfigId);
      if (lobbyConfig.timeoutType === "lobby") {
        GameLobbies.update(gameLobby._id, {
          $unset: { timeoutStartedAt: "" }
        });
      }
    }

    // If there are not enough players ready, wait
    if (readyPlayersCount < gameLobby.availableCount) {
      return;
    }

    // Game already created (?!)
    if (Games.find({ gameLobbyId: gameLobby._id }).count() > 0) {
      return;
    }

    let selectedPlayers;
    if (config.beforeGameInit) {
      selectedPlayers = runBeforeGame(gameLobby);

      if (!selectedPlayers) {
        return;
      }
    }

    // Create Game
    createGameFromLobby(gameLobby, selectedPlayers);
  },
  { fetchPrevious: false }
);

function runBeforeGame(gameLobby) {
  const players = gameLobby.players();
  players.forEach(player => {
    player.dataDidChange = false;
    player.data = player.data || {};
    player.set = (key, value) => {
      player.data[key] = value;
      player.dataDidChange = true;
    };
    player.get = key => {
      return player.data[key];
    };
    player.exit = reason =>
      earlyExitPlayerLobby.call({
        playerId: player._id,
        exitReason: reason,
        gameLobbyId: gameLobby._id
      });
  });

  const treatment = gameLobby.treatment();
  const factors = treatment.factorsObject();

  let selectedPlayers;
  const data = { ...gameLobby.data };
  const dataDidChange = false;

  var gameCollector = {
    players,
    treatment: factors,

    get(k) {
      return data[k];
    },

    set(k, v) {
      data[k] = v;
      dataDidChange = true;
    },

    start(_players) {
      selectedPlayers = _players;
    }
  };

  try {
    config.beforeGameInit(gameCollector);
  } catch (error) {
    console.error("beforeGameInit failed with the following error:");
    console.error(error);
    console.error("failed beforeGameInit: cancelling game");

    earlyExitGameLobby.call({
      exitReason: "beforeGameInitFailed",
      gameLobbyId: gameLobby._id,
      status: "failed"
    });

    return;
  }

  players.forEach(player => {
    if (player.dataDidChange) {
      Players.update(player._id, { $set: { data: player.data } });
    }
  });

  if (dataDidChange) {
    GameLobbies.update(gameLobby._id, { $set: data });
  }

  return selectedPlayers;
}
