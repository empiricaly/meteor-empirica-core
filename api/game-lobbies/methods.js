import shared from "../../shared.js";
import { ValidatedMethod } from "meteor/mdg:validated-method";
import SimpleSchema from "simpl-schema";

import { GameLobbies } from "./game-lobbies";
import { Players } from "../players/players";
import { Batches } from "../batches/batches.js";

export const updateGameLobbyData = new ValidatedMethod({
  name: "GameLobbies.methods.updateData",

  validate: new SimpleSchema({
    gameLobbyId: {
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

  run({ gameLobbyId, key, value, append, noCallback }) {
    const gameLobby = GameLobbies.findOne(gameLobbyId);
    if (!gameLobby) {
      throw new Error("game lobbies not found");
    }
    // TODO check can update this record game

    const val = JSON.parse(value);
    let update = { [`data.${key}`]: val };
    const modifier = append ? { $push: update } : { $set: update };

    GameLobbies.update(gameLobbyId, modifier, {
      autoConvert: false,
      filter: false,
      validate: false,
      trimStrings: false,
      removeEmptyStrings: false
    });

    if (Meteor.isServer && !noCallback) {
      shared.callOnChange({
        conn: this.connection,
        gameLobbyId,
        gameLobby,
        key,
        value: val,
        prevValue: gameLobby.data && gameLobby.data[key],
        append
      });
    }
  }
});

export const earlyExitGameLobby = new ValidatedMethod({
  name: "GameLobbies.methods.earlyExit",

  validate: new SimpleSchema({
    exitReason: {
      label: "Reason for Exit",
      type: String,
      regEx: /[a-zA-Z0-9_]+/
    },
    gameLobbyId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    }
  }).validator(),

  run({ exitReason, gameLobbyId }) {
    if (!Meteor.isServer) {
      return;
    }

    const gameLobby = GameLobbies.findOne(gameLobbyId);
    if (!gameLobby) {
      throw new Error("gameLobby not found");
    }

    Players.update(
      { gameLobbyId },
      {
        $set: {
          exitAt: new Date(),
          exitStatus: "failed",
          exitReason
        }
      }
    );

    GameLobbies.update(gameLobbyId, {
      $set: {
        status: "failed",
        endReason: exitReason
      }
    });

    Batches.update(
      { gameLobbyIds: gameLobbyId },
      {
        $set: {
          status: "failed",
          finishedAt: new Date()
        }
      }
    );
  }
});
