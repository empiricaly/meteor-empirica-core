import React from "react";
import { Link } from "react-router-dom";

import { Button, Classes, EditableText, Intent } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { updateLobbyConfig } from "../../../api/lobby-configs/methods";

import { AlertToaster } from "../Toasters.jsx";

export default class AdminLobbyConfig extends React.Component {
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
