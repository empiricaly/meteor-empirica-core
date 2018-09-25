import { Factors } from "../factors.js";

Meteor.publish("admin-factors", function() {
  if (!this.userId) {
    return null;
  }

  return [Factors.find()];
});
