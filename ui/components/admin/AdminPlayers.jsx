import React from "react";

import {
  Button,
  FormGroup,
  HTMLSelect,
  Icon,
  Intent,
  NonIdealState
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { AlertToaster, SuccessToaster } from "../Toasters.jsx";
import { retireGameFullPlayers } from "../../../api/players/methods";
import { exitStatuses } from "../../../api/players/players.js";

export default class AdminPlayers extends React.Component {
  state = { retiredReason: exitStatuses[0] };

  handleChange = event => {
    const retiredReason = event.currentTarget.value;
    this.setState({
      retiredReason
    });
  };

  handleRetirePlayers = event => {
    event.preventDefault();
    const { retiredReason } = this.state;
    retireGameFullPlayers.call({ retiredReason }, (err, playersAffected) => {
      if (err) {
        AlertToaster.show({ message: `Failed to retire players: ${err}` });
      } else {
        SuccessToaster.show({ message: `${playersAffected} players affected` });
      }
    });
  };

  render() {
    const { retiredReason } = this.state;
    return (
      <div className="players">
        <h2>
          <Icon className="admin-header-icon" icon={IconNames.PERSON} /> Players
        </h2>

        <FormGroup label="Exit Status" labelFor="retire">
          <HTMLSelect
            name="retire"
            id="retire"
            onChange={this.handleChange}
            value={retiredReason}
          >
            {_.map(exitStatuses, name => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </HTMLSelect>
          <br />
          <br />
          <Button intent={Intent.PRIMARY} onClick={this.handleRetirePlayers}>
            Retire Players with exitStatus <strong>{retiredReason}</strong>
          </Button>
        </FormGroup>

        <NonIdealState icon={IconNames.BUILD} title="Under construction" />
      </div>
    );
  }
}
