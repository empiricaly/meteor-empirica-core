import { ValidatedMethod } from "meteor/mdg:validated-method";
import SimpleSchema from "simpl-schema";

import { PlayerLogs } from "./player-logs.js";
import { Players } from "../players/players.js";

// playerLog is non-destructive, it just keeps adding onto a player's logs.
export const playerLog = new ValidatedMethod({
  name: "PlayerLogs.methods.add",

  validate: new SimpleSchema({
    playerId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    stageId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true
    },
    roundId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true
    },
    gameId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true
    },
    name: {
      type: String,
      max: 255
    },
    jsonData: {
      type: String
    }
  }).validator(),

  run({ playerId, gameId, roundId, stageId, name, jsonData }) {
    const player = Players.findOne(playerId);
    if (!player) {
      throw new Error("player not found");
    }

    PlayerLogs.insert(
      { playerId, gameId, roundId, stageId, name, jsonData },
      {
        autoConvert: false,
        filter: false,
        validate: false,
        trimStrings: false,
        removeEmptyStrings: false
      }
    );
  }
});
