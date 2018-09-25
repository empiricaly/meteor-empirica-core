import React from "react";

import { Icon, Tooltip, Position } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

const HelpTooltip = ({ content }) => (
  <Tooltip
    className="help-tooltip-wrapper"
    content={<span className="help-tooltip">{content}</span>}
    position={Position.TOP}
  >
    <Icon className="help-tooltip-icon" icon={(IconNames = "help")} />
  </Tooltip>
);

export default HelpTooltip;
