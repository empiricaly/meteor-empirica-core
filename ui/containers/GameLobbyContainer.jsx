import { TimeSync } from "meteor/mizzao:timesync";
import { withTracker } from "meteor/react-meteor-data";
import React from "react";
import moment from "moment";

import { LobbyConfigs } from "../../api/lobby-configs/lobby-configs.js";

export default class GameLobbyContainer extends React.Component {
  render() {
    return <div>{this.props.children}</div>;
  }
}

return withTracker(({ gameLobby, player, ...rest }) => {
  const lobbyConfig = LobbyConfigs.findOne(gameLobby.lobbyConfigId);

  // TimeSync.serverTime() is a reactive source that will trigger this
  // withTracker function every 1s.
  const now = moment(TimeSync.serverTime(null, 100));

  const startObj = lobbyConfig.timeoutType === "lobby" ? gameLobby : player;
  const startTimeAt = moment(startObj.timeoutStartedAt);
  const endTimeAt = startTimeAt.add(lobbyConfig.timeoutInSeconds, "seconds");
  const timedOut = now.isSameOrAfter(endTimeAt);
  const remainingSeconds = endTimeAt.diff(now, "seconds");
  if (remainingSeconds && remainingSeconds < 0) {
    remainingSeconds = 0;
  }
  const elapsedSeconds = now.diff(startTimeAt, "seconds");

  return {
    lobbyConfig,
    gameLobby,
    player,
    timedOut,
    remainingSeconds,
    elapsedSeconds,
    // endTimeAt,
    ...rest
  };
})(GameLobbyContainer);
