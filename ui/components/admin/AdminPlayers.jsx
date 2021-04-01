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
  HTMLTable,
  Classes
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { AdminPageHeader } from "./AdminHeading.jsx";
import { AlertToaster, SuccessToaster } from "../Toasters.jsx";
import {
  retireGameFullPlayers,
  retireSinglePlayer
} from "../../../api/players/methods";
import { exitStatuses } from "../../../api/players/players.js";

export default class AdminPlayers extends React.Component {
  state = {
    retiredReason: exitStatuses[0],
    players: [],
    searchParam: { id: "", createdAt: "", status: "", exitStatus: "" }
  };

  componentDidMount() {
    const { players } = this.props;
    this.setState({
      players: players
    });
  }

  componentDidUpdate(prevProps) {
    const { players } = this.props;

    if (prevProps.players.length !== players.length) {
      this.setState({
        players: players
      });
    }
  }

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

  handleRetireSinglePlayer = (event, playerId) => {
    event.preventDefault();
    retireSinglePlayer.call({ playerId }, (err, _) => {
      if (err) {
        AlertToaster.show({ message: `Failed to retire player: ${err}` });
      } else {
        SuccessToaster.show({
          message: `Succeed to retire player`
        });
      }
    });
  };

  handleColumnHeaderChange = (event, key) => {
    const value = event.currentTarget.value;

    this.setState(
      {
        searchParam: { ...this.state.searchParam, [key]: value }
      },
      this.filterPlayers
    );
  };

  filterPlayers = () => {
    const {
      searchParam: { createdAt, id, status, exitStatus }
    } = this.state;
    const { players } = this.props;

    this.setState({
      players: players
        .filter(p => {
          // Filter id
          if (!id) {
            return true;
          }

          return p.id.includes(id);
        })
        .filter(p => {
          // Filter status
          if (!status) {
            return true;
          }

          switch (status) {
            case "online":
              return p.online && p.idle === false;

            case "offline":
              return !p.online;

            case "idle":
              return p.idle;

            default:
              return true;
          }
        })
        .filter(p => {
          // Filter createdAt
          if (!createdAt) {
            return true;
          }

          const fromNow = moment(p.createdAt).fromNow();
          return fromNow.includes(createdAt);
        })
        .filter(p => {
          // Filter exitStatus
          if (!exitStatus) {
            return true;
          }

          return p.exitStatus ? p.exitStatus.includes(exitStatus) : false;
        })
    });
  };

  render() {
    const { retired } = this.props;
    const { retiredReason, players, searchParam } = this.state;

    return (
      <div className="players">
        <AdminPageHeader icon={IconNames.PERSON}>
          {retired ? "Retired Players" : "Players"}
        </AdminPageHeader>

        {this.props.players.length === 0 ? (
          <p>{retired ? "No retired players." : "No players yet."}</p>
        ) : (
          <HTMLTable striped>
            <thead>
              <tr>
                <th>#</th>
                <th>
                  <input
                    className={Classes.INPUT}
                    value={searchParam.id}
                    type="text"
                    placeholder="ID"
                    onChange={e => this.handleColumnHeaderChange(e, "id")}
                  />
                </th>
                <th>
                  <input
                    className={Classes.INPUT}
                    value={searchParam.status}
                    type="text"
                    placeholder="Status"
                    onChange={e => this.handleColumnHeaderChange(e, "status")}
                  />
                </th>
                <th>
                  <input
                    className={Classes.INPUT}
                    value={searchParam.createdAt}
                    type="text"
                    placeholder="First Registered"
                    onChange={e =>
                      this.handleColumnHeaderChange(e, "createdAt")
                    }
                  />
                </th>
                <th>
                  <input
                    className={Classes.INPUT}
                    value={searchParam.exitStatus}
                    type="text"
                    placeholder="Exit Status"
                    onChange={e =>
                      this.handleColumnHeaderChange(e, "exitStatus")
                    }
                  />
                </th>
                <th />
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
                  <td>{player.exitStatus}</td>
                  <td>
                    {!player.retireAt && (
                      <Button
                        text={"Retire"}
                        className={Classes.SMALL}
                        minimal
                        icon={IconNames.LOG_OUT}
                        intent={Intent.DANGER}
                        onClick={e =>
                          this.handleRetireSinglePlayer(e, player._id)
                        }
                      />
                    )}
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
      </div>
    );
  }
}
