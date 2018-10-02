// This is only to be able to centralize the style of admin headings.
import React from "react";

import { Icon } from "@blueprintjs/core";

import { H2 } from "../Heading.jsx";

export const AdminPageHeader = props => (
  <H2 className="admin-heading" iconSize={Icon.SIZE_LARGE} {...props} />
);
