import React from "react";
import { Link } from "react-router-dom";

import { Button, HTMLTable, Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { AdminPageHeader } from "./AdminHeading.jsx";
import AdminNewTreatment from "./AdminNewTreatment.jsx";
import AdminTreatment from "./AdminTreatment.jsx";
import Loading from "../Loading.jsx";

export default class AdminTreatments extends React.Component {
  state = { newTreatmentIsOpen: false };

  render() {
    const { loading, treatments, factors, factorTypes, archived } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <div className="treatments">
        <AdminPageHeader icon={IconNames.PROPERTIES}>
          {archived ? "Archived Treatments" : "Treatments"}
        </AdminPageHeader>

        {treatments.length === 0 ? (
          <p>
            {archived
              ? "No archived treatments."
              : "No treatments yet, create some bellow."}
          </p>
        ) : (
          <HTMLTable striped>
            <thead>
              <tr>
                <th>Name</th>
                {factorTypes.map(type => (
                  <th key={type._id}>
                    <em label={type.description}>{type.name}</em>
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
                  factorTypes={factorTypes}
                  archived={archived}
                />
              ))}
            </tbody>
          </HTMLTable>
        )}

        {archived ? (
          <p>
            <br />
            <Link to="/admin/treatments">Back to Active Treatments</Link>
          </p>
        ) : (
          <>
            <br />

            <Button
              text="New Treatment"
              onClick={() => this.setState({ newTreatmentIsOpen: true })}
            />

            <AdminNewTreatment
              factors={factors}
              factorTypes={factorTypes}
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
