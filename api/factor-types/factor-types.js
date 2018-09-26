import SimpleSchema from "simpl-schema";
import { ArchivedSchema, TimestampSchema } from "../default-schemas.js";

export const FactorTypes = new Mongo.Collection("factor_types");

FactorTypes.helpers({});

FactorTypes.requiredTypes = ["playerCount"];
FactorTypes.types = ["String", "Integer", "Number", "Boolean"];
FactorTypes.schema = new SimpleSchema({
  required: {
    type: Boolean
  },

  name: {
    type: String,
    max: 256,
    regEx: /^[a-z]+[a-zA-Z0-9]*$/,
    index: true,
    unique: true,
    custom() {
      if (this.isSet && FactorTypes.find({ name: this.value }).count() > 0) {
        return "notUnique";
      }
    }
  },

  description: {
    type: String,
    min: 1,
    max: 2048
  },

  type: {
    type: String,
    allowedValues: FactorTypes.types
  },

  min: {
    type: Number,
    optional: true
  },

  max: {
    type: Number,
    optional: true
  }
});

FactorTypes.schema.messageBox.messages({
  en: {
    notUnique: "{{label}} already exists."
  }
});

FactorTypes.schema.extend(ArchivedSchema);
FactorTypes.schema.extend(TimestampSchema);
FactorTypes.attachSchema(FactorTypes.schema);
