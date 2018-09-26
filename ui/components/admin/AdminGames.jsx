import React from "react";

import { Icon, NonIdealState } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

export default class AdminGames extends React.Component {
  render() {
    return (
      <div className="games">
        <h2>
          <Icon className="admin-header-icon" icon={IconNames.FLOWS} /> Games
        </h2>

        <NonIdealState icon={IconNames.BUILD} title="Under construction" />
      </div>
    );
  }
}
