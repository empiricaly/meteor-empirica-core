import { withTracker } from "meteor/react-meteor-data";

import { FactorTypes } from "../../../api/factor-types/factor-types.js";
import { Factors } from "../../../api/factors/factors.js";
import { Treatments } from "../../../api/treatments/treatments";
import AdminTreatments from "../../components/admin/AdminTreatments";

export default withTracker(props => {
  const { archived } = props;
  const treatmentsLoading = !Meteor.subscribe("admin-treatments", {
    archived
  }).ready();
  const factorsLoading = !Meteor.subscribe("admin-factors").ready();
  const typesLoading = !Meteor.subscribe("admin-factor-types").ready();

  return {
    loading: treatmentsLoading || factorsLoading,
    typesLoading,
    treatments: Treatments.find().fetch({
      archivedAt: { $exists: Boolean(archived) }
    }),
    factors: Factors.find(
      { archivedAt: { $exists: Boolean(archived) } },
      { sort: { value: 1 } }
    ).fetch(),
    factorTypes: FactorTypes.find().fetch(),
    ...props
  };
})(AdminTreatments);
