import { FactorTypes } from "../factor-types.js";
import log from "../../../lib/log.js";
import { bootstrapFunctions } from "../../../startup/server/bootstrap.js";

const defaultTypes = [
  {
    name: "playerCount",
    description: "The Number of players participating in the given game.",
    type: "Integer",
    min: 1,
    required: true
  }
];

bootstrapFunctions.push(() => {
  defaultTypes.forEach(type => {
    const exists = FactorTypes.findOne({ name: type.name });
    if (exists) {
      return;
    }
    log.info(`Inserting default Factor Type: ${type.name}`);
    try {
      FactorTypes.insert(type);
    } catch (error) {
      log.error(`Failed to insert '${type.name}' default Factor Type: ${err}`);
    }
  });
});
