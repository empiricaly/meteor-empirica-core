import { withTracker } from "meteor/react-meteor-data";

import { Players } from "../../../api/players/players.js";
import AdminPlayers from "../../components/admin/AdminPlayers.jsx";

export default withTracker(props => {
  const { retired } = props;
  const loading = !Meteor.subscribe("admin-players", {
    retired
  }).ready();

  return {
    loading,
    retired,
    players: Players.find(
      {
        retiredAt: { $exists: Boolean(retired) }
      },
      { sort: { index: 1 } }
    ).fetch(),
    ...props
  };
})(AdminPlayers);
