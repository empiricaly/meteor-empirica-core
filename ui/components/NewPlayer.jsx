import React from "react";

import { Button, Classes, FormGroup } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { AlertToaster } from "./Toasters.jsx";
import { createPlayer } from "../../api/players/methods";
import { setPlayerId } from "../containers/IdentifiedContainer.jsx";
import Centered from "./Centered.jsx";

import Loading from "./Loading.jsx";
const { playerIdParam } = Meteor.settings.public;

export const ConsentButtonContext = React.createContext(null);

export default class NewPlayer extends React.Component {
  state = { id: "", consented: false };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.consented && !prevState.consented) {
      this.timeout = setTimeout(() => {
        this.timeout = null;
        const idField = window.document.querySelector("#id");
        if (idField) {
          idField.focus();
        }
      }, 100);
    }
  }

  componentWillMount() {
    if (!this.props.Consent) {
      this.playerFromIdParam();
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  handleUpdate = event => {
    const { value, name } = event.currentTarget;
    this.setState({ [name]: value });
  };

  handleConsent = () => {
    this.setState({ consented: true });
    this.playerFromIdParam();
  };

  playerFromIdParam() {
    const { playerIdParam } = Meteor.settings.public;

    if (playerIdParam) {
      const searchParams = new URL(document.location).searchParams;
      const id = searchParams.get(playerIdParam);
      if (id) {
        const urlParams = {};
        for (var pair of searchParams.entries()) {
          urlParams[pair[0]] = pair[1];
        }
        this.setState({ attemptingAutoLogin: true });
        createPlayer.call({ id, urlParams }, (err, _id) => {
          if (err) {
            this.setState({ attemptingAutoLogin: false });
            console.error(err);
            AlertToaster.show({ message: String(err) });
            return;
          }

          setPlayerId(_id);
        });
      }
    }
  }
  render() {
    const { Consent } = this.props;
    const { id, consented, attemptingAutoLogin } = this.state;

    if (attemptingAutoLogin) {
      return <Loading />;
    }

    if (!consented && Consent) {
      return (
        <ConsentButtonContext.Provider value={this.handleConsent}>
          <Consent onConsent={this.handleConsent} />
        </ConsentButtonContext.Provider>
      );
    }

    return (
      <Centered>
        <div className="new-player">
          <form onSubmit={e => this.props.handleNewPlayer(e, id)}>
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
