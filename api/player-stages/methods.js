import { ValidatedMethod } from "meteor/mdg:validated-method";
import SimpleSchema from "simpl-schema";
import { PlayerStages } from "./player-stages";
import shared from "../../shared.js";

export const updatePlayerStageData = new ValidatedMethod({
  name: "PlayerStages.methods.updateData",

  validate: new SimpleSchema({
    playerStageId: {
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

  run({ playerStageId, key, value, append, noCallback }) {
    const playerStage = PlayerStages.findOne(playerStageId);
    if (!playerStage) {
      throw new Error("playerStage not found");
    }

    // TODO check can update this record playerStage

    const val = JSON.parse(value);
    let update = { [`data.${key}`]: val };
    const modifier = append ? { $push: update } : { $set: update };

    PlayerStages.update(playerStageId, modifier, {
      autoConvert: false,
      filter: false,
      validate: false,
      trimStrings: false,
      removeEmptyStrings: false
    });

    if (Meteor.isServer && !noCallback) {
      shared.callOnChange({
        playerId: playerStage.playerId,
        playerStageId,
        playerStage,
        key,
        value: val,
        prevValue: playerStage.data && playerStage.data[key],
        append
      });
    }
  }
});

export const submitPlayerStage = new ValidatedMethod({
  name: "PlayerStages.methods.submit",

  validate: new SimpleSchema({
    playerStageId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    noCallback: {
      type: Boolean,
      optional: true
    }
  }).validator(),

  run({ playerStageId, noCallback }) {
    const playerStage = PlayerStages.findOne(playerStageId);
    if (!playerStage) {
      throw new Error("playerStage not found");
    }
    // TODO check can update this record playerStage

    if (playerStage.submittedAt) {
      if (Meteor.isDevelopment) {
        console.log("stage already submitted");
      }

      return;
    }

    PlayerStages.update(playerStageId, { $set: { submittedAt: new Date() } });

    if (Meteor.isServer && !noCallback) {
      shared.callOnSubmit({
        playerId: playerStage.playerId,
        playerStage
      });
    }
  }
});
