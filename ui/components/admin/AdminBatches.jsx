import { Button, Callout, HTMLTable } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import React from "react";
import { Link } from "react-router-dom";
import {
  duplicateBatch,
  setBatchInDebugMode,
  updateBatchStatus
} from "../../../api/batches/methods";
import Loading from "../Loading.jsx";
import AdminBatch from "./AdminBatch";
import { AdminPageHeader } from "./AdminHeading.jsx";
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
      lobbyConfigs,
      archived
    } = this.props;

    const { newIsOpen } = this.state;

    if (loading) {
      return <Loading />;
    }

    return (
      <div className="batches">
        {archived ? (
          <Link to="/admin" className="archived-button bp3-button bp3-minimal">
            Back to Active Batches
          </Link>
        ) : (
          <Link
            to="/admin/batches/archived"
            className="archived-button bp3-button bp3-minimal"
          >
            View Archived Batches
          </Link>
        )}

        <AdminPageHeader icon={IconNames.LAYERS}>
          {archived ? "Archived Batches" : "Batches"}

          {!archived ? (
            <Button
              text="New Batch"
              onClick={() => this.setState({ newIsOpen: true })}
            />
          ) : (
            ""
          )}
        </AdminPageHeader>

        {batches.length === 0 ? (
          <Callout>
            {archived
              ? "No archived batches."
              : "No batches yet, create one above."}
          </Callout>
        ) : (
          <HTMLTable className="double-stripped">
            <thead>
              <tr>
                <th />
                <th>#</th>
                <th>Status</th>
                <th>Game Count</th>
                <th>Started At</th>
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

        {!archived ? (
          <AdminNewBatch
            treatments={treatments}
            factors={factors}
            lobbyConfigs={lobbyConfigs}
            isOpen={newIsOpen}
            onClose={() => this.setState({ newIsOpen: false })}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}
