import { withTracker } from "meteor/react-meteor-data";

import { Batches } from "../../../api/batches/batches";
import { Factors } from "../../../api/factors/factors.js";
import { FactorTypes } from "../../../api/factor-types/factor-types.js";
import { LobbyConfigs } from "../../../api/lobby-configs/lobby-configs.js";
import { Treatments } from "../../../api/treatments/treatments";
import AdminBatches from "../../components/admin/AdminBatches";

export default withTracker(props => {
  const { archived } = props;
  const batchesLoading = !Meteor.subscribe("admin-batches", {
    archived
  }).ready();
  const treatmentsLoading = !Meteor.subscribe("admin-treatments", {}).ready();
  const factorsLoading = !Meteor.subscribe("admin-factors").ready();
  const factorTypesLoading = !Meteor.subscribe("admin-factor-types").ready();
  const lobbyConfigsLoading = !Meteor.subscribe(
    "admin-lobby-configs",
    {}
  ).ready();

  const batches = Batches.find(
    {
      archivedAt: { $exists: Boolean(archived) }
    },
    { sort: { index: 1 } }
  ).fetch();
  const sortedBatches = [];

  if (batches.length > 0) {
    const runningBatches = [];
    const initBatches = [];

    batches.forEach(b => {
      switch (b.status) {
        case "running":
        case "finished":
          runningBatches.push(b);
          break;
        case "init":
          initBatches.push(b);
          break;

        default:
          sortedBatches.push(b);
          break;
      }
    });

    if (runningBatches.length > 0) {
      sortedBatches.push(
        ...runningBatches.sort((a, b) => a.runningAt - b.runningAt)
      );
    }

    if (initBatches.length > 0) {
      sortedBatches.push(...initBatches);
    }
  }

  return {
    loading:
      batchesLoading ||
      treatmentsLoading ||
      factorsLoading ||
      lobbyConfigsLoading ||
      factorTypesLoading,
    batches: sortedBatches,
    treatments: Treatments.find().fetch(),
    factors: Factors.find().fetch(),
    factorTypes: FactorTypes.find().fetch(),
    lobbyConfigs: LobbyConfigs.find().fetch(),
    ...props
  };
})(AdminBatches);
