import { Icon, Intent, Tag, Button } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import moment from "moment";
import React from "react";
import { earlyExitGameLobby } from "../../../api/game-lobbies/methods";
import { earlyExitGame } from "../../../api/games/methods";

export default class AdminBatchGame extends React.Component {
  handleStatusChange = (status, event) => {
    event.preventDefault();
    const { game, lobby } = this.props;
    const endReason = "adminCancelled";

    if (game !== undefined && game._id) {
      earlyExitGame.call({
        gameId: game._id,
        endReason,
        status: status
      });
      return;
    }

    earlyExitGameLobby.call({
      exitReason: endReason,
      gameLobbyId: lobby._id,
      status: status
    });
  };

  render() {
    const { batch, lobby, game, rounds, stages, treatment } = this.props;

    let currentRound;
    let currentStage;
    if (game) {
      currentStage = stages.find(s => s._id === game.currentStageId);
      if (currentStage) {
        currentRound = rounds.find(r => r._id === currentStage.roundId);
      }
    }

    let notReadyPlayers = [];
    let players = (game ? game : lobby).playerIds;
    let bots = [];

    if (!game) {
      notReadyPlayers = lobby.queuedPlayerIds.filter(
        p => players.indexOf(p) < 0
      );
    }

    const playerCountFactor = treatment.factor("playerCount");
    const playerCount = playerCountFactor ? playerCountFactor.value : 0;
    const botsFactor = treatment.factor("botsCount");
    const botsCount = botsFactor && botsFactor.value;
    if (botsCount) {
      players = players.slice(0, players.length - botsCount);
      for (let i = 0; i < botsCount; i++) {
        bots.push(Random.id());
      }
    }

    // _.times(23, () => bots.push(Random.id()));

    let statusMsg;
    let statusIntent;
    let statusMinimal = false;
    let showCancelButton = false;
    if (game && game.status === "cancelled") {
      statusIntent = Intent.DANGER;
      statusMinimal = true;
      statusMsg = "game cancelled";
    } else if (game && game.finishedAt) {
      statusIntent = Intent.SUCCESS;
      statusMinimal = true;
      statusMsg = "finished";
    } else if (lobby.timedOutAt) {
      statusIntent = Intent.DANGER;
      statusMinimal = true;
      statusMsg = "lobby timeout";
    } else if (lobby.status === "cancelled") {
      statusIntent = Intent.DANGER;
      statusMinimal = true;
      statusMsg = "lobby cancelled";
    } else if (batch.status === "cancelled") {
      statusIntent = Intent.DANGER;
      statusMinimal = true;
      statusMsg = "batch cancelled";
    } else if (batch.status === "failed") {
      statusIntent = Intent.DANGER;
      statusMinimal = true;
      statusMsg = "failed";
    } else if (batch.status === "stopped") {
      statusIntent = Intent.DANGER;
      statusMinimal = true;
      statusMsg = "batch stopped";
    } else if (game) {
      statusIntent = Intent.SUCCESS;
      statusMsg = "running";
      showCancelButton = true;
    } else {
      if (players.length === 0) {
        showCancelButton = true;
        if (notReadyPlayers.length === 0) {
          statusMsg = "empty";
          statusMinimal = true;
        } else {
          statusMsg = "pre-lobby";
          statusIntent = Intent.WARNING;
          statusMinimal = true;
        }
      } else {
        showCancelButton = true;
        statusIntent = Intent.WARNING;
        statusMsg = "lobby";
      }
    }

    return (
      <tr>
        <td>{lobby.index + 1}</td>
        <td>
          <Tag intent={statusIntent} minimal={statusMinimal}>
            {statusMsg}
          </Tag>
        </td>
        <td>{treatment.displayName()}</td>

        {game && game.createdAt ? (
          <td title={moment(game.createdAt).format()}>
            {moment(game.createdAt).fromNow()}
          </td>
        ) : (
          <td />
        )}

        {game && game.finishedAt ? (
          <td title={moment(game.finishedAt).format()}>
            {moment(game.finishedAt).fromNow()}
          </td>
        ) : (
          <td />
        )}

        {game && game.finishedAt ? (
          <td title={moment(game.finishedAt).format()}>-</td>
        ) : (
          <>
            <td>
              {currentRound
                ? `Round: ${currentRound.index + 1} / ${rounds.length}`
                : ""}
              {currentStage ? ` > Stage: ${currentStage.displayName}` : ""}
            </td>
          </>
        )}
        <td>{playerCount}</td>
        <td>
          {bots.length > 0 ? (
            <span className="player-group">
              {bots.length > 10 ? (
                <>
                  <span title={`${bots.length} Bots`} key="bots">
                    <Icon
                      icon={IconNames.PERSON}
                      iconSize={16}
                      style={{ color: "#D99E0B" }}
                    />{" "}
                    × {bots.length}
                  </span>
                </>
              ) : (
                bots.map(p => (
                  <span title="Bot" key={p}>
                    <Icon
                      icon={IconNames.PERSON}
                      iconSize={16}
                      style={{ color: "#D99E0B" }}
                    />
                  </span>
                ))
              )}
            </span>
          ) : (
            ""
          )}

          {notReadyPlayers.length > 0 ? (
            <span className="player-group">
              {notReadyPlayers.length > 10 ? (
                <>
                  <span
                    title={`${notReadyPlayers.length} Players in Intro Steps`}
                    key="notReadyPlayers"
                  >
                    <Icon
                      icon={IconNames.PERSON}
                      iconSize={16}
                      style={{ color: "#A7B6C2" }}
                    />
                  </span>{" "}
                  × {notReadyPlayers.length}
                </>
              ) : (
                notReadyPlayers.map(p => (
                  <span title="Player in Intro Steps" key={p}>
                    <Icon
                      icon={IconNames.PERSON}
                      iconSize={16}
                      style={{ color: "#A7B6C2" }}
                    />
                  </span>
                ))
              )}
            </span>
          ) : (
            ""
          )}

          {players.length > 0 ? (
            <span className="player-group">
              {players.length > 10 ? (
                <>
                  <span title={`${players.length} Players`} key="players">
                    <Icon icon={IconNames.PERSON} iconSize={16} />
                  </span>{" "}
                  × {players.length}
                </>
              ) : (
                players.map(p => (
                  <span title="Player" key={p}>
                    <Icon icon={IconNames.PERSON} iconSize={16} />
                  </span>
                ))
              )}
            </span>
          ) : (
            ""
          )}
        </td>
        <td>
          {showCancelButton && (
            <Button
              text="Cancel"
              icon={IconNames.STOP}
              key="cancel"
              onClick={this.handleStatusChange.bind(this, "cancelled")}
            />
          )}
        </td>
      </tr>
    );
  }
}
