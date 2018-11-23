import React from "react";

import { addPlayerInput } from "../../api/player-inputs/methods.js";
import {
  markPlayerExitStepDone,
  playerReady
} from "../../api/players/methods.js";
import DefaultBreadcrumb from "./Breadcrumb.jsx";
import DelayedDisplay from "./DelayedDisplay.jsx";
import ExitSteps from "./ExitSteps.jsx";
import GameLobbyContainer from "../containers/GameLobbyContainer.jsx";
import InstructionSteps from "./InstructionSteps.jsx";
import Loading from "./Loading.jsx";
import WaitingForServer from "./WaitingForServer.jsx";

const DelayedWaitingForServer = DelayedDisplay(WaitingForServer, 250);
const DelayedGameLobby = DelayedDisplay(GameLobbyContainer, 250);

export default class Game extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps);
  }

  render() {
    const {
      loading,
      gameLobby,
      treatment,
      Round,
      Breadcrumb,
      Lobby,
      exitSteps,
      introSteps,
      ...rest
    } = this.props;
    const { started, timedOut, game, player, round, stage } = rest;

    if (loading) {
      return <Loading />;
    }

    if (player.exitAt) {
      const steps = exitSteps && exitSteps(game, player);

      return (
        <ExitSteps
          steps={steps}
          game={game}
          player={player}
          onSubmit={(stepName, data) => {
            const playerId = player._id;
            markPlayerExitStepDone.call({ playerId, stepName });
            if (data) {
              addPlayerInput.call({
                playerId,
                data: JSON.stringify(data),
                gameId: game._id
              });
            }
          }}
        />
      );
    }

    if (!game) {
      if (player.readyAt) {
        const TheLobby = Lobby || DelayedGameLobby;
        return (
          <TheLobby
            gameLobby={gameLobby}
            treatment={treatment}
            player={player}
          />
        );
      }

      return (
        <InstructionSteps
          introSteps={introSteps}
          treatment={treatment}
          player={player}
          onDone={() => {
            playerReady.call({ _id: player._id });
          }}
        />
      );
    }

    let content;
    if (timedOut || !started) {
      // If there's only one player, don't say waiting on other players,
      // just show the loading screen.
      if (treatment.factor("playerCount").value === 1) {
        content = <Loading />;
      }

      content = <DelayedWaitingForServer />;
    } else {
      content = <Round {...rest} />;
    }

    const BC = Breadcrumb !== undefined ? Breadcrumb : DefaultBreadcrumb;
    const breadcrumb = BC && (
      <BC game={game} player={player} round={round} stage={stage} />
    );

    return (
      <div className="game">
        {breadcrumb}
        {content}
      </div>
    );
  }
}
