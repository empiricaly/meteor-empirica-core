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
    const availPlayerIDs = Players.find({
      _id: { $in: playerIDs },
      exitAt: { $exists: false }
    }).map(p => p._id);

    const doneCount = PlayerStages.find({
      stageId,
      playerId: { $in: availPlayerIDs },
      submittedAt: { $exists: true }
    }).count();

    if (doneCount === availPlayerIDs.length) {
      endOfStage(stageId);
    }
  },
  { fetchPrevious: false }
);
