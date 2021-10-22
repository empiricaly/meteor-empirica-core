const showOpenAdmin = Meteor.isDevelopment;
const showOpenAltPlayer =
  Meteor.isDevelopment || Meteor.settings.public.debug_resetSession;
const showReset =
  Meteor.isDevelopment || Meteor.settings.public.debug_newPlayer;

import {
  Button,
  Classes,
  Dialog,
  Icon,
  Intent,
  NavbarHeading
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import GameContainer from "../containers/GameContainer.jsx";
import { removePlayerId } from "../containers/IdentifiedContainer.jsx";
import { CoreWrapper } from "./Helpers.jsx";
import Loading from "./Loading.jsx";
import NewPlayer from "./NewPlayer.jsx";
import NoBatchOriginal from "./NoBatch.jsx";

const loadDocTitle = document.title;

export default class Public extends React.Component {
  state = { isAboutOpen: false };

  handleToggleAbout = () =>
    this.setState({ isAboutOpen: !this.state.isAboutOpen });

  handleOpenAdmin = event => {
    event.preventDefault();

    if (!showOpenAdmin) {
      return;
    }
    window.open("/admin", "_blank");
  };

  handleReset = event => {
    event.preventDefault();

    if (!showOpenAltPlayer) {
      return;
    }
    removePlayerId();
  };

  handleOpenAltPlayer = event => {
    event.preventDefault();

    if (!showReset) {
      return;
    }

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
    const {
      loading,
      renderPublic,
      playerIdKey,
      Header,
      NewPlayer: CustomNewPlayer,
      About,
      NoBatch,
      ...rest
    } = this.props;
    const { player } = rest;
    // const AboutComp = About || AboutOriginal;
    const AboutComp = About || null;
    const NoBatchComp = NoBatch || NoBatchOriginal;

    if (loading) {
      return <Loading />;
    }

    if (!renderPublic) {
      return <NoBatchComp />;
    }

    const adminProps = {
      showOpenAltPlayer: showOpenAltPlayer,
      onOpenAltPlayer: this.handleOpenAltPlayer,
      showReset: showReset,
      onReset: this.handleReset,
      showReset: showReset,
      about: AboutComp,
      showAbout: Boolean(AboutComp),
      onToggleAbout: this.handleToggleAbout
    };

    let content;
    if (!player) {
      content = (
        <CoreWrapper>
          <NewPlayer
            {...rest}
            {...adminProps}
            CustomNewPlayer={CustomNewPlayer}
          />
        </CoreWrapper>
      );
    } else {
      content = <GameContainer {...rest} {...adminProps} />;
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
          <Header {...adminProps} />
        ) : (
          <div className="header navbar">
            <div className="navbarGroup">
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
            </div>

            <div className="navbarGroup">
              {showOpenAltPlayer ? (
                <Button
                  text="New Player"
                  minimal
                  icon={IconNames.PERSON}
                  onClick={this.handleOpenAltPlayer}
                />
              ) : (
                ""
              )}
              {showReset ? (
                <Button
                  text="Reset current session"
                  minimal
                  icon={IconNames.REPEAT}
                  onClick={this.handleReset}
                />
              ) : (
                ""
              )}

              {showOpenAdmin ? (
                <Button
                  text="Open Admin"
                  minimal
                  icon={IconNames.PLAY}
                  onClick={this.handleOpenAdmin}
                />
              ) : (
                ""
              )}

              {AboutComp ? (
                <>
                  <Button
                    text="About"
                    minimal
                    icon={IconNames.info_sign}
                    onClick={this.handleToggleAbout}
                  />

                  <Dialog
                    icon={IconNames.INBOX}
                    isOpen={this.state.isAboutOpen}
                    onClose={this.handleToggleAbout}
                    title="About"
                  >
                    <div className={Classes.DIALOG_BODY}>
                      <AboutComp />
                    </div>

                    <div className={Classes.DIALOG_FOOTER}>
                      <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Button
                          text="Close"
                          intent={Intent.PRIMARY}
                          onClick={this.handleToggleAbout}
                        />
                      </div>
                    </div>
                  </Dialog>
                </>
              ) : null}
            </div>
          </div>
        )}

        <main>{content}</main>
      </div>
    );
  }
}
