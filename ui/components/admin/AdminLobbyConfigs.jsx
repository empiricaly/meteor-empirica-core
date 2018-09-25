import React from "react";
import { Link } from "react-router-dom";

import {
  Button,
  Classes,
  EditableText,
  HTMLTable,
  Icon,
  Intent
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { updateLobbyConfig } from "../../../api/lobby-configs/methods";

import { AlertToaster } from "../Toasters.jsx";
import Loading from "../Loading.jsx";
import AdminNewLobbyConfig from "./AdminNewLobbyConfig.jsx";

export default class AdminLobbyConfigs extends React.Component {
  state = { newLobbyIsOpen: false };

  render() {
    const { loading, lobbyConfigs, archived } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <div className="lobbies">
        <h2>
          <Icon className="admin-header-icon" icon={IconNames.TIME} />
          {archived ? "Archived Lobby Configurations" : "Lobby Configurations"}
        </h2>
        {lobbyConfigs.length === 0 ? (
          <p>
            {archived
              ? "No archived lobby configurations."
              : "No lobby configurations yet, create some bellow."}
          </p>
        ) : (
          <HTMLTable>
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
              Back to active Lobby Configurations
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

class AdminLobbyConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.lobbyConfig.name || ""
    };
  }

  componentWillUpdate(props) {
    if (props.lobbyConfig.name !== this.props.lobbyConfig.name) {
      this.setState({ name: props.lobbyConfig.name || "" });
    }
  }

  handleNameChange = name => {
    this.setState({ name: name || "" });
  };

  handleNameConfirm = () => {
    const { _id, name: prevName } = this.props.lobbyConfig;
    const { name: nameRaw } = this.state;
    const name = nameRaw.trim();
    if (name === prevName) {
      this.handleNameChange(prevName);
      return;
    }

    updateLobbyConfig.call({ _id, name }, err => {
      if (err) {
        AlertToaster.show({ message: String(err) });
        this.handleNameChange(prevName);
        return;
      }
    });
  };

  handleArchive = () => {
    const {
      archived,
      lobbyConfig: { _id }
    } = this.props;
    updateLobbyConfig.call({ _id, archived: !archived });
  };

  render() {
    const { lobbyConfig, archived } = this.props;
    const { name } = this.state;

    const archiveIntent = archived ? Intent.SUCCESS : Intent.DANGER;
    return (
      <tr>
        <td>
          <EditableText
            onChange={this.handleNameChange}
            onConfirm={this.handleNameConfirm}
            value={name}
          />
        </td>
        <td>{lobbyConfig.timeoutType}</td>
        <td>{lobbyConfig.timeoutInSeconds}s</td>
        <td>
          {lobbyConfig.timeoutType === "lobby"
            ? lobbyConfig.timeoutStrategy
            : "-"}
        </td>
        <td>
          {lobbyConfig.timeoutType === "individual"
            ? lobbyConfig.extendCount
            : "-"}
        </td>
        <td>
          <Button
            text={archived ? "Unarchive" : "Archive"}
            className={Classes.SMALL}
            minimal
            icon={IconNames.BOX}
            intent={archiveIntent}
            onClick={this.handleArchive}
          />
        </td>
      </tr>
    );
  }
}
