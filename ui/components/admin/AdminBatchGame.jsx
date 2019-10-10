import { Icon, Intent, Tag } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import moment from "moment";
import React from "react";

export default class AdminBatchGame extends React.Component {
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

    const botsFactor = treatment.factor("botsCount");
    const botsCount = botsFactor && botsFactor.value;
    if (botsCount) {
      players = players.slice(0, players.length - botsCount);
      for (let i = 0; i < botsCount; i++) {
        bots.push({ bot: "bob" });
      }
    }

    let statusMsg;
    let statusIntent;
    let statusMinimal = false;
    if (game && game.finishedAt) {
      statusIntent = Intent.SUCCESS;
      statusMinimal = true;
      statusMsg = "finished";
    } else if (batch.status === "cancelled") {
      statusIntent = Intent.DANGER;
      statusMinimal = true;
      statusMsg = "batch cancelled";
    } else if (batch.status === "stopped") {
      statusIntent = Intent.DANGER;
      statusMinimal = true;
      statusMsg = "batch stopped";
    } else if (game) {
      statusIntent = Intent.SUCCESS;
      statusMsg = "running";
    } else {
      if (lobby.timedOutAt) {
        statusIntent = Intent.DANGER;
        statusMinimal = true;
        statusMsg = "lobby timeout";
      } else if (players.length === 0) {
        if (notReadyPlayers.length === 0) {
          statusMsg = "empty";
          statusMinimal = true;
        } else {
          statusMsg = "pre-lobby";
          statusIntent = Intent.WARNING;
          statusMinimal = true;
        }
      } else {
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
        <td>
          {bots.map(p => (
            <Icon
              title="Bot"
              icon={IconNames.PERSON}
              iconSize={16}
              style={{ color: "#D99E0B" }}
            />
          ))}
          {notReadyPlayers.map(p => (
            <Icon
              title="Player in Intro Steps"
              icon={IconNames.PERSON}
              iconSize={16}
              style={{ color: "#A7B6C2" }}
            />
          ))}
          {players.map(p => (
            <Icon icon={IconNames.PERSON} iconSize={16} title="Player" />
          ))}
        </td>
      </tr>
    );
  }
}
