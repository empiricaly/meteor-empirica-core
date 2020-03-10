import shared from "../../shared.js";
import { ValidatedMethod } from "meteor/mdg:validated-method";
import SimpleSchema from "simpl-schema";

import { Games } from "./games.js";
import { GameLobbies } from "../game-lobbies/game-lobbies.js";
import { Players } from "../players/players.js";

export const updateGameData = new ValidatedMethod({
  name: "Games.methods.updateData",

  validate: new SimpleSchema({
    gameId: {
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

  run({ gameId, key, value, append, noCallback }) {
    const game = Games.findOne(gameId);
    if (!game) {
      throw new Error("game not found");
    }
    // TODO check can update this record game

    const val = JSON.parse(value);
    let update = { [`data.${key}`]: val };
    const modifier = append ? { $push: update } : { $set: update };

    Games.update(gameId, modifier, {
      autoConvert: false,
      filter: false,
      validate: false,
      trimStrings: false,
      removeEmptyStrings: false
    });

    if (Meteor.isServer && !noCallback) {
      shared.callOnChange({
        conn: this.connection,
        gameId,
        game,
        key,
        value: val,
        prevValue: game.data && game.data[key],
        append
      });
    }
  }
});

export const earlyExitGame = new ValidatedMethod({
  name: "Games.methods.earlyExitGame",

  validate: new SimpleSchema({
    gameId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    endReason: {
      label: "Reason for End",
      type: String,
      regEx: /[a-zA-Z0-9_]+/
    }
  }).validator(),

  run({ gameId, endReason }) {
    if (this.connection) {
      throw new Error("not allowed");
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

    Games.update(gameId, {
      $set: {
        finishedAt: new Date(),
        status: "custom",
        endReason
      }
    });

    GameLobbies.update(
      { gameId },
      {
        $set: {
          status: "custom",
          endReason
        }
      }
    );

    game.playerIds.forEach(playerId =>
      Players.update(playerId, {
        $set: {
          exitAt: new Date(),
          exitStatus: "custom",
          exitReason: endReason
        }
      })
    );
  }
});
