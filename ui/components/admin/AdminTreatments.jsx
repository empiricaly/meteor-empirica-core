import React from "react";
import { Link } from "react-router-dom";

import {
  Button,
  Classes,
  EditableText,
  HTMLTable,
  Icon,
  Intent
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { AlertToaster } from "../Toasters.jsx";
import { updateTreatment } from "../../../api/treatments/methods.js";
import AdminNewTreatment from "./AdminNewTreatment.jsx";
import Loading from "../Loading.jsx";

class AdminTreatment extends React.Component {
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
    const { treatment, conditionTypes, archived } = this.props;
    const { name } = this.state;
    const conds = treatment.conditions();

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

        {conditionTypes.map(type => {
          const cond = conds.find(c => c.type === type._id);
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

export default class AdminTreatments extends React.Component {
  state = { newTreatmentIsOpen: false };

  render() {
    const {
      loading,
      treatments,
      conditions,
      conditionTypes,
      archived
    } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <div className="treatments">
        <h2>
          <Icon className="admin-header-icon" icon={IconNames.PROPERTIES} />
          {archived ? "Archived Treatments" : "Treatments"}
        </h2>
        {treatments.length === 0 ? (
          <p>
            {archived
              ? "No archived treatments."
              : "No treatments yet, create some bellow."}
          </p>
        ) : (
          <HTMLTable>
            <thead>
              <tr>
                <th>Name</th>
                {conditionTypes.map(type => (
                  <th key={type._id}>
                    <em label={type.description}>{type._id}</em>
                  </th>
                ))}
                <th />
              </tr>
            </thead>
            <tbody>
              {_.map(treatments, treatment => (
                <AdminTreatment
                  key={treatment._id}
                  treatment={treatment}
                  conditionTypes={conditionTypes}
                  archived={archived}
                />
              ))}
            </tbody>
          </HTMLTable>
        )}

        {archived ? (
          <p>
            <br />
            <Link to="/admin/treatments">Back to active Treatments</Link>
          </p>
        ) : (
          <>
            <br />

            <Button
              text="New Treatment"
              onClick={() => this.setState({ newTreatmentIsOpen: true })}
            />

            <AdminNewTreatment
              conditions={conditions}
              conditionTypes={conditionTypes}
              onClose={() => this.setState({ newTreatmentIsOpen: false })}
              isOpen={this.state.newTreatmentIsOpen}
            />

            <p>
              <br />
              <Link to="/admin/treatments/archived">
                View Archived Treatments
              </Link>
            </p>
          </>
        )}
      </div>
    );
  }
}
