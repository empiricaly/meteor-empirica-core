import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";

import {
  Button,
  FormGroup,
  HTMLSelect,
  Intent,
  NonIdealState,
  Tag,
  HTMLTable
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { AdminPageHeader } from "./AdminHeading.jsx";
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
    const { players, retired } = this.props;
    const { retiredReason } = this.state;
    return (
      <div className="players">
        <AdminPageHeader icon={IconNames.PERSON}>
          {retired ? "Retired Players" : "Players"}
        </AdminPageHeader>

        {players.length === 0 ? (
          <p>{retired ? "No retired players." : "No players yet."}</p>
        ) : (
          <HTMLTable striped>
            <thead>
              <tr>
                <th>#</th>
                <th>
                  <em>ID</em>
                </th>
                <th>Status</th>
                <th>First Registered</th>
              </tr>
            </thead>
            <tbody>
              {_.map(players, player => (
                <tr key={player._id}>
                  <td>{player.index}</td>
                  <td>{player.id}</td>
                  <td>
                    <Tag
                      intent={
                        player.online
                          ? player.idle
                            ? Intent.WARNING
                            : Intent.SUCCESS
                          : Intent.DANGER
                      }
                    >
                      {player.online
                        ? player.idle
                          ? "idle"
                          : "online"
                        : "offline"}
                    </Tag>
                  </td>
                  <td title={moment(player.createdAt).format()}>
                    {moment(player.createdAt).fromNow()}
                  </td>
                </tr>
              ))}
            </tbody>
          </HTMLTable>
        )}

        {retired ? (
          <p>
            <br />
            <Link to="/admin/players">Back to Active Players</Link>
          </p>
        ) : (
          <>
            <br />

            <p>
              <br />
              <Link to="/admin/players/retired">View Retired Players</Link>
            </p>

            <br />

            <br />

            <h4>Retire Players</h4>

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
              <Button
                intent={Intent.PRIMARY}
                onClick={this.handleRetirePlayers}
              >
                Retire Players with exitStatus <strong>{retiredReason}</strong>
              </Button>
            </FormGroup>
          </>
        )}

        <NonIdealState icon={IconNames.BUILD} title="Under construction" />
      </div>
    );
  }
}
