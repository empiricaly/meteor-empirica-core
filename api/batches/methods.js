import SimpleSchema from "simpl-schema";
import { ValidatedMethod } from "meteor/mdg:validated-method";

import { Batches } from "./batches";
import { GameLobbies } from "../game-lobbies/game-lobbies.js";
import { Games } from "../games/games.js";
import { IdSchema } from "../default-schemas";

export const createBatch = new ValidatedMethod({
  name: "Batches.methods.create",

  validate: Batches.schema
    .omit(
      "gameIds",
      "gameLobbyIds",
      "status",
      "createdAt",
      "updatedAt",
      "debugMode",
      "full",
      "index"
    )
    .validator(),

  run(batch) {
    if (!this.userId) {
      throw new Error("unauthorized");
    }

    Batches.insert(batch, {
      autoConvert: false,
      filter: false,
      validate: false
    });
  }
});

export const duplicateBatch = new ValidatedMethod({
  name: "Batches.methods.duplicate",

  validate: IdSchema.validator(),

  run({ _id }) {
    if (!this.userId) {
      throw new Error("unauthorized");
    }

    const batch = Batches.findOne(_id);
    batch.duplicate();
  }
});

export const updateBatch = new ValidatedMethod({
  name: "Batches.methods.updateBatch",

  validate: new SimpleSchema({
    archived: {
      type: Boolean,
      optional: true
    }
  })
    .extend(IdSchema)
    .validator(),

  run({ _id, archived }) {
    if (!this.userId) {
      throw new Error("unauthorized");
    }

    const batch = Batches.findOne(_id);
    if (!batch) {
      throw new Error("not found");
    }

    const $set = {},
      $unset = {};

    if (archived !== undefined) {
      if (archived) {
        if (batch.archivedAt) {
          throw new Error("not found");
        }

        $set.archivedAt = new Date();
        $set.archivedById = this.userId;
      }
      if (!archived) {
        if (!batch.archivedAt) {
          throw new Error("not found");
        }

        $unset.archivedAt = true;
        $unset.archivedById = true;
      }
    }

    const modifier = {};
    if (Object.keys($set).length > 0) {
      modifier.$set = $set;
    }
    if (Object.keys($unset).length > 0) {
      modifier.$unset = $unset;
    }
    if (Object.keys(modifier).length === 0) {
      return;
    }

    Batches.update(_id, modifier);
  }
});

export const updateBatchStatus = new ValidatedMethod({
  name: "Batches.methods.updateStatus",

  validate: Batches.schema
    .pick("status")
    .extend(IdSchema)
    .validator(),

  run({ _id, status }) {
    if (!this.userId) {
      throw new Error("unauthorized");
    }

    const batch = Batches.findOne(_id);
    if (!batch) {
      throw new Error("not found");
    }

    if (status === "init") {
      throw new Error("invalid");
    }

    const $set = { status };

    if (status === "running") {
      $set.runningAt = new Date();
      GameLobbies.update(
        { batchId: _id },
        { $set: { status: "running" } },
        { multi: true }
      );
    }

    Batches.update(_id, { $set });
  }
});

if (Meteor.isDevelopment || Meteor.settings.public.debug_gameDebugMode) {
  export const setBatchInDebugMode = new ValidatedMethod({
    name: "Batches.methods.debugMode",

    validate: IdSchema.validator(),

    run({ _id }) {
      if (!this.userId) {
        throw new Error("unauthorized");
      }

      const batch = Batches.findOne(_id);
      if (!batch) {
        throw new Error("not found");
      }

      Batches.update(_id, { $set: { debugMode: true } });
      GameLobbies.update({ batchId: _id }, { $set: { debugMode: true } });
      Games.update({ batchId: _id }, { $set: { debugMode: true } });
    }
  });
}
