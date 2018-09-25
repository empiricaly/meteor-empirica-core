import React from "react";

import { NonIdealState } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

export default class WaitingForServer extends React.Component {
  render() {
    return (
      <div className="game waiting">
        <NonIdealState
          icon={IconNames.AUTOMATIC_UPDATES}
          title="Waiting for server response..."
          description={
            <>
              Please wait until all players are ready. If this takes more than 5
              seconds, please <em>Refresh the page</em>.
            </>
          }
        />
      </div>
    );
  }
}
