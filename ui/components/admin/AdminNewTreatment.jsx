import React from "react";
import { Link } from "react-router-dom";

import {
  Callout,
  Classes,
  Button,
  Dialog,
  FormGroup,
  Intent,
  RadioGroup,
  Radio
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { AlertToaster } from "../Toasters.jsx";
import { createTreatment } from "../../../api/treatments/methods.js";

export default class AdminNewTreatment extends React.Component {
  state = { selected: {}, name: "" };

  handleNameChange = () => {
    const name = this.nameField.value;
    this.setState({ name });
  };

  handleFactorChange = (type, event) => {
    const factorId = event.currentTarget.value;
    const selected = {
      ...this.state.selected,
      [type]: factorId
    };
    this.setState({ selected });
  };

  handleNewTreatment = event => {
    const { onClose } = this.props;
    const { name, selected } = this.state;
    event.preventDefault();

    const keys = _.compact(_.keys(selected));
    const factorIds = _.compact(_.values(selected));

    if (keys.length !== factorIds.length) {
      const missing = keys.join(", ");
      const msg = `A value for each factor must be selected. (missing: ${missing})`;
      AlertToaster.show({ message: msg });
      return;
    }

    const params = { name, factorIds };
    createTreatment.call(params, err => {
      if (err) {
        if (err.details) {
          try {
            const details = JSON.parse(err.details);
            const out = details[0].details
              .map(er => {
                switch (er.type) {
                  case "required":
                    return `${er.name} is required.`;
                  default:
                    console.error("unknown error type", er);
                }
              })
              .join(" ");
            AlertToaster.show({ message: out });
          } catch (e) {
            console.error(JSON.stringify(err));
            AlertToaster.show({ message: String(err.message) });
          }
        } else {
          AlertToaster.show({ message: String(err.message) });
        }
        return;
      }
      onClose();
      this.setState({
        name: "",
        selected: {}
      });
    });
  };

  render() {
    const { isOpen, factors, factorTypes, onClose } = this.props;
    const { name, selected } = this.state;

    const types = factorTypes.filter(t => !t.archivedAt);

    return (
      <Dialog
        className="admin"
        icon={IconNames.PROPERTIES}
        isOpen={isOpen}
        onClose={onClose}
        title="New Treatment"
      >
        <form className="new-treatment" onSubmit={this.handleNewTreatment}>
          <div className={Classes.DIALOG_BODY}>
            <FormGroup label="Name" labelInfo="(optional)" labelFor="name">
              <input
                className={Classes.INPUT}
                type="text"
                dir="auto"
                name="name"
                id="name"
                autoComplete="off"
                value={name}
                onChange={this.handleNameChange}
                ref={e => (this.nameField = e)}
                // pattern={/^[a-zA-Z0-9_]+$/.source}
              />
            </FormGroup>

            {_.map(types, type => {
              const conds = _.filter(
                factors,
                factor => factor.factorTypeId === type._id
              );
              const requiredClass = type.required ? "required" : "";
              if (conds.length === 0) {
                return (
                  <FormGroup
                    label={type.name}
                    labelFor="name"
                    className={requiredClass}
                    key={type._id}
                  >
                    <Callout
                      icon={
                        type.required
                          ? IconNames.WARNING_SIGN
                          : IconNames.INFO_SIGN
                      }
                      intent={type.required ? Intent.DANGER : null}
                    >
                      There are no factor values for the
                      {type.required ? <strong> required </strong> : " "}
                      {type.name} factor type yet.{" "}
                      <Link to="/admin/factors">Add factor values</Link>.
                    </Callout>
                  </FormGroup>
                );
              }
              return (
                <RadioGroup
                  key={type._id}
                  label={type.name}
                  onChange={this.handleFactorChange.bind(this, type._id)}
                  selectedValue={selected[type._id]}
                  inline={true}
                  className={requiredClass}
                >
                  {_.map(conds, cond => (
                    <Radio
                      key={cond._id}
                      label={cond.label()}
                      value={cond._id}
                    />
                  ))}
                </RadioGroup>
              );
            })}
          </div>
          <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              <Button
                type="submit"
                text="Create Treatment"
                intent={Intent.PRIMARY}
              />
            </div>
          </div>
        </form>
      </Dialog>
    );
  }
}
