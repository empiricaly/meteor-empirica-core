import React from "react";
import { Link } from "react-router-dom";

import {
  Button,
  Classes,
  Dialog,
  FormGroup,
  HTMLSelect,
  HTMLTable,
  Intent,
  NumericInput
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import {
  assignmentTypes,
  maxGamesCount
} from "../../../api/batches/batches.js";
import { createBatch } from "../../../api/batches/methods.js";

import { AlertToaster } from "../Toasters.jsx";

export default class AdminNewBatch extends React.Component {
  state = {
    assignment: "simple",
    simpleTreatments: [],
    completeTreatments: [],
    simpleGamesCount: 1,
    gamesCount: 1
  };

  gamesCountCalc(assignment, completeTreatments, simpleGamesCount) {
    return assignment === "complete"
      ? _.inject(completeTreatments, (sum, t) => (t.count || 0) + sum, 0)
      : simpleGamesCount;
  }

  handleAssignmentChange = event => {
    const { completeTreatments, simpleGamesCount } = this.state;
    const assignment = event.currentTarget.value;
    this.setState({
      assignment,
      gamesCount: this.gamesCountCalc(
        assignment,
        completeTreatments,
        simpleGamesCount
      )
    });
  };

  handleGamesCountChange = simpleGamesCount => {
    this.setState({
      simpleGamesCount,
      gamesCount: simpleGamesCount
    });
  };

  handleAddTreatment = event => {
    event.preventDefault();

    const lobbyConfigs = this.validLobbyConfigs();
    const { assignment, simpleGamesCount } = this.state;

    const key = `${assignment}Treatments`;
    const _id = event.currentTarget.value;

    if (!_id) {
      return;
    }

    const params = {};
    const existing = this.state[key].find(tt => tt._id === _id);
    const treatment = existing || {
      _id,
      count: 1,
      lobbyConfigId: !_.isEmpty(lobbyConfigs) && lobbyConfigs[0]._id
    };

    if (!existing) {
      this.state[key].push(treatment);
    } else {
      existing.count++;
    }
    params[key] = this.state[key];
    if (assignment === "complete") {
      params.gamesCount = this.state.gamesCount + 1;
    }
    this.setState(params);
  };

  handleTreatmentCountChange = (id, count) => {
    const { assignment, completeTreatments, simpleGamesCount } = this.state;

    const key = `${assignment}Treatments`;
    const t = this.state[key].find(tt => tt._id === id);
    t.count = count;

    const params = { [key]: this.state[key] };
    if (assignment === "complete") {
      params.gamesCount = this.gamesCountCalc(
        assignment,
        this.state[key],
        simpleGamesCount
      );
    }

    this.setState(params);
  };

  handleLobbyConfigChange = (id, event) => {
    const {
      currentTarget: { value: lobbyConfigId }
    } = event;
    const { assignment, completeTreatments } = this.state;

    const key = `${assignment}Treatments`;
    const t = this.state[key].find(tt => tt._id === id);
    t.lobbyConfigId = lobbyConfigId;

    this.setState({ [key]: this.state[key] });
  };

  handleRemoveTreatment = event => {
    event.preventDefault();

    const { assignment, simpleGamesCount, gamesCount } = this.state;
    const key = `${assignment}Treatments`;

    const id = event.currentTarget.dataset.id;
    const treatment = this.state[key].find(t => t._id === id);
    const val = _.reject(this.state[key], t => t._id === id);
    const params = { [key]: val };

    if (assignment === "complete") {
      params.gamesCount = gamesCount - treatment.count;
    }

    this.setState(params);
  };

  handleNewBatch = event => {
    event.preventDefault();
    const {
      assignment,
      simpleGamesCount,
      simpleTreatments,
      completeTreatments
    } = this.state;
    const params = { assignment };

    switch (assignment) {
      case "simple":
        const treatments = simpleTreatments.map(t =>
          _.pick(t, "_id", "lobbyConfigId")
        );
        params.simpleConfig = {
          treatments,
          count: simpleGamesCount
        };
        break;
      case "complete":
        params.completeConfig = {
          treatments: completeTreatments
        };
        break;
      default:
        AlertToaster.show({ message: "unknown assignement type?!" });
        return;
    }

    createBatch.call(params, err => {
      if (err) {
        console.error(JSON.stringify(err));
        AlertToaster.show({ message: String(err) });
        return;
      }

      this.setState({
        assignment: "simple",
        simpleTreatments: [],
        completeTreatments: [],
        simpleGamesCount: 1,
        gamesCount: 1
      });
      this.props.onClose();
    });
  };

  validTreatments() {
    const { treatments } = this.props;

    return treatments.filter(t => !t.archivedAt);
  }

  validLobbyConfigs() {
    const { lobbyConfigs } = this.props;

    return lobbyConfigs.filter(l => !l.archivedAt);
  }

  renderRequired() {
    const issues = [];
    const treatments = this.validTreatments();
    const lobbyConfigs = this.validLobbyConfigs();

    if (_.isEmpty(treatments)) {
      issues.push(<Link to="/admin/treatments">Create a Treatment</Link>);
    }

    if (_.isEmpty(lobbyConfigs)) {
      issues.push(
        <Link to="/admin/lobby-configurations">
          Create a Lobby Configuration
        </Link>
      );
    }

    return (
      <div className={Classes.DIALOG_BODY}>
        You must first:
        <ul>
          {issues.map((issue, i) => (
            <li key={i}>{issue}</li>
          ))}
        </ul>
      </div>
    );
  }

  renderContent() {
    const treatments = this.validTreatments();
    const lobbyConfigs = this.validLobbyConfigs();

    const {
      gamesCount,
      assignment,
      simpleTreatments,
      completeTreatments
    } = this.state;

    const isComplete = assignment === "complete";
    const currentTreatments = isComplete
      ? completeTreatments
      : simpleTreatments;

    return (
      <form className="new-batch" onSubmit={this.handleNewBatch}>
        <div className={Classes.DIALOG_BODY}>
          <FormGroup label="Assignment Method" labelFor="assignment">
            <HTMLSelect
              name="assignment"
              id="assignment"
              onChange={this.handleAssignmentChange}
              value={assignment}
            >
              {_.map(assignmentTypes, (name, key) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))}
            </HTMLSelect>
          </FormGroup>

          <FormGroup label="Treatments" labelFor="treatment">
            {currentTreatments.length > 0 ? (
              <HTMLTable striped bordered>
                <thead>
                  <tr>
                    <th>Treatment</th>
                    <th>Lobby Configuration</th>
                  </tr>
                </thead>
                <tbody>
                  {_.map(currentTreatments, t => {
                    const id = `gamesCount${t._id}`;
                    const treatment = treatments.find(tt => tt._id === t._id);
                    return (
                      <tr key={id}>
                        <td>{treatment.displayName()} </td>

                        <td>
                          <HTMLSelect
                            name="lobbyConfigId"
                            id="lobbyConfigId"
                            onChange={this.handleLobbyConfigChange.bind(
                              this,
                              t._id
                            )}
                            value={t.lobbyConfigId}
                            style={{ width: 250 }}
                          >
                            {_.map(lobbyConfigs, l => (
                              <option key={l._id} value={l._id}>
                                {l.displayName()}
                              </option>
                            ))}
                          </HTMLSelect>
                        </td>

                        {isComplete ? (
                          <td>
                            <NumericInput
                              name={id}
                              id={id}
                              min="1"
                              max={maxGamesCount}
                              stepSize="1"
                              onValueChange={this.handleTreatmentCountChange.bind(
                                this,
                                t._id
                              )}
                              value={t.count}
                              style={{ width: 100 }}
                            />
                          </td>
                        ) : null}
                        <td>
                          <Button
                            text="Remove"
                            intent={Intent.DANGER}
                            onClick={this.handleRemoveTreatment}
                            data-id={t._id}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </HTMLTable>
            ) : (
              ""
            )}

            {currentTreatments.length === 0 ? (
              <p className="bp3-text-muted">No treatments yet, add one:</p>
            ) : (
              ""
            )}

            <br />

            <HTMLSelect
              name="treatment"
              id="treatment"
              onChange={this.handleAddTreatment}
              value={""}
              style={{ width: 250 }}
            >
              <option value="">Add a new treatment...</option>
              {_.map(treatments, tr => (
                <option key={tr._id} value={tr._id}>
                  {tr.displayName()}
                </option>
              ))}
            </HTMLSelect>
          </FormGroup>

          <FormGroup
            label="Game Count"
            labelFor="gamesCount"
            helperText={isComplete ? null : "The total number of games to run"}
          >
            {isComplete ? (
              gamesCount
            ) : (
              <NumericInput
                name="gamesCount"
                id="gamesCount"
                min="1"
                max={maxGamesCount}
                stepSize="1"
                onValueChange={this.handleGamesCountChange}
                value={gamesCount}
              />
            )}
          </FormGroup>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button type="submit" text="Create Batch" intent={Intent.PRIMARY} />
          </div>
        </div>
      </form>
    );
  }

  render() {
    const { isOpen, onClose } = this.props;
    const treatments = this.validTreatments();
    const lobbyConfigs = this.validLobbyConfigs();

    const content =
      _.isEmpty(treatments) || _.isEmpty(lobbyConfigs)
        ? this.renderRequired()
        : this.renderContent();

    return (
      <Dialog
        icon={IconNames.LAYERS}
        isOpen={isOpen}
        onClose={onClose}
        title="New Batch"
        style={{ width: 700 }}
      >
        {content}
      </Dialog>
    );
  }
}
