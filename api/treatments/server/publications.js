import { Factors } from "../../factors/factors.js";
import { Treatments } from "../treatments";

Meteor.publish("admin-treatments", function({ archived }) {
  if (!this.userId) {
    return null;
  }

  if (archived === undefined) {
    return Treatments.find();
  }

  return Treatments.find({ archivedAt: { $exists: Boolean(archived) } });
});

Meteor.publish("treatment", function(treatmentId) {
  if (!treatmentId) {
    return [];
  }

  const treatment = Treatments.findOne(treatmentId);

  if (!treatment) {
    return [];
  }

  return [
    Treatments.find(treatmentId),
    Factors.find({
      _id: {
        $in: treatment.factorIds
      }
    })
  ];
});
