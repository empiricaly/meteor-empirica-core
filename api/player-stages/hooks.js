// See if everyone is done with this stage
import { PlayerStages } from "./player-stages";
import { endOfStage } from "../stages/finish.js";
import { Players } from "../players/players";

PlayerStages.after.update(
  function(userId, playerStage, fieldNames, modifier, options) {
    if (!fieldNames.includes("submittedAt")) {
      return;
    }
    const { stageId } = playerStage;

    const playerIDs = PlayerStages.find({ stageId }).map(p => p.playerId);
    const totalCount = Players.find({
      _id: { $in: playerIDs },
      exitAt: { $exists: false }
    }).count();

    const doneCount = PlayerStages.find({
      stageId,
      submittedAt: { $exists: true }
    }).count();

    if (totalCount === doneCount) {
      endOfStage(stageId);
    }
  },
  { fetchPrevious: false }
);
