import { FactorTypes } from "./factor-types.js";
import { Factors } from "../factors/factors.js";

FactorTypes.after.insert(function(userId, factorType) {
  const { _id: factorTypeId, type } = factorType;
  if (type === "Boolean") {
    [true, false].forEach(value => Factors.insert({ factorTypeId, value }));
  }
});
