import { ValidatedMethod } from "meteor/mdg:validated-method";

import { Factors } from "./factors.js";
import { FactorTypes } from "../factor-types/factor-types.js";
import { IdSchema } from "../default-schemas.js";

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
    // const errors = Factors.valueValidation(factorType, factor.value);
    // if (errors) {
    //   throw new Error(errors.map(e => e.type).join(", "));
    // }

    Factors.insert(factor, { autoConvert: false });
  }
});

export const updateFactor = new ValidatedMethod({
  name: "Factors.methods.update",

  validate: Factors.schema
    .pick("name")
    .extend(IdSchema)
    .validator(),

  run({ _id, name }) {
    if (!this.userId) {
      throw new Error("unauthorized");
    }

    Factors.update(_id, { $set: { name } });
  }
});
