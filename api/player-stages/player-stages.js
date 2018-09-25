import SimpleSchema from "simpl-schema";

import { TimestampSchema, UserDataSchema, BelongsTo } from "../default-schemas";

export const PlayerStages = new Mongo.Collection("player_stages");

PlayerStages.schema = new SimpleSchema({
  submittedAt: {
    type: Date,
    denyInsert: true,
    optional: true,
    index: 1
  }
});

PlayerStages.schema.extend(TimestampSchema);
PlayerStages.schema.extend(UserDataSchema);
PlayerStages.schema.extend(BelongsTo("Players"));
PlayerStages.schema.extend(BelongsTo("Stages"));
PlayerStages.schema.extend(BelongsTo("Rounds"));
PlayerStages.schema.extend(BelongsTo("Games"));
PlayerStages.schema.extend(BelongsTo("Batches"));
PlayerStages.attachSchema(PlayerStages.schema);
