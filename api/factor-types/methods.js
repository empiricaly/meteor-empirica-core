import SimpleSchema from "simpl-schema";
import { ValidatedMethod } from "meteor/mdg:validated-method";

import { FactorTypes } from "./factor-types.js";
import { IdSchema } from "../default-schemas.js";

export const createFactorType = new ValidatedMethod({
  name: "FactorTypes.methods.create",

  validate: FactorTypes.schema.omit("createdAt", "updatedAt").validator(),

  run(factorType) {
    if (!this.userId) {
      throw new Error("unauthorized");
    }

    FactorTypes.insert(factorType, { autoConvert: false });
  }
});

export const updateFactorType = new ValidatedMethod({
  name: "FactorTypes.methods.update",

  validate: new SimpleSchema({
    archived: {
      type: Boolean,
      optional: true
    }
  })
    .extend(IdSchema)
    .validator(),

  run({ _id, archived }) {
    if (!this.userId) {
      throw new Error("unauthorized");
    }
    const factorType = FactorTypes.findOne(_id);
    if (!factorType) {
      throw new Error("not found");
    }

    const $set = {},
      $unset = {};

    if (archived !== undefined) {
      if (archived) {
        if (factorType.archivedAt) {
          throw new Error("not found");
        }

        $set.archivedAt = new Date();
        $set.archivedById = this.userId;
      }
      if (!archived) {
        if (!factorType.archivedAt) {
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

    FactorTypes.update(_id, modifier);
  }
});
