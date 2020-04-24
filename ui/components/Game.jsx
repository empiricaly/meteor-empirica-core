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
      return (
        <ExitSteps
          steps={exitSteps(game, player)}
          game={game}
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
                  gameId: game._id
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
      if (player.readyAt) {
        const gameLobbyProps = {
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
