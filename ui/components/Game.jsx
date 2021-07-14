import React from "react";
import { addPlayerInput } from "../../api/player-inputs/methods.js";
import {
  markPlayerExitStepDone,
  playerReady
} from "../../api/players/methods.js";
import GameLobby from "../components/GameLobby.jsx";
import GameLobbyContainer from "../containers/GameLobbyContainer.jsx";
import DefaultBreadcrumb from "./Breadcrumb.jsx";
import DelayedDisplay from "./DelayedDisplay.jsx";
import ExitSteps from "./ExitSteps.jsx";
import InstructionSteps from "./InstructionSteps.jsx";
import Loading from "./Loading.jsx";
import WaitingForServer from "./WaitingForServer.jsx";

const DelayedWaitingForServer = DelayedDisplay(WaitingForServer, 250);
const DelayedGameLobby = DelayedDisplay(GameLobby, 250);

let playerReadyClicked = false;

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
      Waiting,
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
      return (
        <ExitSteps
          {...rest}
          steps={exitSteps(game || gameLobby, player)}
          game={game || gameLobby}
          player={player}
          onSubmit={(stepName, data) => {
            const playerId = player._id;
            markPlayerExitStepDone.call({ playerId, stepName });
            // Checkig for data.nativeEvent, as that indicates the data is an
            // event object dispached by React.
            if (data && !data.nativeEvent) {
              try {
                const encoded = JSON.stringify(data);
                addPlayerInput.call({
                  playerId,
                  data: encoded,
                  gameId: game && game._id,
                  gameLobbyId: game ? null : gameLobby && gameLobby._id
                });
              } catch (e) {
                console.error("could not encode data returned by onSubmit", e);
              }
            }
          }}
        />
      );
    }

    if (!game) {
      if (playerReadyClicked) {
        return <Loading />;
      }

      if (player.readyAt) {
        const gameLobbyProps = {
          ...rest,
          gameLobby,
          game: gameLobby,
          treatment,
          player
        };

        return (
          <GameLobbyContainer {...gameLobbyProps}>
            {Lobby ? (
              <Lobby {...gameLobbyProps} />
            ) : (
              <DelayedGameLobby {...gameLobbyProps} />
            )}
          </GameLobbyContainer>
        );
      }

      return (
        <InstructionSteps
          {...rest}
          introSteps={introSteps}
          treatment={treatment}
          player={player}
          onDone={() => {
            playerReadyClicked = true;
            playerReady.call({ _id: player._id }, () => {
              playerReadyClicked = false;
            });
          }}
        />
      );
    }

    let content;
    if (timedOut || !started) {
      if (Waiting) {
        content = <Waiting />;
      } else if (treatment.factor("playerCount").value === 1) {
        content = <Loading />;
      } else {
        content = <DelayedWaitingForServer />;
      }
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
