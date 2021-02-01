import SimpleSchema from "simpl-schema";
import { Counter } from "../../lib/counters";
import { BelongsTo, TimestampSchema, UserDataSchema } from "../default-schemas";

class PlayersCollection extends Mongo.Collection {
  insert(doc, callback) {
    doc.index = Counter.inc("players");
    return super.insert(doc, callback);
  }
}

export const Players = new PlayersCollection("players");

export const exitStatuses = [
  "gameFull",
  "gameCancelled",
  "gameLobbyTimedOut",
  "playerEndedLobbyWait",
  "playerLobbyTimedOut",
  "finished",
  "cancelled",
  "failed",
  "custom"
];

Players.schema = new SimpleSchema({
  // The Player `id` is used to uniquely identify the player to avoid
  // having a user play multiple times. It can be any string, for example
  // an email address, a Mechanical Turk ID, a manually assigned participation
  // number (saved as string), etc...
  id: {
    type: String,
    max: 256
  },

  // True if the player is currently online and idle
  idle: {
    label: "Idle",
    type: Boolean,
    optional: true
  },

  // True if the player is currently online
  online: {
    label: "Online",
    type: Boolean,
    optional: true
  },

  // Time when the player was last seen online and active
  lastActivityAt: {
    label: "Last Activity At",
    type: Date,
    optional: true
  },

  lastLogin: { type: Object, optional: true },
  "lastLogin.at": { type: Date, optional: true },
  "lastLogin.ip": { type: String, optional: true },
  "lastLogin.userAgent": { type: String, optional: true },

  // Auto-incremented number assigned to players as they are created
  index: {
    type: SimpleSchema.Integer
  },

  // params contains any URL passed parameters
  urlParams: {
    type: Object,
    blackbox: true,
    defaultValue: {}
  },

  bot: {
    label: "Name of bot definition if player is a bot",
    type: String,
    optional: true,
    index: 1
  },

  // Time at witch the player became ready (done with intro)
  readyAt: {
    label: "Ready At",
    type: Date,
    optional: true
  },

  timeoutStartedAt: {
    label: "Time the first player arrived in the lobby",
    type: Date,
    optional: true
  },
  timeoutWaitCount: {
    label: "Number of time the player has waited for timeoutStartedAt",
    type: SimpleSchema.Integer,
    optional: true,
    min: 1
  },

  exitStepsDone: {
    type: Array,
    defaultValue: []
  },
  "exitStepsDone.$": {
    type: String
  },

  // Failed fields are filled when the player's participation in a game failed
  exitAt: {
    label: "Exited At",
    type: Date,
    optional: true
  },
  exitStatus: {
    label: "Failed Status",
    type: String,
    optional: true,
    allowedValues: exitStatuses
  },
  exitReason: {
    label: "Failed Reason",
    type: String,
    optional: true,
    regEx: /[a-zA-Z0-9_]+/
  },

  // A player can be retired. Retired players should no longer be used in active
  // game, but NOTHING is done in the code to block that from happening. It's
  // more of an indicator for debugging down the line.
  retiredAt: {
    label: "Retired At",
    type: Date,
    optional: true
  },
  retiredReason: {
    label: "Retired Reason",
    type: String,
    optional: true,
    allowedValues: exitStatuses
  }
});

Players.schema.extend(TimestampSchema);
Players.schema.extend(UserDataSchema);
Players.schema.extend(BelongsTo("Games", false));
Players.schema.extend(BelongsTo("GameLobbies", false));
Players.attachSchema(Players.schema);
