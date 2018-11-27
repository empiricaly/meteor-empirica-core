import { ActivityMonitor } from "../../lib/monitor.js";
import { getPlayerId } from "../../ui/containers/IdentifiedContainer.jsx";
import { updatePlayerStatus } from "../../api/players/methods.js";

try {
  let playerId;
  Meteor.startup(() => {
    Tracker.autorun(function() {
      const newPlayerId = getPlayerId();
      if (newPlayerId === playerId) {
        return;
      }

      if (newPlayerId) {
        Tracker.autorun(function() {
          const idle = ActivityMonitor.isIdle;
          const lastActivityAt = ActivityMonitor.lastActivityAt;
          if (!lastActivityAt) {
            return;
          }

          const id = playerId || newPlayerId;

          if (!id) {
            return;
          }

          updatePlayerStatus.call({
            playerId: id,
            idle,
            lastActivityAt
          });
        });
      }
      playerId = newPlayerId;
    });
  });
} catch (error) {
  console.error(error);
}
