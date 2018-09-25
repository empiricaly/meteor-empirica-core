import React from "react";

import {
  Classes,
  Button,
  Dialog,
  FormGroup,
  Intent,
  NumericInput
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { Factors } from "../../../api/factors/factors.js";
import { AlertToaster } from "../Toasters.jsx";
import { createFactor } from "../../../api/factors/methods.js";

export default class AdminNewFactor extends React.Component {
  state = { value: "" };

  handleIntUpdate = value => {
    this.setState({ value });
  };

  handleUpdate = event => {
    const name = event.currentTarget.name;
    const value = event.currentTarget.value;
    this.setState({ [name]: value });
  };

  handleNewFactor = event => {
    event.preventDefault();
    let { name, value } = this.state;
    const {
      type: { _id: factorTypeId, type },
      onClose
    } = this.props;

    const params = Factors.schema.clean(
      { factorTypeId, name, value },
      { autoConvert: false }
    );

    if (type === "Number") {
      params.value = parseFloat(params.value);
    }

    createFactor.call(params, err => {
      if (err) {
        AlertToaster.show({ message: String(err) });
        return;
      }
      onClose();
      this.setState({});
    });
  };

  render() {
    const { isOpen, onClose, type } = this.props;
    const { name, value } = this.state;

    let input;
    switch (type.type) {
      case "Number":
        input = (
          <input
            className={Classes.INPUT}
            dir="auto"
            type="number"
            name="value"
            id="value"
            step="any"
            min={type.min || -1000000000000}
            max={type.max || 1000000000000}
            value={value}
            onChange={this.handleUpdate}
            required
          />
        );
        break;
      case "Integer":
        input = (
          <NumericInput
            name="value"
            id="value"
            min={type.min || -1000000000000}
            max={type.max || 1000000000000}
            value={value}
            required
            onValueChange={this.handleIntUpdate}
          />
        );
        break;
      case "String":
        input = (
          <input
            className={Classes.INPUT}
            dir="auto"
            type="text"
            name="value"
            id="value"
            value={value}
            onChange={this.handleUpdate}
            // pattern={type.regEx && type.regEx.source}
            required
          />
        );
        break;
      default:
        console.error("New factor unsupported type:", type.type);
        break;
    }

    let properties = [];
    if (!_.isUndefined(type.min)) {
      properties.push(`Min: ${type.min}`);
    }
    if (!_.isUndefined(type.max)) {
      properties.push(`Max: ${type.max}`);
    }
    // if (!_.isUndefined(type.regEx)) {
    //   properties.push(`Pattern: ${type.regEx.source}`);
    // }

    return (
      <Dialog
        icon={IconNames.PROPERTY}
        isOpen={isOpen}
        onClose={onClose}
        title={`New ${type.name} Factor`}
      >
        <form className="new-factor" onSubmit={this.handleNewFactor}>
          <div className={Classes.DIALOG_BODY}>
            <FormGroup
              label="Name"
              labelFor="name"
              helperText="Only characters, numbers and underscore (_). No spaces."
            >
              <input
                className={Classes.INPUT}
                dir="auto"
                type="text"
                name="name"
                id="name"
                value={name}
                pattern={/^[a-zA-Z0-9_]+$/.source}
                onChange={this.handleUpdate}
                // required
              />
            </FormGroup>

            <FormGroup
              label="Value"
              labelFor="name"
              helperText={properties.length > 0 ? properties.join(" - ") : ""}
            >
              {input}
            </FormGroup>
          </div>
          <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              <Button
                type="submit"
                text="Create Factor"
                intent={Intent.PRIMARY}
              />
            </div>
          </div>
        </form>
      </Dialog>
    );
  }
}
