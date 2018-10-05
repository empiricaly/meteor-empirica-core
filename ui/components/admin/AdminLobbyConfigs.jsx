import React from "react";
import { Link } from "react-router-dom";

import { Button, HTMLTable, Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import AdminNewLobbyConfig from "./AdminNewLobbyConfig.jsx";
import AdminLobbyConfig from "./AdminLobbyConfig.jsx";
import Loading from "../Loading.jsx";
import { AdminPageHeader } from "./AdminHeading.jsx";

export default class AdminLobbyConfigs extends React.Component {
  state = { newLobbyIsOpen: false };

  render() {
    const { loading, lobbyConfigs, archived } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <div className="lobbies">
        <AdminPageHeader icon={IconNames.TIME}>
          {archived ? "Archived Lobby Configurations" : "Lobby Configurations"}
        </AdminPageHeader>

        {lobbyConfigs.length === 0 ? (
          <p>
            {archived
              ? "No archived lobby configurations."
              : "No lobby configurations yet, create some bellow."}
          </p>
        ) : (
          <HTMLTable striped>
            <thead>
              <tr>
                <th>Name</th>
                <th>
                  <em>Type</em>
                </th>
                <th>
                  <em>Timeout</em>
                </th>
                <th>
                  <em>Timeout Strategy</em>
                </th>
                <th>
                  <em>Extend Count</em>
                </th>
              </tr>
            </thead>
            <tbody>
              {_.map(lobbyConfigs, lobbyConfig => (
                <AdminLobbyConfig
                  key={lobbyConfig._id}
                  lobbyConfig={lobbyConfig}
                  archived={archived}
                />
              ))}
            </tbody>
          </HTMLTable>
        )}

        {archived ? (
          <p>
            <br />
            <Link to="/admin/lobby-configurations">
              Back to Active Lobby Configurations
            </Link>
          </p>
        ) : (
          <>
            <br />

            <Button
              text="New Lobby Configuration"
              onClick={() => this.setState({ newLobbyIsOpen: true })}
            />

            <AdminNewLobbyConfig
              onClose={() => this.setState({ newLobbyIsOpen: false })}
              isOpen={this.state.newLobbyIsOpen}
            />

            <p>
              <br />
              <Link to="/admin/lobby-configurations/archived">
                View Archived Lobby Configurations
              </Link>
            </p>
          </>
        )}
      </div>
    );
  }
}
