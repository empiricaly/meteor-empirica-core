import { withTracker } from "meteor/react-meteor-data";

import { Batches } from "../../../api/batches/batches";
import { Factors } from "../../../api/factors/factors.js";
import { FactorTypes } from "../../../api/factor-types/factor-types.js";
import { LobbyConfigs } from "../../../api/lobby-configs/lobby-configs.js";
import { Treatments } from "../../../api/treatments/treatments";
import AdminBatches from "../../components/admin/AdminBatches";

export default withTracker(props => {
  const batchesLoading = !Meteor.subscribe("admin-batches").ready();
  const treatmentsLoading = !Meteor.subscribe("admin-treatments", {}).ready();
  const factorsLoading = !Meteor.subscribe("admin-factors").ready();
  const factorTypesLoading = !Meteor.subscribe("admin-factor-types").ready();
  const lobbyConfigsLoading = !Meteor.subscribe(
    "admin-lobby-configs",
    {}
  ).ready();

  return {
    loading:
      batchesLoading ||
      treatmentsLoading ||
      factorsLoading ||
      lobbyConfigsLoading ||
      factorTypesLoading,
    batches: Batches.find().fetch(),
    treatments: Treatments.find().fetch(),
    factors: Factors.find().fetch(),
    factorTypes: FactorTypes.find().fetch(),
    lobbyConfigs: LobbyConfigs.find().fetch()
  };
})(AdminBatches);
