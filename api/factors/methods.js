import { ValidatedMethod } from "meteor/mdg:validated-method";
import SimpleSchema from "simpl-schema";

import { Factors } from "./factors.js";
import { FactorTypes } from "../factor-types/factor-types.js";
import { IdSchema } from "../default-schemas.js";
import { handleFactorValueErrorMessage } from "../../lib/utils.js";

export const createFactor = new ValidatedMethod({
  name: "Factors.methods.create",

  validate: Factors.schema.omit("createdAt", "updatedAt").validator(),

  run(factor) {
    if (!this.userId) {
      throw new Error("unauthorized");
    }

    const factorType = FactorTypes.findOne(factor.factorTypeId);
    if (!factorType) {
      throw new Error("not found");
    }

    const errors = Factors.valueValidation(factorType, factor.value);
    if (errors) {
      throw new Error(
        errors.map(e => handleFactorValueErrorMessage(e)).join("\n")
      );
    }

    Factors.insert(factor, { autoConvert: false });
  }
});

export const updateFactor = new ValidatedMethod({
  name: "Factors.methods.update",

  validate: Factors.schema
    .pick("name")
    .extend(IdSchema)
    .extend(
      new SimpleSchema({
        archived: {
          type: Boolean,
          optional: true
        }
      })
    )
    .validator(),

  run({ _id, name, archived }) {
    if (!this.userId) {
      throw new Error("unauthorized");
    }

    const factor = Factors.findOne(_id);
    if (!factor) {
      throw new Error("not found");
    }

    const $set = {},
      $unset = {};
    if (name !== undefined) {
      $set.name = name;
    }

    if (archived !== undefined) {
      if (archived) {
        if (factor.archivedAt) {
          throw new Error("not found");
        }

        $set.archivedAt = new Date();
        $set.archivedById = this.userId;
      }

      if (!archived) {
        if (!factor.archivedAt) {
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

    Factors.update(_id, modifier);
  }
});
