import { Conditions } from "../conditions.js";
// import { config } from "../../../server";
import { SimpleSchema } from "simpl-schema/dist/SimpleSchema";

let config = {
  conditions: {
    playerCount: {
      description: "The Number of players participating in the given game",
      type: SimpleSchema.Integer,
      min: 1,
      max: 100
    }
  }
};

Meteor.publish("admin-conditions", function() {
  if (!this.userId) {
    return null;
  }

  return [Conditions.find()];
});

Meteor.publish("admin-condition-types", function() {
  if (!this.userId) {
    return null;
  }

  const conditions = _.clone(config.conditions);
  _.each(conditions, (value, key) => {
    switch (value.type) {
      case String:
        value.stringType = "String";
        break;
      case Boolean:
        value.stringType = "Boolean";
        break;
      case SimpleSchema.Integer:
        value.stringType = "Integer";
        break;
      case Number:
        value.stringType = "Number";
        break;
      default:
        console.error("unknown condition type: " + value.type);
        break;
    }
    this.added("condition_types", key, value);
  });

  this.ready();
});
