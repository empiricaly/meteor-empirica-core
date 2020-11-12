import { ValidatedMethod } from "meteor/mdg:validated-method";
import SimpleSchema from "simpl-schema";

import { IdSchema } from "../default-schemas.js";
import { FactorTypes } from "../factor-types/factor-types.js";
import { Factors } from "../factors/factors.js";
import { Treatments } from "./treatments";

export const createTreatment = new ValidatedMethod({
  name: "Treatments.methods.create",

  validate: new SimpleSchema({
    name: {
      type: String,
      max: 256,
      optional: true
    },
    factorIds: {
      type: Array,
      label: "Factors"
    },
    "factorIds.$": {
      type: String
    }
  }).validator(),

  run(treatment) {
    if (!this.userId) {
      throw new Error("unauthorized");
    }

    // Validate the required factor types
    const requiredFactorTypes = FactorTypes.find({
      required: true,
      archivedAt: { $exists: false }
    }).fetch();

    if (requiredFactorTypes.length > 0) {
      const createdFactors = Factors.find({
        _id: { $in: treatment.factorIds }
      }).fetch();
      const createdFactorTypes = FactorTypes.find({
        $and: [
          {
            _id: {
              $in: createdFactors.map(f => f.factorTypeId)
            }
          },
          { required: true }
        ]
      }).fetch();

      if (requiredFactorTypes.length !== createdFactorTypes.length) {
        throw new Error("Fill all required factors!");
      }
    }

    Treatments.insert(treatment);
  }
});

export const updateTreatment = new ValidatedMethod({
  name: "Treatments.methods.update",

  validate: Treatments.schema
    .pick("name")
    .extend(
      new SimpleSchema({
        archived: {
          type: Boolean,
          optional: true
        }
      })
    )
    .extend(IdSchema)
    .validator(),

  run({ _id, name, archived }) {
    if (!this.userId) {
      throw new Error("unauthorized");
    }
    const treatment = Treatments.findOne(_id);
    if (!treatment) {
      throw new Error("not found");
    }

    const $set = {},
      $unset = {};
    if (name !== undefined) {
      $set.name = name;
    }
    if (archived !== undefined) {
      if (archived) {
        if (treatment.archivedAt) {
          throw new Error("not found");
        }

        $set.archivedAt = new Date();
        $set.archivedById = this.userId;
      }
      if (!archived) {
        if (!treatment.archivedAt) {
          throw new Error("not found");
        }

        $unset.archivedAt = true;
        $unset.archivedById = true;
      }
    }

    const modifier = {};
    if (Object.keys($set).length > 0) {
      modifier.$set = $set;
    }
    if (Object.keys($unset).length > 0) {
      modifier.$unset = $unset;
    }
    if (Object.keys(modifier).length === 0) {
      return;
    }

    Treatments.update(_id, modifier);
  }
});
