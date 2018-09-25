import { FactorTypes } from "../factor-types.js";

Meteor.publish("admin-factor-types", function() {
  if (!this.userId) {
    return null;
  }

  return FactorTypes.find();
});
