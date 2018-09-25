import { withTracker } from "meteor/react-meteor-data";
import React from "react";

import { Players } from "../../api/players/players.js";
import { playerWasRetired } from "../../api/players/methods.js";

const defaultPlayerIdKey = "d4900a09cf1f41a494d4fc32a626dfef";

const urlParams = new URLSearchParams(window.location.search);
let playerIdKeyOverride = urlParams.get("playerIdKey");
if (playerIdKeyOverride) {
  playerIdKeyOverride += "-" + defaultPlayerIdKey;
}

const playerIdKey = playerIdKeyOverride || defaultPlayerIdKey;
const playerIdDep = new Tracker.Dependency();

export const getPlayerId = () => {
  playerIdDep.depend();
  return localStorage.getItem(playerIdKey);
};

export const setPlayerId = playerId => {
  if (!playerId) {
    // Avoid storing falsey value
    return;
  }
  const existing = localStorage.getItem(playerIdKey);
  if (existing === playerId) {
    return;
  }
  localStorage.setItem(playerIdKey, playerId);
  playerIdDep.changed();
};

export const removePlayerId = () => {
  localStorage.removeItem(playerIdKey);
  playerIdDep.changed();
};

export default (Component, props) => {
  class IdentifiedContainerInner extends React.Component {
    componentDidMount() {
      const { playerId: _id } = this.props;
      if (_id) {
        playerWasRetired.call({ _id }, (err, wasRetired) => {
          if (!err && wasRetired) {
            removePlayerId();
          }
        });
      }
    }

    render() {
      return <Component {...this.props} {...props} />;
    }
  }

  const HasPlayers = new Mongo.Collection("hasPlayers");
  let hasPlayers = false;
  return withTracker(rest => {
    const playerId = getPlayerId();

    const loading = !Meteor.subscribe("playerInfo", { playerId }).ready();
    const player = Players.findOne();

    // We load a flag telling us if the players were cleared, if so remove the
    // playerId from the local store.
    const hasPlayersObj = HasPlayers.findOne();
    if (hasPlayersObj) {
      if (hasPlayersObj.hasPlayers === false && hasPlayers === true) {
        console.info(`clearing player: (${playerId})`);
        removePlayerId();
      }
      hasPlayers = hasPlayersObj.hasPlayers;
    }

    return {
      ...rest,
      loading,
      playerId,
      player,
      connected: Meteor.status().connected,
      playerIdKey: (playerIdKeyOverride || "").slice(0, 5)
    };
  })(IdentifiedContainerInner);
};
