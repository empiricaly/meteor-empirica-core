import React from "react";
import inflection from "inflection";

import {
  Classes,
  Button,
  Dialog,
  FormGroup,
  HTMLSelect,
  Intent,
  NumericInput
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { AlertToaster } from "../Toasters.jsx";
import { LobbyConfigs } from "../../../api/lobby-configs/lobby-configs.js";
import { createLobbyConfig } from "../../../api/lobby-configs/methods.js";
import HelpTooltip from "../HelpTooltip.jsx";

export default class AdminNewLobbyConfig extends React.Component {
  state = {
    name: "",
    timeoutInSeconds: LobbyConfigs.defaultTimeoutInSeconds,
    timeoutType: LobbyConfigs.timeoutTypes[0],
    timeoutStrategy: LobbyConfigs.timeoutStrategies[0],
    extendCount: 0
  };

  handleChange = ({ currentTarget: { value, name } }) => {
    this.setState({ [name]: value.trim() });
  };

  handleIntChange = (name, value) => {
    this.setState({ [name]: value });
  };

  handleNewLobbyConfig = event => {
    const { onClose } = this.props;
    const {
      name,
      timeoutInSeconds,
      timeoutType,
      timeoutStrategy,
      extendCount
    } = this.state;
    event.preventDefault();

    const params = { timeoutInSeconds, timeoutType };
    if (name !== "") {
      params.name = name;
    }
    if (timeoutType === "lobby") {
      params.timeoutStrategy = timeoutStrategy;
    } else if (timeoutType === "individual") {
      params.extendCount = extendCount;
    }

    createLobbyConfig.call(params, err => {
      if (err) {
        AlertToaster.show({ message: String(err.message) });
        return;
      }
      onClose();
      this.setState({
        name: ""
      });
    });
  };

  render() {
    const { isOpen, onClose } = this.props;
    const {
      name,
      timeoutType,
      timeoutStrategy,
      timeoutInSeconds,
      extendCount
    } = this.state;

    return (
      <Dialog
        icon={IconNames.TIME}
        isOpen={isOpen}
        onClose={onClose}
        title="New Lobby Configuration"
      >
        <form className="new-treatment" onSubmit={this.handleNewLobbyConfig}>
          <div className={Classes.DIALOG_BODY}>
            <FormGroup label="Name" labelInfo="(optional)" labelFor="name">
              <input
                className={Classes.INPUT}
                type="text"
                dir="auto"
                name="name"
                id="name"
                autoComplete="off"
                value={name}
                onChange={this.handleChange}
                pattern={/^[a-zA-Z0-9_]+$/.source}
              />
            </FormGroup>

            <FormGroup
              label="Timeout Type"
              labelFor="timeoutType"
              labelInfo={
                <HelpTooltip
                  content={
                    <div>
                      There are 2 timeout types:
                      <ul>
                        <li>
                          <strong>Lobby:</strong> the timeout start when the
                          first player reaches the lobby and runs out for all
                          the players whether they have even reached the lobby
                          or not.
                        </li>
                        <li>
                          <strong>Individual:</strong> the timeout is started
                          for each player as they reach the room. Some players
                          might time out before all players are in the lobby,
                          they might continue waiting for another timeout
                          period. They might also leave the game and a new
                          player can replace them. The lobby itself never times
                          out.
                        </li>
                      </ul>
                    </div>
                  }
                />
              }
            >
              <HTMLSelect
                name="timeoutType"
                id="timeoutType"
                onChange={this.handleChange}
                value={timeoutType}
              >
                {_.map(LobbyConfigs.timeoutTypes, key => (
                  <option key={key} value={key}>
                    {inflection.titleize(key)}
                  </option>
                ))}
              </HTMLSelect>
            </FormGroup>

            <FormGroup
              required
              label="Timeout Duration in Seconds"
              labelFor="timeoutInSeconds"
            >
              <NumericInput
                name="timeoutInSeconds"
                id="timeoutInSeconds"
                min="1"
                max={LobbyConfigs.maxTimeoutInSeconds}
                stepSize="1"
                majorStepSize="10"
                onValueChange={this.handleIntChange.bind(
                  this,
                  "timeoutInSeconds"
                )}
                value={timeoutInSeconds}
                required
              />
            </FormGroup>

            {timeoutType === "individual" ? (
              <FormGroup
                label="Extend Count"
                labelFor="extendCount"
                labelInfo={
                  <HelpTooltip
                    content={
                      <div>
                        Number of times to allow the user to extend their wait
                        time by the initial timeout time. If set to 0, they are
                        never asked to retry.
                      </div>
                    }
                  />
                }
              >
                <NumericInput
                  name="extendCount"
                  id="extendCount"
                  min="0"
                  max={1000000000}
                  stepSize="1"
                  majorStepSize="10"
                  onValueChange={this.handleIntChange.bind(this, "extendCount")}
                  value={extendCount}
                  required
                />
              </FormGroup>
            ) : (
              ""
            )}

            {timeoutType === "lobby" ? (
              <FormGroup
                label="Timeout Strategy"
                labelFor="timeoutStrategy"
                labelInfo={
                  <HelpTooltip
                    content={
                      <div>
                        The Timeout Strategy determines what to do in case
                        people are waiting in the lobby for longer than the
                        timeout duration. Available strategies:
                        <ul>
                          <li>
                            <strong>Ignore:</strong> start the game anyway
                          </li>
                          <li>
                            <strong>Fail:</strong> take the player to the exit
                            survey
                          </li>
                          <li>
                            <strong>Bots:</strong> fill the missing players
                            slots with bots from timeoutBots.
                          </li>
                        </ul>
                      </div>
                    }
                  />
                }
              >
                <HTMLSelect
                  name="timeoutStrategy"
                  id="timeoutStrategy"
                  onChange={this.handleChange}
                  value={timeoutStrategy}
                >
                  {_.map(LobbyConfigs.timeoutStrategies, key => (
                    <option key={key} value={key}>
                      {inflection.titleize(key)}
                    </option>
                  ))}
                </HTMLSelect>
              </FormGroup>
            ) : (
              ""
            )}
          </div>

          <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              <Button
                type="submit"
                text="Create Lobby Configuration"
                intent={Intent.PRIMARY}
              />
            </div>
          </div>
        </form>
      </Dialog>
    );
  }
}
