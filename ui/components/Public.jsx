import React from "react";
import { Link } from "react-router-dom";

import { Helmet } from "react-helmet";
import {
  Button,
  Classes,
  Dialog,
  Icon,
  Navbar,
  NavbarGroup,
  NavbarHeading,
  Intent
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { CoreWrapper } from "./Helpers.jsx";
import { removePlayerId } from "../containers/IdentifiedContainer.jsx";
import GameContainer from "../containers/GameContainer.jsx";
import Loading from "./Loading.jsx";
import NewPlayer from "./NewPlayer.jsx";
import NoBatch from "./NoBatch.jsx";

const loadDocTitle = document.title;

export default class Public extends React.Component {
  state = { isOpen: false };

  handleToggleDialog = () => this.setState({ isOpen: !this.state.isOpen });

  handleReset = event => {
    event.preventDefault();
    removePlayerId();
    this.setState({ isOpen: false });
  };

  handleOpenAltPlayer = event => {
    event.preventDefault();

    // check to see if a playerId is required
    const { playerIdParam, playerIdParamExclusive } = Meteor.settings.public;
    const playerIdParamRequired = playerIdParam && playerIdParamExclusive;

    const randPlayerIdKey = Math.random()
      .toString(36)
      .substring(2, 15);

    // if playerId is required, add that to URL
    // otherwise, produce URL with just playerIdKey
    if (playerIdParamRequired) {
      const randId = Math.random()
        .toString(36)
        .substring(2, 15);
      window.open(
        `/?playerIdKey=${randPlayerIdKey}&${playerIdParam}=${randId}`,
        "_blank"
      );
    } else {
      window.open(`/?playerIdKey=${randPlayerIdKey}`, "_blank");
    }
  };

  render() {
    const { loading, renderPublic, playerIdKey, Header, ...rest } = this.props;
    const { player } = rest;

    if (loading) {
      return <Loading />;
    }

    if (!renderPublic) {
      return <NoBatch />;
    }

    let content;
    if (!player) {
      content = (
        <CoreWrapper>
          <NewPlayer {...rest} />
        </CoreWrapper>
      );
    } else {
      content = <GameContainer {...rest} />;
    }

    let title = loadDocTitle;
    if (playerIdKey) {
      title += ` (${playerIdKey})`;
    }

    return (
      <div className="grid">
        <Helmet>
          <title>{title}</title>
        </Helmet>

        {Header !== undefined ? (
          <Header />
        ) : (
          <Navbar className={["header", Classes.DARK].join(" ")}>
            <NavbarGroup align="left">
              <NavbarHeading>
                <Link
                  className={[
                    Classes.BUTTON,
                    Classes.LARGE,
                    Classes.MINIMAL,
                    Classes.BUTTON
                  ].join(" ")}
                  to="/"
                >
                  <Icon icon={IconNames.EXCHANGE} />
                  <span className={Classes.BUTTON_TEXT}>Empirica</span>
                </Link>
              </NavbarHeading>
            </NavbarGroup>
            <NavbarGroup align="right">
              {Meteor.isDevelopment ||
              Meteor.settings.public.debug_newPlayer ? (
                <Button
                  text="New Player"
                  minimal
                  icon={IconNames.PERSON}
                  onClick={this.handleOpenAltPlayer}
                />
              ) : (
                ""
              )}
              {Meteor.isDevelopment ||
              Meteor.settings.public.debug_resetSession ? (
                <Button
                  text="Reset current session"
                  minimal
                  icon={IconNames.REPEAT}
                  onClick={this.handleReset}
                />
              ) : (
                ""
              )}

              <Button
                text="About"
                minimal
                icon={IconNames.info_sign}
                onClick={this.handleToggleDialog}
              />

              <Dialog
                icon={IconNames.INBOX}
                isOpen={this.state.isOpen}
                onClose={this.handleToggleDialog}
                title="About"
              >
                <div className={Classes.DIALOG_BODY}>
                  Here be the presentation of the experiement(ers).
                </div>

                <div className={Classes.DIALOG_FOOTER}>
                  <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button
                      text="Close"
                      intent={Intent.PRIMARY}
                      onClick={this.handleToggleDialog}
                    />
                  </div>
                </div>
              </Dialog>
            </NavbarGroup>
          </Navbar>
        )}

        <main>{content}</main>
      </div>
    );
  }
}
