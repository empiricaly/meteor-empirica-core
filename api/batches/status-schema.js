import SimpleSchema from "simpl-schema";

export const statusSchema = new SimpleSchema({
  status: {
    type: String,
    allowedValues: [
      "init", // Batch created, not running yet
      "running", // Batch is running

      // NOTE(np): paused: for now, we don't support paused because we need to do something about timers
      // "paused", // Batch has been pause, ongoing games keep on going but no more new players are accepted. Can be restarted.

      "finished", // Batch has finished and cannot be restarted

      // NOTE(np): cancelled might break a game if it's running at the moment, gotta be careful
      "cancelled", // Batch was cancelled and cannot be restarted
      "failed",
      "custom" // used for game.end("custom reason")
    ],
    defaultValue: "init",
    index: 1
  }
});
