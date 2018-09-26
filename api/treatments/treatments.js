import SimpleSchema from "simpl-schema";

import { Factors } from "../factors/factors.js";
import { FactorTypes } from "../factor-types/factor-types.js";
import { TimestampSchema, ArchivedSchema } from "../default-schemas";

export const Treatments = new Mongo.Collection("treatments");

Treatments.helpers({
  displayName() {
    return this.name || _.map(this.factors(), c => c.fullLabel()).join(" - ");
  },

  factor(name) {
    const type = FactorTypes.findOne({ name });
    if (!type) {
      return;
    }
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
    minCount: FactorTypes.requiredTypes,
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
