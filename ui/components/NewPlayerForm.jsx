import React from "react";

import { Button, Classes, FormGroup } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import Centered from "./Centered.jsx";

export default class NewPlayerForm extends React.Component {
  state = { id: "" };

  handleUpdate = event => {
    const { value, name } = event.currentTarget;
    this.setState({ [name]: value });
  };

  handleSubmit = event => {
    event.preventDefault();

    const { handleNewPlayer } = this.props;
    const { id } = this.state;
    handleNewPlayer(id);
  };

  render() {
    const { id } = this.state;

    return (
      <Centered>
        <div className="new-player">
          <form onSubmit={this.handleSubmit}>
            <h1>Identification</h1>

            <FormGroup
              label="Player ID"
              labelFor="id"
              helperText={
                <>
                  Enter your player identification{" "}
                  <span className="bp3-text-muted">
                    (provided ID, MTurk ID, etc.)
                  </span>
                </>
              }
            >
              <input
                className={Classes.INPUT}
                dir="auto"
                type="text"
                name="id"
                id="id"
                value={id}
                onChange={this.handleUpdate}
                placeholder="e.g. john@example.com"
                required
                autoComplete="off"
              />
            </FormGroup>

            <FormGroup>
              <Button type="submit" text="Submit" icon={IconNames.KEY_ENTER} />
            </FormGroup>
          </form>
        </div>
      </Centered>
    );
  }
}
