import Collection2 from "meteor/aldeed:collection2";
import SimpleSchema from "simpl-schema";

// Must be unique scoped by other field (for given value of passed field,
// The current field should be unique). For ex:
//   Name: {
//     Type: String,
//     ScopedUnique: "orgId"
//   }
// Name must be unique for document with equal orgId.
// Documents with different orgId can have same name.
SimpleSchema.extendOptions(["scopedUnique"]);

Collection2.on("schema.attached", (collection, ss) => {
  if (ss.version >= 2) {
    ss.messageBox.messages({
      scopedUnique: "Already exists"
    });
  }

  ss.addValidator(function() {
    if (!this.isSet) {
      return;
    }

    const def = this.definition;
    const uniqueFieldScope = def.scopedUnique;

    if (!uniqueFieldScope) {
      return;
    }

    const val = this.field(uniqueFieldScope).value;
    const key = this.key;
    if (
      collection
        .find({
          [uniqueFieldScope]: val,
          [key]: this.value
        })
        .count() > 0
    ) {
      return "uniqueScoped";
    }
  });
});

// Extend the schema options allowed by SimpleSchema
SimpleSchema.extendOptions(["denyInsert", "denyUpdate"]);

Collection2.on("schema.attached", (collection, ss) => {
  if (
    ss.version >= 2 &&
    ss.messageBox &&
    typeof ss.messageBox.messages === "function"
  ) {
    ss.messageBox.messages({
      en: {
        insertNotAllowed: "{{label}} cannot be set during an insert",
        updateNotAllowed: "{{label}} cannot be set during an update"
      }
    });
  }

  ss.addValidator(function schemaDenyValidator() {
    if (!this.isSet) return;

    const def = this.definition;

    if (def.denyInsert && this.isInsert) return "insertNotAllowed";
    if (def.denyUpdate && (this.isUpdate || this.isUpsert))
      return "updateNotAllowed";
  });
});

// Extend the schema options allowed by SimpleSchema
SimpleSchema.extendOptions([
  "index", // one of Number, String, Boolean
  "unique", // Boolean
  "sparse" // Boolean
]);
