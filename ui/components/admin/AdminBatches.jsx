import React from "react";
import { Link } from "react-router-dom";

import { Button, HTMLTable, Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import {
  updateBatchStatus,
  duplicateBatch,
  setBatchInDebugMode
} from "../../../api/batches/methods";

import AdminNewBatch from "./AdminNewBatch.jsx";
import AdminBatch from "./AdminBatch.jsx";
import Loading from "../Loading.jsx";
import { AdminPageHeader } from "./AdminHeading.jsx";

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
      lobbyConfigs,
      archived
    } = this.props;

    const { newIsOpen } = this.state;

    if (loading) {
      return <Loading />;
    }

    return (
      <div className="batches">
        <AdminPageHeader icon={IconNames.LAYERS}>
          {archived ? "Archived Batches" : "Batches"}
        </AdminPageHeader>

        {batches.length === 0 ? (
          <p>No batches yet, create one bellow.</p>
        ) : (
          <HTMLTable striped>
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
              {batches.map(batch => (
                <AdminBatch
                  key={batch._id}
                  batch={batch}
                  treatments={treatments}
                  archived={archived}
                />
              ))}
            </tbody>
          </HTMLTable>
        )}

        {archived ? (
          <p>
            <br />
            <Link to="/admin">Back to Active Batches</Link>
          </p>
        ) : (
          <>
            <br />

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

            <p>
              <br />
              <Link to="/admin/batches/archived">View Archived Batches</Link>
            </p>
          </>
        )}
      </div>
    );
  }
}
