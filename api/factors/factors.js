import SimpleSchema from "simpl-schema";
import {
  ArchivedSchema,
  BelongsTo,
  TimestampSchema
} from "../default-schemas.js";
import { FactorTypes } from "../factor-types/factor-types.js";

export const Factors = new Mongo.Collection("factors");

Factors.helpers({
  label() {
    let label = this.name;
    const value = String(this.value);
    if (label !== value) {
      label += ` (${value})`;
    }
    return label;
  },

  factorType() {
    return FactorTypes.findOne(this.factorTypeId);
  },

  factorTypeName() {
    const t = this.factorType();
    return t && t.name;
  },

  fullLabel() {
    return `${this.factorTypeName()}: ${this.label()}`;
  }
});

export const typeConversion = {
  Integer: SimpleSchema.Integer,
  String: String,
  Number: Number,
  Boolean: Boolean
};

Factors.valueValidation = function(factorType, value, simpleSchmemaType) {
  const type = typeConversion[factorType.type];

  if (simpleSchmemaType && simpleSchmemaType !== type) {
    return;
  }

  const fieldSchema = { type };
  if (factorType.min) {
    fieldSchema.min = factorType.min;
  }
  if (factorType.max) {
    fieldSchema.max = factorType.max;
  }
  const schema = { value: fieldSchema };
  const val = new SimpleSchema(schema).newContext();

  val.validate({ value });

  if (!val.isValid()) {
    return val.validationErrors();
  }

  if (Factors.find({ factorTypeId: factorType._id, value }).count() > 0) {
    return [{ name: "value", type: "scopedUnique" }];
  }
};

const valueValidation = function() {
  if (this.key !== "value") {
    return;
  }
  const factorTypeId = this.field("factorTypeId").value;
  const factorType = FactorTypes.findOne(factorTypeId);
  const value = this.value;
  const errors = Factors.valueValidation(factorType, value);

  if (errors) {
    this.addValidationErrors(errors);
    return false;
  }
};

Factors.schema = new SimpleSchema({
  name: {
    type: String,
    autoValue() {
      if (!this.isSet && (this.isInsert || Meteor.isClient)) {
        return String(this.field("value").value).slice(0, 32);
      }
    },
    max: 256,
    regEx: /^[a-zA-Z0-9_\.]+$/
  },

  value: {
    type: SimpleSchema.oneOf(
      {
        type: String
      },
      {
        type: SimpleSchema.Integer
      },
      {
        type: Number
      },
      {
        type: Boolean
      }
    )
  }
});

Factors.schema.addValidator(valueValidation);
Factors.schema.extend(ArchivedSchema);
Factors.schema.extend(BelongsTo("FactorTypes"));
Factors.schema.extend(TimestampSchema);
Factors.attachSchema(Factors.schema);
