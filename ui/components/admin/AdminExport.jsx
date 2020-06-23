import React from "react";

import {
  Button,
  FormGroup,
  HTMLSelect,
  Intent,
  Checkbox
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { AdminPageHeader } from "./AdminHeading.jsx";

export default class AdminExport extends React.Component {
  state = { format: "CSV", exporting: false, removePii: true };

  handleChange = event => {
    const { name, value, type } = event.currentTarget;
    if (type === "checkbox") {
      this.setState({ [name]: event.currentTarget.checked });
      return;
    }

    this.setState({ [name]: value });
  };

  handleExport = () => {
    const { removePii } = this.state;
    document.location = `/admin/export.${this.state.format.toLowerCase()}?remove_pii=${removePii}`;
  };

  render() {
    const { format, exporting, removePii } = this.state;

    return (
      <div className="export">
        <AdminPageHeader icon={IconNames.EXPORT}>Export</AdminPageHeader>

        <p>
          The export function dumps all the app data as multiple CSV / JSON /
          JSON Line files zipped, one for each data type. You can reassociate
          the data pieces through IDs.
        </p>

        <FormGroup>
          <HTMLSelect
            id="format"
            name="format"
            value={format}
            options={["CSV", "JSON", "JSONL"]}
            onChange={this.handleChange}
          />
          <Checkbox
            checked={removePii}
            label="Remove Personal Identity Information (includes the player ID, URL
                parameters, and IP address)"
            onChange={this.handleChange}
            name="removePii"
          />
        </FormGroup>
        <FormGroup>
          <Button
            text="Export All"
            loading={exporting}
            intent={Intent.PRIMARY}
            onClick={this.handleExport}
          />
        </FormGroup>
        {format === "CSV" && <p>Each file is a CSV file</p>}
        {format === "JSON" && <p>Each file is a single large JSON object</p>}
        {format === "JSONL" && (
          <p>
            Each file contains{" "}
            <a target="blank" href="http://jsonlines.org">
              JSON Lines
            </a>
            , where each line is a object.
          </p>
        )}
      </div>
    );
  }
}
