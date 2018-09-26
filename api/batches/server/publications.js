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

Meteor.publish("runningBatches", function({ playerId }) {
  return Batches.find(
    { status: "running", full: false },
    { fields: { _id: 1, full: 1 } }
  );
});
