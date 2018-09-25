import SimpleSchema from "simpl-schema";

import { Factors } from "../factors/factors.js";
import { TimestampSchema, ArchivedSchema } from "../default-schemas";

export const Treatments = new Mongo.Collection("treatments");

// requiredFactors hold a list of factors keys that are required by
// Empirica core to be able to run a game.
// Required factors are:
// -`playerCount` determines how many players participate in a game and is
//   therefore critical to run a game.
// NOTE(np) I am still not sure this is the right way to decide how many players
// should be in a game. The other potential required factor is botsCount.
// Both of these are fundamental to any game. The information about the number
// of players, whether it's human or computer players, determines many aspects
// of the game. The fact they will influence the game run similarly to other
// factors and are decided while deciding of a batch does not mean they
// cannot be seperatly configured. I think there might be more flexibility and
// clarity if we move these 2 factors into the UI as configuration values for
// game runs, independently of the treatment. More thought needed here.
const requiredFactors = ["playerCount"];

//
// Add playerCount to factors if missing
//

// This is the default playerCount definition
const defaultPlayerCount = {
  description: "The Number of players participating in the given game",
  type: SimpleSchema.Integer,
  min: 1,
  max: 100
};

Treatments.helpers({
  displayName() {
    return this.name || _.map(this.factors(), c => c.fullLabel()).join(" - ");
  },

  factor(name) {
    const type = FactorTypes.findOne({ name });
    return this.factors().find(c => c.factorTypeId === type._id);
  },

  factors() {
    const query = { _id: { $in: this.factorIds } };
    return Factors.find(query).fetch();
  },

  factorsObject() {
    const doc = {};
    this.factors().forEach(c => {
      const type = FactorTypes.findOne(c.factorTypeId);
      doc[type.name] = c.value;
    });
    return doc;
  }
});

Treatments.schema = new SimpleSchema({
  // Optional experimenter given name for the treatment
  name: {
    type: String,
    max: 256,
    optional: true,
    custom() {
      if (this.isSet && Treatments.find({ name: this.value }).count() > 0) {
        return "notUnique";
      }
    }

    // regEx: /^[a-zA-Z0-9_]+$/
  },

  // Array of factorIds
  factorIds: {
    type: Array,
    minCount: requiredFactors.length,
    label: "Factors",
    index: true,
    denyUpdate: true
    // // Custom validation verifies required factors are present and that
    // // there are no duplicate factors with the same key. We cannot easily
    // // verify one of each factors is present.
    // custom() {
    //   if (!Meteor.isServer || !this.isInsert) {
    //     return;
    //   }

    //   const factors = Factors.find({ _id: { $in: this.value } }).fetch();
    //   const doc = {};
    //   factors.forEach(c => (doc[c.type] = c.value));

    //   const context = factorsSchema.newContext();
    //   context.validate(doc);
    //   if (!context.isValid()) {
    //     const error = {
    //       name: "factorIds",
    //       type: "invalid",
    //       details: context.validationErrors()
    //     };
    //     this.addValidationErrors([error]);
    //     return "invalid";
    //   }
    // }
  },

  "factorIds.$": {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: `Factor Item`
  }
});

Treatments.schema.addDocValidator(({ factorIds }) => {
  if (!this.isInsert) {
    return [];
  }
  const query = {
    factorIds: {
      $size: factorIds.length,
      $all: factorIds
    }
  };
  if (Boolean(Treatments.findOne(query))) {
    return [
      {
        name: "factorIds",
        type: "notUnique"
      }
    ];
  }
  return [];
});

Treatments.schema.extend(TimestampSchema);
Treatments.schema.extend(ArchivedSchema);
Treatments.attachSchema(Treatments.schema);
