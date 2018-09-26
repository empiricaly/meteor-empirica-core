import React from "react";

import { Button, Classes, EditableText, Intent } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { AlertToaster } from "../Toasters.jsx";
import { updateTreatment } from "../../../api/treatments/methods.js";

export default class AdminTreatment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.treatment.name || ""
    };
  }

  componentWillUpdate(props) {
    if (props.treatment.name !== this.props.treatment.name) {
      this.setState({ name: props.treatment.name });
    }
  }

  handleNameChange = name => {
    this.setState({ name: name || "" });
  };

  handleNameConfirm = () => {
    const { _id, name: prevName } = this.props.treatment;
    const { name: nameRaw } = this.state;
    const name = nameRaw.trim();
    if (name === prevName) {
      this.handleNameChange(prevName);
      return;
    }

    updateTreatment.call({ _id, name }, err => {
      if (err) {
        AlertToaster.show({ message: String(err) });
        this.handleNameChange(prevName);
        return;
      }
    });
  };

  handleArchive = () => {
    const {
      archived,
      treatment: { _id }
    } = this.props;
    updateTreatment.call({ _id, archived: !archived });
  };

  render() {
    const { treatment, factorTypes, archived } = this.props;
    const { name } = this.state;
    const conds = treatment.factors();

    const archiveIntent = archived ? Intent.SUCCESS : Intent.DANGER;
    return (
      <tr>
        <td>
          <EditableText
            onChange={this.handleNameChange}
            onConfirm={this.handleNameConfirm}
            value={name}
          />
        </td>

        {factorTypes.map(type => {
          const cond = conds.find(c => c.factorTypeId === type._id);
          return <td key={type._id}>{cond ? cond.label() : "-"}</td>;
        })}

        <td>
          <Button
            text={archived ? "Unarchive" : "Archive"}
            intent={archiveIntent}
            minimal
            icon={IconNames.BOX}
            className={Classes.SMALL}
            onClick={this.handleArchive}
          />
        </td>
      </tr>
    );
  }
}
