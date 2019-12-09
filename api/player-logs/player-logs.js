// PlayerInputs contains small pieces of information associated with a player
// This can be input forms from intro/outro or intermediate input values while
// playing the game (e.g. all values while moving a range input, mouse,
// movements...)

import SimpleSchema from "simpl-schema";

import { TimestampSchema, BelongsTo } from "../default-schemas";

export const PlayerLogs = new Mongo.Collection("player_logs");

PlayerLogs.schema = new SimpleSchema({
  stageId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  roundId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  gameId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  name: {
    type: String,
    max: 255
  },
  jsonData: {
    type: String
  }
});

PlayerLogs.schema.extend(TimestampSchema);
PlayerLogs.schema.extend(BelongsTo("Players"));
PlayerLogs.attachSchema(PlayerLogs.schema);
