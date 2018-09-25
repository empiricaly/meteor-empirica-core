import React from "react";

import { NonIdealState } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

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
        description="There are currently no available experiement. Please wait until an experiment becomes available or come back at a later date."
      />
    );
  }
}
