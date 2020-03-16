import SimpleSchema from "simpl-schema";
import { Counter } from "../../lib/counters";
import { statusSchema } from "../batches/status-schema";
import { BelongsTo, HasManyByRef, TimestampSchema } from "../default-schemas";
import { DebugModeSchema, UserDataSchema } from "../default-schemas.js";
import { GameLobbies } from "../game-lobbies/game-lobbies";
import { Treatments } from "../treatments/treatments";
import { Batches } from "../batches/batches";
import { Players } from "../players/players";
import { Stages } from "../stages/stages";
import { Rounds } from "../rounds/rounds";

class GamesCollection extends Mongo.Collection {
  insert(doc, callback) {
    doc.index = Counter.inc("games");
    return super.insert(doc, callback);
  }
}

export const Games = new GamesCollection("games");

Games.helpers({
  getGameLobby() {
    return GameLobbies.findOne({ _id: this.gameLobbyId });
  },
  getBatch() {
    return Batches.findOne({ _id: this.batchId });
  },
  getPlayers() {
    return Players.find({ _id: { $in: this.playerIds } }).fetch();
  },
  getCurrentStage() {
    return Stages.findOne({ _id: this.currentStageId });
  },
  getCurrentRound() {
    return Rounds.findOne({ gameId: this._id, index: this.index });
  },
  getStages() {
    return Stages.find({ gameId: this._id }).fetch();
  },
  getRounds() {
    return Rounds.find({ gameId: this._id }).fetch();
  }
});

Games.schema = new SimpleSchema({
  // Auto-incremented number assigned to games as they are created
  index: {
    type: SimpleSchema.Integer
  },

  // estFinishedTime is adding up all stages timings when the game is
  // created/started to estimate when the game should be done at the latests.
  estFinishedTime: {
    type: Date,
    index: 1
  },

  // Time the game actually finished
  finishedAt: {
    type: Date,
    optional: true,
    index: 1
  },

  // Indicates which stage is ongoing
  currentStageId: {
    type: String,
    optional: true,
    regEx: SimpleSchema.RegEx.Id,
    index: 1
  },

  endReason: {
    label: "Ended Reason",
    type: String,
    optional: true,
    regEx: /[a-zA-Z0-9_]+/
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
