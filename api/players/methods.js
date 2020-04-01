import { ValidatedMethod } from "meteor/mdg:validated-method";
import SimpleSchema from "simpl-schema";

import { Batches } from "../batches/batches.js";
import { GameLobbies } from "../game-lobbies/game-lobbies";
import { IdSchema } from "../default-schemas.js";
import { LobbyConfigs } from "../lobby-configs/lobby-configs.js";
import { Players } from "./players";
import { exitStatuses } from "./players.js";
import { weightedRandom } from "../../lib/utils.js";
import shared from "../../shared.js";

export const createPlayer = new ValidatedMethod({
  name: "Players.methods.create",

  validate: new SimpleSchema({
    id: {
      type: String
    },
    urlParams: {
      type: Object,
      blackbox: true,
      defaultValue: {}
    }
  }).validator(),

  run(player) {
    const existing = Players.findOne({ id: player.id });

    if (existing) {
      return existing._id;
    }

    return Players.insert(player, {
      filter: false,
      validate: false
    });
  }
});

export const updatePlayerData = new ValidatedMethod({
  name: "Players.methods.updateData",

  validate: new SimpleSchema({
    playerId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    key: {
      type: String
    },
    value: {
      type: String
    },
    append: {
      type: Boolean,
      optional: true
    },
    noCallback: {
      type: Boolean,
      optional: true
    }
  }).validator(),

  run({ playerId, key, value, append, noCallback }) {
    const player = Players.findOne(playerId);
    if (!player) {
      throw new Error("player not found");
    }
    // TODO check can update this record player

    const val = JSON.parse(value);
    let update = { [`data.${key}`]: val };
    const modifier = append ? { $push: update } : { $set: update };

    Players.update(playerId, modifier, {
      autoConvert: false,
      filter: false,
      validate: false,
      trimStrings: false,
      removeEmptyStrings: false
    });

    if (Meteor.isServer && !noCallback) {
      shared.callOnChange({
        playerId,
        player,
        key,
        value: val,
        prevValue: player.data && player.data[key],
        append
      });
    }
  }
});

export const playerUpdateIntroStepIndex = new ValidatedMethod({
  name: "Players.methods.updateIntroStepIndex",

  validate: new SimpleSchema({
    playerId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    introStepIndex: {
      type: String
    },
    type: {
      type: "string",
      defaultValue: "intro"
    }
  }).validator(),

  run({ playerId, introStepIndex, type }) {
    const player = Players.findOne(playerId);
    if (!player) {
      throw new Error("player not found");
    }

    if (type === "intro") {
      Players.update(playerId, { $set: { introStepIndex } });
    }

    if (type === "preAssign") {
      Players.update(playerId, { $set: { preAssignStepIndex } });
    }
  }
});

export const introStepsDone = new ValidatedMethod({
  name: "Players.methods.introStepsDone",

  validate: new SimpleSchema({
    id: {
      type: String
    },
    type: {
      type: "string",
      defaultValue: "intro"
    }
  }).validator(),

  run({ _id, type }) {
    introStepsDone;

    const player = Players.findOne(_id);

    if (!player) {
      throw `unknown ready player: ${_id}`;
    }

    if (type === "intro") {
      if (player.introStepsDone) {
        throw `player already finished introSteps: ${_id}`;
      }

      Players.update(_id, { $set: { introStepsDone: new Date() } });
    }

    if (type === "preAssign") {
      if (player.preAssignStepsDone) {
        throw `player already finished preAssignStep: ${_id}`;
      }

      Players.update(_id, { $set: { preAssignStepsDone: new Date() } });
    }
  }
});

export const markPlayerExitStepDone = new ValidatedMethod({
  name: "Players.methods.markExitStepDone",

  validate: new SimpleSchema({
    playerId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    stepName: {
      type: String
    }
  }).validator(),

  run({ playerId, stepName }) {
    const player = Players.findOne(playerId);
    if (!player) {
      throw new Error("player not found");
    }
    // TODO check can update this record player

    Players.update(playerId, { $addToSet: { exitStepsDone: stepName } });
  }
});

export const extendPlayerTimeoutWait = new ValidatedMethod({
  name: "Players.methods.extendTimeoutWait",

  validate: new SimpleSchema({
    playerId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    }
  }).validator(),

  run({ playerId }) {
    const player = Players.findOne(playerId);
    if (!player) {
      throw new Error("player not found");
    }

    Players.update(playerId, {
      $inc: { timeoutWaitCount: 1 },
      $set: { timeoutStartedAt: new Date() }
    });
  }
});

