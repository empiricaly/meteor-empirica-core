import { ActivityMonitor } from "../../lib/monitor.js";
import { getPlayerId } from "../../ui/containers/IdentifiedContainer.jsx";
import { updatePlayerStatus } from "../../api/players/methods.js";

try {
  let playerId;
  let computation;
  Meteor.startup(() => {
    Tracker.autorun(function() {
      const newPlayerId = getPlayerId();
      if (newPlayerId === playerId) {
        return;
      }

      if (!newPlayerId) {
        computation.stop();
      } else {
        Tracker.autorun(function(c) {
          computation = c;

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
