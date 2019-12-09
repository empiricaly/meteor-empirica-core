import { GameLobbies } from "../../game-lobbies/game-lobbies";
import { Games } from "../../games/games";
import { Rounds } from "../../rounds/rounds";
import { Stages } from "../../stages/stages";
import { Batches } from "../batches";

Meteor.publish("admin-batches", function(props) {
  if (!this.userId) {
    return null;
  }

  if (!props || props.archived === undefined) {
    return Batches.find();
  }

  return Batches.find({ archivedAt: { $exists: Boolean(props.archived) } });
});

Meteor.publish("admin-batch", function({ batchId }) {
  if (!this.userId) {
    return null;
  }

  if (!batchId) {
    return null;
  }

  return [GameLobbies.find({ batchId }), Games.find({ batchId })];
});

Meteor.publish("admin-batch-game", function({ gameId }) {
  if (!this.userId) {
    return null;
  }

  if (!gameId) {
    return null;
  }

  return [Rounds.find({ gameId }), Stages.find({ gameId })];
});

Meteor.publish("runningBatches", function({ playerId }) {
  return Batches.find(
    { status: "running", full: false },
    { fields: { _id: 1, full: 1 } }
  );
});
