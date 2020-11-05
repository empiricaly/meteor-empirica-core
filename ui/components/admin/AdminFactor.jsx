import { EditableText, Button } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import React from "react";
import { AlertToaster } from "../Toasters.jsx";

import { updateFactor } from "../../../api/factors/methods.js";

export default class AdminFactor extends React.Component {
  constructor(props) {
    super(props);
    this.initialName = props.factor.name;
    this.state = {
      name: props.factor.name
    };
  }

  componentWillUpdate(props) {
    if (props.factor.name !== this.props.factor.name) {
      this.initialName = props.factor.name;
      this.setState({ name: props.factor.name });
    }
  }

  handleNameChange = name => {
    this.setState({ name });
  };

  handleNameConfirm = () => {
    const { _id } = this.props.factor;
    const { name } = this.state;
    if (!name || name.trim() === "") {
      this.setState({ name: this.initialName });
      return;
    }
    updateFactor.call({ _id, name }, err => {
      if (err) {
        AlertToaster.show({ message: String(err) });
        this.handleNameChange(this.initialName);
        return;
      }
      this.initialName = name;
    });
  };

  render() {
    const { factor, archived } = this.props;
    const { name } = this.state;
    return (
      <tr key={factor._id}>
        <td>
          <EditableText
            onChange={this.handleNameChange}
            onConfirm={this.handleNameConfirm}
            value={name}
          />
        </td>
        <td>{String(factor.value)}</td>
        <td>
          <Button
            text={archived ? `Unarchive ${t.name}` : ""}
            intent={archived ? Intent.SUCCESS : null}
            icon={IconNames.BOX}
            onClick={() =>
              updateFactor.call({ _id: factor._id, name, archived: !archived })
            }
          />
        </td>
      </tr>
    );
  }
}
