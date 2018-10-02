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
  state = { value: "", name: "", loading: false };

  constructor(props) {
    super(props);
    this.valueInputRef = React.createRef();
  }

  componentDidMount() {
    if (this.props.isOpen) {
      this.focus();
    }
  }

  componentDidUpdate(prevProp) {
    if (this.props.isOpen && !prevProp.isOpen) {
      this.focus();
    }
  }

  focus() {
    setTimeout(() => {
      const node = this.valueInputRef.current;
      if (node) {
        node.focus();
      }
    }, 100);
  }

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

    const { name, value, loading } = this.state;
    if (loading) {
      return;
    }
    this.setState({ loading: true });

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
        AlertToaster.show({
          message: err.reason || err.message || err.toString()
        });
        this.setState({ loading: false });
        return;
      }
      onClose();
      this.setState({ loading: false, name: "", value: undefined });
    });
  };

  render() {
    const { isOpen, onClose, type } = this.props;
    const { name, value, loading } = this.state;

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
            ref={this.valueInputRef}
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
            inputRef={this.valueInputRef}
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
            autoComplete="off"
            value={value}
            onChange={this.handleUpdate}
            // pattern={type.regEx && type.regEx.source}
            required
            ref={this.valueInputRef}
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
        title={`New ${type.name} Factor Value`}
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
                autoComplete="off"
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
                loading={loading}
                type="submit"
                text="Create Factor Value"
                intent={Intent.PRIMARY}
              />
            </div>
          </div>
        </form>
      </Dialog>
    );
  }
}
