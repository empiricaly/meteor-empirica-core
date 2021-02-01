import { HTMLTable } from "@blueprintjs/core";
import React from "react";
import AdminBatchGameContainer from "../../containers/admin/AdminBatchGameContainer.jsx";
import LoadingInline from "../LoadingInline.jsx";

export default class AdminBatchGames extends React.Component {
  render() {
    const { loading, batch, games, gameLobbies, treatments } = this.props;

    if (loading) {
      return (
        <>
          <td colSpan={2} />
          <td colSpan={5} style={{ textAlign: "center" }}>
            <LoadingInline />
          </td>
        </>
      );
    }

    return (
      <>
        <td colSpan={2} />
        <td colSpan={6}>
          <HTMLTable
            condensed
            className="bp3-html-table-bordered batch-games-table"
          >
            <thead>
              <tr>
                <th>#</th>
                <th>Status</th>
                <th>Treatment</th>
                <th>Start Time</th>
                <th>Finish Time</th>
                <th>Current State</th>
                <th>Player Count</th>
                <th>Players</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {gameLobbies.map(lobby => (
                <AdminBatchGameContainer
                  key={lobby._id}
                  batch={batch}
                  lobby={lobby}
                  game={games.find(g => g._id === lobby.gameId)}
                  treatment={treatments.find(t => t._id === lobby.treatmentId)}
                />
              ))}
            </tbody>
          </HTMLTable>
        </td>
      </>
    );
  }
}
