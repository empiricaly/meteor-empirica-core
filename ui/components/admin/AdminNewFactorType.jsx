import React from "react";

import {
  Classes,
  Button,
  Dialog,
  FormGroup,
  HTMLSelect,
  Intent,
  NumericInput,
  Switch,
  TagInput,
  TextArea
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { FactorTypes } from "../../../api/factor-types/factor-types.js";
import { createFactorType } from "../../../api/factor-types/methods.js";
import { AlertToaster } from "../Toasters.jsx";
import HelpTooltip from "../HelpTooltip.jsx";

export default class AdminNewFactorType extends React.Component {
  state = { type: "String", name: "", allowedValues: [], required: false };

  handleNumberUpdate = (name, value, valueAsString) => {
    this.setState({ [name]: valueAsString });
  };

  handleChange = event => {
    const { name, value } = event.currentTarget;
    this.setState({ [name]: value });
  };

  handleChangeCheckbox = event => {
    const { name, checked } = event.currentTarget;
    this.setState({ [name]: checked });
  };

  handleNewFactorType = event => {
    event.preventDefault();
    if (this.stopsubmit) {
      return;
    }
    let {
      name,
      description,
      type,
      min,
      max,
      allowedValues,
      required
    } = this.state;
    const { onClose } = this.props;

    const params = FactorTypes.schema.clean(
      { name, description, type, min, max, allowedValues, required },
      { autoConvert: false }
    );

    if (params.min !== undefined) {
      params.min = parseFloat(params.min);
    }

    if (params.max !== undefined) {
      params.max = parseFloat(params.max);
    }

    if (params.allowedValues && params.allowedValues.length === 0) {
      delete params.allowedValues;
    }

    createFactorType.call(params, err => {
      if (err) {
        AlertToaster.show({ message: String(err) });
        return;
      }
      onClose();
      this.setState({
        name: "",
        description: "",
        type: "String",
        min: undefined,
        max: undefined,
        allowedValues: [],
        required: false
      });
    });
  };

  render() {
    const { isOpen, onClose } = this.props;
    const {
      name,
      description,
      type,
      min,
      max,
      allowedValues,
      required
    } = this.state;

    const extraInputs = [];
    switch (type) {
      case "Number":
      case "Integer":
        extraInputs.push(
          <FormGroup
            key="min"
            label="Min"
            labelFor="min"
            helperText="Minimum accepted value"
          >
            <NumericInput
              value={min}
              onValueChange={this.handleNumberUpdate.bind(this, "min")}
            />
          </FormGroup>
        );

        extraInputs.push(
          <FormGroup
            key="max"
            label="Max"
            labelFor="max"
            helperText="Maximum accepted value."
          >
            <NumericInput
              value={max}
              onValueChange={this.handleNumberUpdate.bind(this, "max")}
            />
          </FormGroup>
        );
        break;
      case "String":
        extraInputs.push(
          <FormGroup
            key="min"
            label="Min"
            labelFor="min"
            helperText="Minimum number of characters."
          >
            <NumericInput
              min={1}
              max={1000000000000}
              value={min}
              onValueChange={this.handleNumberUpdate.bind(this, "min")}
            />
          </FormGroup>
        );

        extraInputs.push(
          <FormGroup
            key="max"
            label="Max"
            labelFor="max"
            helperText="Maximum number of characters."
          >
            <NumericInput
              min={1}
              max={1000000000000}
              value={max}
              onValueChange={this.handleNumberUpdate.bind(this, "max")}
            />
          </FormGroup>
        );

        extraInputs.push(
          <FormGroup
            key="allowedValues"
            label="Allowed Values"
            labelFor="allowedValues"
            helperText="List of specific values accepted. If filled, min and max are ignored."
          >
            <TagInput
              inputProps={{
                onFocus: () => {
                  this.stopsubmit = true;
                },
                onBlur: () => {
                  this.stopsubmit = false;
                }
              }}
              addOnBlur
              onChange={value => this.setState({ allowedValues: value })}
              values={allowedValues}
            />
          </FormGroup>
        );

        break;
      case "Boolean":
        break;
      default:
        console.error("New factor unsupported type:", type.stringType);
        break;
    }

    return (
      <Dialog
        icon={IconNames.PROPERTY}
        isOpen={isOpen}
        onClose={onClose}
        title="New Factor Type"
      >
        <form
          className="new-factor-type"
          //
          onSubmit={this.handleNewFactorType}
        >
          <div className={Classes.DIALOG_BODY}>
            <FormGroup
              label="Type"
              labelFor="type"
              labelInfo={
                <HelpTooltip
                  content={
                    <div>
                      There are 4 types:
                      <ul>
                        <li>
                          <strong>String:</strong> either any string value,
                          with. the possibility to set a min and max number of
                          characters, or a fixed set of values (allowed values).
                        </li>
                        <li>
                          <strong>Integer:</strong> An integer value, with
                          optional min and/or max values.
                        </li>
                        <li>
                          <strong>Number:</strong> A Number works like Integer
                          and adds support for decimal numbers.
                        </li>
                        <li>
                          <strong>Boolean:</strong> A Boolean will support only
                          true or false values.
                        </li>
                      </ul>
                    </div>
                  }
                />
              }
            >
              <HTMLSelect
                name="type"
                id="type"
                onChange={this.handleChange}
                value={type}
                options={FactorTypes.types}
              />
            </FormGroup>

            <Switch
              label="Required"
              name="required"
              checked={required}
              onChange={this.handleChangeCheckbox}
            />

            <FormGroup
              label="Name"
              labelFor="name"
              helperText={
                <>
                  Format: <code>camelCase</code>. Only letters and numbers, with
                  leading lowercase letters.
                </>
              }
              labelInfo="(required)"
            >
              <input
                className={Classes.INPUT}
                dir="auto"
                type="text"
                name="name"
                id="name"
                value={name}
                pattern={/^[a-zA-Z0-9_]+$/.source}
                onChange={this.handleChange}
                required
              />
            </FormGroup>

            <FormGroup
              label="Description"
              labelFor="description"
              labelInfo="(required)"
              // helperText={<>Format: <code>camelCase</code>. Only letters and numbers, with leading lowercase letters.<>}
            >
              <TextArea
                required
                fill
                id="description"
                name="description"
                onChange={this.handleChange}
                value={description}
              />
            </FormGroup>

            {extraInputs}
          </div>
          <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              <Button
                type="submit"
                text="Create Factor Type"
                intent={Intent.PRIMARY}
                // onClick={this.handleNewFactorType}
              />
            </div>
          </div>
        </form>
      </Dialog>
    );
  }
}
