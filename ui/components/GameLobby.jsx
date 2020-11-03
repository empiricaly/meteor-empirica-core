import React from "react";

import { Alert, Intent, NonIdealState } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { CoreWrapper } from "./Helpers.jsx";
import {
  endPlayerTimeoutWait,
  extendPlayerTimeoutWait
} from "../../api/players/methods.js";

export default class GameLobby extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps);
  }

  handleWaitLonger = () => {
    extendPlayerTimeoutWait.call({ playerId: this.props.player._id });
  };

  handleExitNow = () => {
    endPlayerTimeoutWait.call({ playerId: this.props.player._id });
  };

  render() {
    const { gameLobby, treatment, timedOut, lobbyConfig, player } = this.props;

    const total = treatment.factor("playerCount").value;
    const exisiting = gameLobby.playerIds.length;

    if (exisiting >= total) {
      return (
        <CoreWrapper>
          <div className="game-lobby">
            <NonIdealState
              icon={IconNames.PLAY}
              title="Game loading..."
              description="Your game will be starting shortly, get ready!"
            />
          </div>
        </CoreWrapper>
      );
    }

    const showExtensionAlert =
      timedOut &&
      lobbyConfig.timeoutType === "individual" &&
      lobbyConfig.extendCount >= player.timeoutWaitCount;

    return (
      <CoreWrapper>
        <div className="game-lobby">
          <NonIdealState
            icon={IconNames.TIME}
            title="Lobby"
            description={
              <>
                <p>Please wait for the game to be ready...</p>
                <p>
                  {exisiting} / {total} players ready.
                </p>
              </>
            }
          />
        </div>
        <Alert
          intent={Intent.PRIMARY}
          isOpen={showExtensionAlert}
          confirmButtonText="Wait Longer"
          cancelButtonText="Exit Now"
          onConfirm={this.handleWaitLonger}
          onCancel={this.handleExitNow}
        >
          <p>
            Sorry you have been waiting for a while. Do you wish to wait longer
            or exit now?
          </p>
        </Alert>
      </CoreWrapper>
    );
  }
}
