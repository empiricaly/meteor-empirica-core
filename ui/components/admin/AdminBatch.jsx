import React from "react";
import moment from "moment";

import { Button, ButtonGroup, Classes, Intent, Tag } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { assignmentTypes } from "../../../api/batches/batches";
import {
  updateBatchStatus,
  duplicateBatch,
  setBatchInDebugMode,
  updateBatch
} from "../../../api/batches/methods";
import { AlertToaster, SuccessToaster } from "../Toasters.jsx";
import Loading from "../Loading.jsx";

export default class AdminBatch extends React.Component {
  state = {
    newIsOpen: false
  };

  handleArchive = () => {
    const {
      archived,
      batch: { _id }
    } = this.props;
    updateBatch.call({ _id, archived: !archived });
  };

  handleStatusChange = (status, debugMode, event) => {
    const {
      batch: { _id }
    } = this.props;
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

  handleDuplicate = event => {
    const {
      archived,
      batch: { _id }
    } = this.props;
    event.preventDefault();
    duplicateBatch.call({ _id }, err => {
      if (err) {
        AlertToaster.show({ message: `Failed duplicating Batch: ${err}` });
      } else {
        let message = "Successfully duplicated Batch.";
        if (archived) {
          message += " See Active Batches!";
        }
        SuccessToaster.show({ message });
      }
    });
  };

  render() {
    const { loading, batch, treatments, archived } = this.props;

    if (loading) {
      return <Loading />;
    }

    const actions = [];

    if (batch.status === "init") {
      actions.push(
        <Button
          text="Start"
          intent={Intent.SUCCESS}
          icon={IconNames.PLAY}
          key="start"
          onClick={this.handleStatusChange.bind(this, "running", false)}
        />
      );
    }

    if (batch.status === "init" || batch.status === "running") {
      actions.push(
        <Button
          text="Cancel"
          icon={IconNames.STOP}
          key="cancel"
          onClick={this.handleStatusChange.bind(this, "cancelled", false)}
        />
      );
    }

    if (batch.status === "finished" || batch.status === "cancelled") {
      actions.push(
        <Button
          text="Duplicate"
          icon={IconNames.DUPLICATE}
          key="duplicate"
          onClick={this.handleDuplicate}
        />
      );

      actions.push(
        <Button
          text={archived ? "Unarchive" : "Archive"}
          intent={archived ? Intent.SUCCESS : Intent.DANGER}
          minimal
          icon={IconNames.BOX}
          key="archive"
          className={Classes.SMALL}
          onClick={this.handleArchive}
        />
      );
    }

    let config;
    switch (batch.assignment) {
      case "simple":
        config = batch.simpleConfig.treatments.map(tt => {
          const t = treatments.find(t => t._id === tt._id);
          return (
            <div key={tt._id}>{t ? t.displayName() : "Unknown treatment"}</div>
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
        console.error(`unknown assignment: ${batch.assignment}`);
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
      <tr>
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
  }
}
