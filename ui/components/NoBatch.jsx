import { NonIdealState } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import React from "react";
import { Link } from "react-router-dom";

export default class NoBatch extends React.Component {
  render() {
    // Not sure what icon works best:
    // - SMALL_CROSS
    // - BAN_CIRCLE
    // - ERROR
    // - DISABLE
    // - WARNING_SIGN
    return (
      <NonIdealState
        icon={IconNames.ISSUE}
        title="No experiments available"
        description={
          <>
            <p>
              There are currently no available experiments. Please wait until an
              experiment becomes available or come back at a later date.
            </p>
            {Meteor.isDevelopment ? (
              <p>
                Go to{" "}
                <a href="/admin" target="_blank">
                  Admin
                </a>{" "}
                to get started.
              </p>
            ) : (
              ""
            )}
          </>
        }
      />
    );
  }
}
