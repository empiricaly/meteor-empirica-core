import { HTMLTable } from "@blueprintjs/core";
import React from "react";
import AdminBatchGameContainer from "../../containers/admin/AdminBatchGameContainer.jsx";
import LoadingInline from "../LoadingInline.jsx";

export default class AdminBatchGames extends React.Component {
  render() {
    const { loading, batch, games, gameLobbies, treatments } = this.props;

    if (loading) {
      return (
        <tr>
          <td colSpan={2} />
          <td colSpan={5} style={{ textAlign: "center" }}>
            <LoadingInline />
          </td>
        </tr>
      );
    }

    return (
      <tr>
        <td colSpan={2} />
        <td colSpan={5}>
          <HTMLTable condensed>
            {/* <thead>
              <tr>
                <th>#</th>
                <th>Status</th>
                <th>Game Count</th>
                <th>Created</th>
                <th>Assignment</th>
                <th>Configuration</th>
                <th></th>
              </tr>
            </thead> */}

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
      </tr>
    );
  }
}
