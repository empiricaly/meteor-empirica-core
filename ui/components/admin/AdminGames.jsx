import React from "react";

import { Icon, NonIdealState } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { AdminPageHeader } from "./AdminHeading.jsx";

export default class AdminGames extends React.Component {
  render() {
    return (
      <div className="games">
        <AdminPageHeader icon={IconNames.FLOWS}>Games</AdminPageHeader>

        <NonIdealState icon={IconNames.BUILD} title="Under construction" />
      </div>
    );
  }
}
