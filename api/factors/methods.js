import { ValidatedMethod } from "meteor/mdg:validated-method";

import { Factors } from "./factors.js";
import { IdSchema } from "../default-schemas.js";

export const createFactor = new ValidatedMethod({
  name: "Factors.methods.create",

  validate: Factors.schema.omit("createdAt", "updatedAt").validator(),

  run(factor) {
    if (!this.userId) {
      throw new Error("unauthorized");
    }

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