export const endPlayerTimeoutWait = new ValidatedMethod({
  name: "Players.methods.endTimeoutWait",

  validate: new SimpleSchema({
    playerId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    }
  }).validator(),

  run({ playerId }) {
    const player = Players.findOne(playerId);
    if (!player) {
      throw new Error("player not found");
    }

    Players.update(playerId, {
      $set: {
        exitStatus: "playerEndedLobbyWait",
        exitAt: new Date()
      }
    });
    GameLobbies.update(player.gameLobbyId, {
      $pull: {
        playerIds: playerId
        // We keep the player in queuedPlayerIds so they will still have the
        // fact they were in a lobby available in the UI, and so we can show
        // them the exit steps.
      }
    });
  }
});

export const earlyExitPlayer = new ValidatedMethod({
  name: "Players.methods.admin.earlyExitPlayer",

  validate: new SimpleSchema({
    exitReason: {
      label: "Reason for Exit",
      type: String,
      regEx: /[a-zA-Z0-9_]+/
    },
    playerId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    gameId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    }
  }).validator(),

  run({ exitReason, playerId, gameId }) {
    if (!Meteor.isServer) {
      return;
    }

    const game = Games.findOne(gameId);

    if (!game) {
      throw new Error("game not found");
    }

    if (game && game.finishedAt) {
      if (Meteor.isDevelopment) {
        console.log("\n\ngame already ended!");
      }

      return;
    }

    const currentPlayer = Players.findOne(playerId);

    if (currentPlayer && currentPlayer.exitAt) {
      if (Meteor.isDevelopment) {
        console.log("\nplayer already exited!");
      }

      return;
    }

    Players.update(playerId, {
      $set: {
        exitAt: new Date(),
        exitStatus: "custom",
        exitReason
      }
    });

    const players = Players.find({ gameId }).fetch();
    const onlinePlayers = players.filter(player => !player.exitAt);

    if (!onlinePlayers || (onlinePlayers && onlinePlayers.length === 0)) {
      Games.update(gameId, {
        $set: {
          finishedAt: new Date(),
          status: "custom",
          endReason: "finished_early"
        }
      });

      GameLobbies.update(
        { gameId },
        {
          $set: {
            status: "custom",
            endReason: "finished_early"
          }
        }
      );
    }
  }
});

export const retireGameFullPlayers = new ValidatedMethod({
  name: "Players.methods.admin.retireGameFull",

  validate: new SimpleSchema({
    retiredReason: {
      label: "Retired Reason",
      type: String,
      optional: true,
      allowedValues: exitStatuses
    }
  }).validator(),

  run({ retiredReason }) {
    if (!this.userId) {
      throw new Error("unauthorized");
    }

    const players = Players.find({
      exitStatus: retiredReason,
      retiredAt: { $exists: false }
    }).fetch();

    const timestamp = new Date().toISOString();

    for (let i = 0; i < players.length; i++) {
      const player = players[i];

      Players.update(player._id, {
        $set: {
          id: `${player.id} (Retired ${retiredReason} at ${timestamp})`,
          retiredAt: new Date(),
          retiredReason
        }
      });
    }

    return players.length;
  }
});

export const playerWasRetired = new ValidatedMethod({
  name: "Players.methods.playerWasRetired",

  validate: IdSchema.validator(),

  run({ _id }) {
    return Boolean(
      Players.findOne({
        _id,
        exitStatus: { $exists: true },
        retiredAt: { $exists: true }
      })
    );
  }
});

export const updatePlayerStatus = new ValidatedMethod({
  name: "Players.methods.updateStatus",

  validate: new SimpleSchema({
    playerId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },

    idle: {
      type: Boolean
    },

    lastActivityAt: {
      type: Date
    }
  }).validator(),

  run({ playerId, idle, lastActivityAt }) {
    if (Meteor.isServer) {
      const playerIdConn = shared.playerIdForConn(this.connection);
      if (!playerIdConn) {
        return;
      }
      if (playerId !== playerIdConn) {
        console.error(
          "Attempting to update player status from wrong connection"
        );
        return;
      }
    }

    Players.update(playerId, {
      $set: {
        idle,
        lastActivityAt
      }
    });
  }
});
