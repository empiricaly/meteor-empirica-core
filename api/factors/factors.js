import SimpleSchema from "simpl-schema";

import { BelongsTo, TimestampSchema } from "../default-schemas.js";
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

const valueValidation = function() {
  const factorTypeId = this.field("factorTypeId").value;
  const factorType = FactorTypes.findOne(factorTypeId);
  const type = typeConversion[factorType.type];
  const fieldSchema = { type };
  if (factorType.allowedValues && factorType.allowedValues.length > 0) {
    fieldSchema.allowedValues = factorType.allowedValues;
  } else {
    if (factorType.min) {
      fieldSchema.min = factorType.min;
    }
    if (factorType.max) {
      fieldSchema.max = factorType.max;
    }
  }
  const schema = { value: fieldSchema };
  const val = new SimpleSchema(schema).newContext();
  console.log(schema, { value: this.value });

  val.validate({ value: this.value });
  console.log("val.isValid()", val.isValid());

  if (!val.isValid()) {
    this.addValidationErrors(val.validationErrors());
    return false;
  }
};

Factors.schema = new SimpleSchema({
  name: {
    type: String,
    autoValue() {
      if (!this.isSet && (this.isInsert || Meteor.isClient)) {
        return String(this.field("value").value);
      }
    },
    max: 256,
    regEx: /^[a-zA-Z0-9_\.]+$/
  },

  value: {
    type: SimpleSchema.oneOf(
      {
        type: String,
        custom: valueValidation,
        scopedUnique: "type"
      },
      {
        type: SimpleSchema.Integer,
        custom: valueValidation,
        scopedUnique: "type"
      },
      {
        type: Number,
        custom: valueValidation,
        scopedUnique: "type"
      },
      {
        type: Boolean,
        custom: valueValidation,
        scopedUnique: "type"
      }
    )
  }
});

Factors.schema.extend(BelongsTo("FactorTypes"));
Factors.schema.extend(TimestampSchema);
Factors.attachSchema(Factors.schema);
