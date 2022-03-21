// augment.js
import { updateGameData, earlyExitGame } from "../games/methods.js";
import { updateGameLobbyData } from "../game-lobbies/methods";
import { updatePlayerRoundData } from "../player-rounds/methods";
import { PlayerRounds } from "../player-rounds/player-rounds";
import {
  updatePlayerData,
  earlyExitPlayer,
  earlyExitPlayerLobby
} from "../players/methods.js";
import { playerLog } from "../player-logs/methods.js";
import { updateRoundData } from "../rounds/methods.js";
import { updateStageData } from "../stages/methods.js";
import { submitPlayerStage, updatePlayerStageData } from "./methods";
import { PlayerStages } from "./player-stages";

const gameSet = (gameId, append = false) => (key, value) => {
  updateGameData.call({
    gameId,
    key,
    value: JSON.stringify(value),
    append,
    noCallback: Meteor.isServer
  });
};

const gameLobbySet = (gameLobbyId, append = false) => (key, value) => {
  updateGameLobbyData.call({
    gameLobbyId,
    key,
    value: JSON.stringify(value),
    append,
    noCallback: Meteor.isServer
  });
};

const playerSet = (playerId, append = false) => (key, value) => {
  updatePlayerData.call({
    playerId,
    key,
    value: JSON.stringify(value),
    append,
    noCallback: Meteor.isServer
  });
};
const stageSet = (playerStageId, append = false) => (key, value) => {
  updatePlayerStageData.call({
    playerStageId,
    key,
    value: JSON.stringify(value),
    append,
    noCallback: Meteor.isServer
  });
};
const stageSubmit = playerStageId => cb => {
  submitPlayerStage.call(
    {
      playerStageId,
      noCallback: Meteor.isServer
    },
    cb
  );
};
const roundSet = (playerRoundId, append = false) => (key, value) => {
  updatePlayerRoundData.call({
    playerRoundId,
    key,
    value: JSON.stringify(value),
    append,
    noCallback: Meteor.isServer
  });
};

// Once the operation has succeeded (no throw), set the value
// undefined is not supported, null is, replace undefineds by nulls.
const set = (obj, func) => (k, v) => {
  const val = v === undefined ? null : v;
  func(k, val);
  obj[k] = val;
};

const append = (obj, func) => (k, v) => {
  const val = v === undefined ? null : v;
  func(k, val);
  if (!obj[k]) {
    obj[k] = [];
  }
  obj[k].push(val);
};

const nullFunc = () => {
  throw "You called .get(...) or .set(...) but there is no data for the player yet. Did the game run for this player?";
};

export const augmentGameLobby = gameLobby => {
  gameLobby.get = key => gameLobby.data[key];
  gameLobby.set = set(gameLobby.data, gameLobbySet(gameLobby._id));
  gameLobby.append = append(gameLobby.data, gameLobbySet(gameLobby._id, true));
};

export const augmentPlayerLobby = (
  player,
  round = {},
  stage = {},
  gameLobby = {}
) => {
  const { _id: playerId } = player;

  player.exit = reason =>
    earlyExitPlayerLobby.call({
      playerId,
      exitReason: reason,
      gameLobbyId: gameLobby._id
    });
  player.get = key => player.data[key];
  player.set = set(player.data, playerSet(playerId));
  player.append = append(player.data, playerSet(playerId, true));
  player.log = (name, data) => {
    playerLog.call({
      playerId,
      name,
      jsonData: JSON.stringify(data),
      stageId: stage._id,
      roundId: round._id,
      gameLobbyId: gameLobby._id
    });
  };
};

export const augmentPlayer = (player, stage = {}, round = {}, game = {}) => {
  const { _id: playerId } = player;

  player.exit = reason =>
    earlyExitPlayer.call({
      playerId,
      exitReason: reason,
      gameId: game._id
    });
  player.get = key => player.data[key];
  player.set = set(player.data, playerSet(playerId));
  player.append = append(player.data, playerSet(playerId, true));
  player.log = (name, data) => {
    playerLog.call({
      playerId,
      name,
      jsonData: JSON.stringify(data),
      stageId: stage._id,
      roundId: round._id,
      gameId: game._id
    });
  };
};

export const augmentPlayerStageRound = (
  player,
  stage = {},
  round = {},
  game = {}
) => {
  const { _id: playerId } = player;

  augmentPlayer(player, stage, round, game);

  if (stage) {
    const playerStage = PlayerStages.findOne({
      stageId: stage._id,
      playerId
    });
    stage.get = key => playerStage.data[key];
    stage.set = set(playerStage.data, stageSet(playerStage._id));
    stage.append = append(playerStage.data, stageSet(playerStage._id, true));
    stage.submit = stageSubmit(playerStage._id, err => {
      if (!err) {
        stage.submitted = true;
      }
    });
    stage.submitted = Boolean(playerStage.submittedAt);
    stage.submittedAt = playerStage.submittedAt;
  }

  if (round) {
    const playerRound = PlayerRounds.findOne({
      roundId: round._id,
      playerId
    });
    round.get = key => playerRound.data[key];
    round.set = set(playerRound.data, roundSet(playerRound._id));
    round.append = append(playerRound.data, roundSet(playerRound._id, true));
  }
};

export const stubPlayerStageRound = (player, stage, round) => {
  player.get = nullFunc;
  player.set = nullFunc;
  player.append = nullFunc;

  if (stage) {
    stage.get = nullFunc;
    stage.set = nullFunc;
    stage.append = nullFunc;
    stage.submit = nullFunc;
    stage.submitted = false;
  }

  if (round) {
    round.get = nullFunc;
    round.set = nullFunc;
    round.append = nullFunc;
  }
};

export const augmentGameStageRound = (game, stage, round) => {
  if (game) {
    game.get = key => game.data[key];
    game.set = set(game.data, gameSet(game._id));
    game.append = append(game.data, gameSet(game._id, true));
    game.end = endReason =>
      earlyExitGame.call({
        gameId: game._id,
        endReason,
        status: "custom"
      });
  }

  if (stage) {
    stage.get = key => {
      return stage.data[key];
    };
    stage.set = set(stage.data, (key, value) => {
      updateStageData.call({
        stageId: stage._id,
        key,
        value: JSON.stringify(value),
        append: false,
        noCallback: Meteor.isServer
      });
    });
    stage.append = append(stage.data, (key, value) => {
      updateStageData.call({
        stageId: stage._id,
        key,
        value: JSON.stringify(value),
        append: true,
        noCallback: Meteor.isServer
      });
    });
    stage.submit = () => {
      throw "You cannot submit the entire stage at the moment";
    };
  }

  if (round) {
    round.get = key => {
      return round.data[key];
    };
    round.set = set(round.data, (key, value) => {
      updateRoundData.call({
        roundId: round._id,
        key,
        value: JSON.stringify(value),
        append: false,
        noCallback: Meteor.isServer
      });
    });
    round.append = append(round.data, (key, value) => {
      updateRoundData.call({
        roundId: round._id,
        key,
        value: JSON.stringify(value),
        append: true,
        noCallback: Meteor.isServer
      });
    });
  }
};

export const stubStageRound = (stage, round) => {
  stage.get = nullFunc;
  stage.set = nullFunc;
  stage.append = nullFunc;
  stage.submit = nullFunc;
  round.get = nullFunc;
  round.set = nullFunc;
  round.append = nullFunc;
};
