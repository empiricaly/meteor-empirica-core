import React from "react";

import { Button, Card, HTMLTable, Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import AdminCondition from "./AdminCondition.jsx";
import AdminNewCondition from "./AdminNewCondition.jsx";
import Loading from "../Loading.jsx";

export default class AdminConditions extends React.Component {
  state = {};

  render() {
    const { loading, treatments, conditions, conditionTypes } = this.props;

    if (loading) {
      return <Loading />;
    }

    conditionTypes.map(t => {
      t.conditions = conditions.filter(c => c.type === t._id);
    });

    return (
      <div className="conditions">
        <h2>
          <Icon
            className="admin-header-icon"
            icon={IconNames.PROPERTY}
            iconSize={Icon.SIZE_LARGE}
          />{" "}
          Conditions
        </h2>

        <div className="conditions-list">
          {conditionTypes.map(t => {
            const hasNewForm = !(t.stringType === "Boolean" || t.allowedValues);

            return (
              <Card className="condition" key={t._id}>
                {hasNewForm ? (
                  <React.Fragment>
                    <AdminNewCondition
                      type={t}
                      onClose={() =>
                        this.setState({ [`newOpen${t._id}`]: false })
                      }
                      isOpen={this.state[`newOpen${t._id}`]}
                    />
                    <Button
                      icon={IconNames.PLUS}
                      onClick={() =>
                        this.setState({ [`newOpen${t._id}`]: true })
                      }
                    />
                  </React.Fragment>
                ) : (
                  ""
                )}

                <h4>{t._id}</h4>

                {t.description ? (
                  <blockquote className="bp3-text-muted">
                    <p>{t.description}</p>
                  </blockquote>
                ) : (
                  ""
                )}

                {t.conditions.length > 0 ? (
                  <HTMLTable condensed>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {t.conditions.map(condition => (
                        <AdminCondition
                          key={condition._id}
                          condition={condition}
                        />
                      ))}
                    </tbody>
                  </HTMLTable>
                ) : (
                  <p className="bp3-text-muted">
                    No <code>{t._id}</code> conditions yet.
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    );
  }
}
