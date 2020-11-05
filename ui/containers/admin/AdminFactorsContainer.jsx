import { withTracker } from "meteor/react-meteor-data";

import { Factors } from "../../../api/factors/factors.js";
import { FactorTypes } from "../../../api/factor-types/factor-types.js";
import { Treatments } from "../../../api/treatments/treatments";
import AdminFactors from "../../components/admin/AdminFactors.jsx";

export default withTracker(props => {
  const { archived } = props;
  const treatmentsLoading = !Meteor.subscribe("admin-treatments", {}).ready();
  const factorsLoading = !Meteor.subscribe("admin-factors").ready();
  const typesLoading = !Meteor.subscribe("admin-factor-types").ready();

  return {
    loading: treatmentsLoading || factorsLoading || typesLoading,
    treatments: Treatments.find().fetch(),
    factors: Factors.find(
      { archivedAt: { $exists: Boolean(archived) } },
      { sort: { value: 1 } }
    ).fetch(),
    factorTypes: FactorTypes.find({
      archivedAt: { $exists: Boolean(archived) }
    }).fetch(),
    archived
  };
})(AdminFactors);
