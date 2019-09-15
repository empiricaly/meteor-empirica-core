import { withTracker } from "meteor/react-meteor-data";
import { GameLobbies } from "../../../api/game-lobbies/game-lobbies";
import { Games } from "../../../api/games/games";
import AdminBatchGames from "../../components/admin/AdminBatchGames";

export default withTracker(props => {
  const { batchId } = props;
  const batchLoading = !Meteor.subscribe("admin-batch", {
    batchId
  }).ready();

  return {
    loading: batchLoading,
    games: Games.find({ batchId }).fetch(),
    gameLobbies: GameLobbies.find({ batchId }).fetch(),
    ...props
  };
})(AdminBatchGames);
