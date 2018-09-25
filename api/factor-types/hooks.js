import { FactorTypes } from "./factor-types.js";
import { Factors } from "../factors/factors.js";

FactorTypes.after.insert(function(userId, factorType) {
  const { _id: factorTypeId, type, allowedValues } = factorType;
  if (type === "String" && allowedValues && allowedValues.length > 0) {
    allowedValues.forEach(value => Factors.insert({ factorTypeId, value }));
  }
  if (type === "Boolean") {
    [true, false].forEach(value => Factors.insert({ factorTypeId, value }));
  }
});
