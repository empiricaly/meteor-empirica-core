import React from "react";
import moment from "moment";

import {
  Button,
  ButtonGroup,
  Classes,
  HTMLTable,
  Icon,
  Intent,
  Tag
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { assignmentTypes } from "../../../api/batches/batches";
import {
  updateBatchStatus,
  duplicateBatch,
  setBatchInDebugMode
} from "../../../api/batches/methods";
import Loading from "../Loading.jsx";
import AdminNewBatch from "./AdminNewBatch.jsx";

export default class AdminBatches extends React.Component {
  state = {
    newIsOpen: false
  };

  handleStatusChange = (_id, status, debugMode, event) => {
    event.preventDefault();
    if (
      (Meteor.isDevelopment || Meteor.settings.public.debug_gameDebugMode) &&
      status === "running" &&
      // mac: metaKey (command), window: ctrlKey (Ctrl)
      (event.ctrlKey || event.metaKey || debugMode)
    ) {
      setBatchInDebugMode.call({ _id });
    }
    updateBatchStatus.call({ _id, status });
  };

  handleDuplicate = (_id, event) => {
    event.preventDefault();
    duplicateBatch.call({ _id });
  };

  render() {
    const {
      loading,
      batches,
      treatments,
      factors,
      lobbyConfigs
    } = this.props;

    const { newIsOpen } = this.state;

    if (loading) {
      return <Loading />;
    }

    return (
      <div className="batches">
        <h2>
          <Icon
            className="admin-header-icon"
            icon={IconNames.LAYERS}
            iconSize={Icon.SIZE_LARGE}
          />{" "}
          Batches
        </h2>

        {batches.length === 0 ? (
          <p>No batches yet, create one bellow.</p>
        ) : (
          <HTMLTable>
            <thead>
              <tr>
                <th>Status</th>
                <th>Game Count</th>
                <th>Created</th>
                <th>Assignment</th>
                <th>Configuration</th>
                <th>{/* Actions */}</th>
              </tr>
            </thead>

            <tbody>
              {batches.map(batch => {
                const actions = [];

                if (batch.status === "init") {
                  actions.push(
                    <Button
                      text="Start"
                      intent={Intent.SUCCESS}
                      icon="play"
                      key="start"
                      onClick={this.handleStatusChange.bind(
                        this,
                        batch._id,
                        "running",
                        false
                      )}
                    />
                  );
                }

                if (batch.status === "init" || batch.status === "running") {
                  actions.push(
                    <Button
                      text="Cancel"
                      icon="stop"
                      key="cancel"
                      onClick={this.handleStatusChange.bind(
                        this,
                        batch._id,
                        "cancelled",
                        false
                      )}
                    />
                  );
                }

                if (
                  batch.status === "finished" ||
                  batch.status === "cancelled"
                ) {
                  actions.push(
                    <Button
                      text="Duplicate"
                      icon="duplicate"
                      key="duplicate"
                      onClick={this.handleDuplicate.bind(this, batch._id)}
                    />
                  );
                }

                let config;
                switch (batch.assignment) {
                  case "simple":
                    config = batch.simpleConfig.treatments.map(tt => {
                      const t = treatments.find(t => t._id === tt._id);
                      return (
                        <div key={tt._id}>
                          {t ? t.displayName() : "Unknown treatment"}
                        </div>
                      );
                    });
                    break;
                  case "complete":
                    config = batch.completeConfig.treatments.map(tt => {
                      const t = treatments.find(t => t._id === tt._id);
                      return (
                        <div key={tt._id}>
                          {t ? t.displayName() : "Unknown treatment"}
                          {" x "}
                          {tt.count}
                        </div>
                      );
                    });
                    break;
                  default:
                    console.error("unknown assignment");
                    break;
                }

                let statusIntent;
                let statusMinimal = false;
                switch (batch.status) {
                  case "init":
                    statusIntent = Intent.WARNING;
                    // Default style
                    break;
                  case "running":
                    statusIntent = Intent.SUCCESS;
                    break;
                  case "finished":
                    statusIntent = Intent.SUCCESS;
                    statusMinimal = true;
                    break;
                  case "stopped":
                  case "cancelled":
                    statusIntent = Intent.DANGER;
                    statusMinimal = true;
                    break;
                  default:
                    statusMinimal = true;
                    break;
                }

                return (
                  <tr key={batch._id}>
                    <td>
                      <Tag intent={statusIntent} minimal={statusMinimal}>
                        {batch.status}
                      </Tag>
                    </td>
                    <td className="numeric">{batch.gameCount()}</td>
                    <td title={moment(batch.createdAt).format()}>
                      {moment(batch.createdAt).fromNow()}
                    </td>
                    <td>{assignmentTypes[batch.assignment]}</td>
                    <td>{config}</td>
                    <td>
                      <ButtonGroup minimal className={Classes.SMALL}>
                        {actions}
                      </ButtonGroup>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </HTMLTable>
        )}

        <Button
          text="New Batch"
          onClick={() => this.setState({ newIsOpen: true })}
        />

        <AdminNewBatch
          treatments={treatments}
          factors={factors}
          lobbyConfigs={lobbyConfigs}
          isOpen={newIsOpen}
          onClose={() => this.setState({ newIsOpen: false })}
        />
      </div>
    );
  }
}
