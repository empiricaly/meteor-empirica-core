import { withTracker } from "meteor/react-meteor-data";
import { Rounds } from "../../../api/rounds/rounds";
import { Stages } from "../../../api/stages/stages";
import AdminBatchGame from "../../components/admin/AdminBatchGame";

export default withTracker(props => {
  const { game } = props;

  if (!game) {
    return props;
  }

  const { _id: gameId } = game;
  const gameLoading = !Meteor.subscribe("admin-batch-game", {
    gameId
  }).ready();

  const rounds = Rounds.find({ gameId }).fetch();
  const stages = Stages.find({ gameId }).fetch();

  return {
    loading: gameLoading,
    rounds,
    stages,
    ...props
  };
})(AdminBatchGame);
