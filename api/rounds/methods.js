import { ValidatedMethod } from "meteor/mdg:validated-method";
import SimpleSchema from "simpl-schema";

import { Rounds } from "./rounds.js";
import shared from "../../shared.js";

export const updateRoundData = new ValidatedMethod({
  name: "Rounds.methods.updateData",

  validate: new SimpleSchema({
    roundId: {
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

  run({ roundId, key, value, append, noCallback }) {
    const round = Rounds.findOne(roundId);
    if (!round) {
      throw new Error("round not found");
    }
    // TODO check can update this record round

    const val = JSON.parse(value);
    let update = { [`data.${key}`]: val };
    const modifier = append ? { $push: update } : { $set: update };

    Rounds.update(roundId, modifier, {
      autoConvert: false,
      filter: false,
      validate: false,
      trimStrings: false,
      removeEmptyStrings: false
    });

    if (Meteor.isServer && !noCallback) {
      shared.callOnChange({
        conn: this.connection,
        roundId,
        round,
        key,
        value: val,
        prevValue: round.data && round.data[key],
        append
      });
    }
  }
});
