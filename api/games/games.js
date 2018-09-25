import SimpleSchema from "simpl-schema";

import { statusSchema } from "../batches/status-schema";
import { BelongsTo, HasManyByRef, TimestampSchema } from "../default-schemas";
import { DebugModeSchema, UserDataSchema } from "../default-schemas.js";

export const Games = new Mongo.Collection("games");

Games.schema = new SimpleSchema({
  estFinishedTime: {
    type: Date,
    index: 1
  },
  finishedAt: {
    type: Date,
    optional: true,
    index: 1
  },
  currentStageId: {
    type: String,
    optional: true,
    regEx: SimpleSchema.RegEx.Id,
    index: 1
  }
});

if (Meteor.isDevelopment || Meteor.settings.public.debug_gameDebugMode) {
  Games.schema.extend(DebugModeSchema);
}

Games.schema.extend(TimestampSchema);
Games.schema.extend(UserDataSchema);
Games.schema.extend(BelongsTo("GameLobbies", false));
Games.schema.extend(BelongsTo("Treatments"));
Games.schema.extend(HasManyByRef("Rounds"));
Games.schema.extend(HasManyByRef("Players"));
Games.schema.extend(BelongsTo("Batches"));
// We are denormalizing the parent batch status in order to make clean queries
Games.schema.extend(statusSchema);
Games.attachSchema(Games.schema);
