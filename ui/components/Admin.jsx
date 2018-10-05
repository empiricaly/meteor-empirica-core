import React from "react";
import PropTypes from "prop-types";
import moment from "moment";

import { NavLink, Route, Switch } from "react-router-dom";
import { Helmet } from "react-helmet";

const configurationPaths = [
  "/admin/treatments",
  "/admin/treatments/archived",
  "/admin/factors",
  "/admin/factors/archived",
  "/admin/lobby-configurations",
  "/admin/lobby-configurations/archived"
];

import {
  Alert,
  Button,
  Classes,
  Divider,
  Navbar,
  NavbarGroup,
  NavbarHeading,
  NavbarDivider,
  Menu,
  MenuItem,
  Popover,
  Intent
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import AdminBatchesContainer from "../containers/admin/AdminBatchesContainer.jsx";
import AdminFactorsContainer from "../containers/admin/AdminFactorsContainer.jsx";
import AdminGames from "./admin/AdminGames.jsx";
import AdminLobbyConfigsContainer from "../containers/admin/AdminLobbyConfigsContainer.jsx";
import AdminExport from "./admin/AdminExport.jsx";
import AdminPlayers from "./admin/AdminPlayers.jsx";
import AdminTreatmentsContainer from "../containers/admin/AdminTreatmentsContainer.jsx";
import { AlertToaster, SuccessToaster } from "./Toasters.jsx";
import { withStaticProps } from "./Helpers.jsx";

const NavBarLink = ({ path, name, exact = false }) => (
  <NavLink
    exact={exact}
    to={path}
    activeClassName={Classes.ACTIVE}
    className={[Classes.BUTTON, Classes.MINIMAL].join(" ")}
  >
    {name}
  </NavLink>
);

export default class Admin extends React.Component {
  constructor(props) {
    super(props);

    const mode = configurationPaths.includes(props.location.pathname)
      ? "configuration"
      : "monitoring";
    this.state = { mode, isOpenResetGames: false, isOpenResetApp: false };
    this.uploadRef = React.createRef();
  }

  componentDidMount() {
    this.redirectLoggedOut(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.redirectLoggedOut(nextProps);

    if (this.props.location.pathname !== nextProps.location.pathname) {
      const mode = configurationPaths.includes(nextProps.location.pathname)
        ? "configuration"
        : "monitoring";
      if (mode !== this.state.mode) {
        this.setState({ mode });
      }
    }
  }

  handleConfigImport = () => {
    this.uploadRef.current.click();
  };

  onImportConfigFileSelected = event => {
    const file = event.currentTarget.files[0];
    event.currentTarget.value = null;
    if (!file) {
      AlertToaster.show({ message: "No file selected" });
      return;
    }

    this.setState({ importing: true });

    var r = new FileReader();
    r.onload = e => {
      var text = e.target.result;
      console.log(
        "Got the file: " +
          "name: " +
          file.name +
          "type: " +
          file.type +
          "size: " +
          file.size +
          " bytes:"
      );

      Meteor.call("adminImportConfiguration", { text }, err => {
        this.setState({ importing: false });
        if (err) {
          AlertToaster.show({ message: `Failed to import: ${err}` });
          return;
        } else {
          SuccessToaster.show({
            message: "Import Successful!"
          });
        }
      });
    };
    r.readAsText(file);
  };

  handleConfigExport = () => {
    this.setState({ exporting: true });
    Meteor.call("adminExportConfiguration", (err, yaml) => {
      this.setState({ exporting: false });
      if (err) {
        AlertToaster.show({
          message: `Failed to export configuration: ${err}`
        });
      } else {
        console.log(yaml);
        const ts = moment().format("YYYY-MM-DD HH-mm-ss");
        const filename = `Empirica Configuration - ${ts}.yaml`;
        const a = document.createElement("a");
        a.setAttribute(
          "href",
          "data:text/plain;charset=utf-8," + encodeURIComponent(yaml)
        );
        a.setAttribute("download", filename);
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    });
  };

  setMode = mode => {
    const { router } = this.context;

    let path;
    switch (mode) {
      case "monitoring":
        path = "/admin";
        break;
      case "configuration":
        path = "/admin/treatments";
        break;
      default:
        console.error(`unknown mode: ${mode}`);
        return;
    }

    this.setState({ mode });
    router.history.push(path);
  };

  resetDatabaseIsActived() {
    return Meteor.isDevelopment || Meteor.settings.public.debug_resetDatabase;
  }

  handleLogout = () => {
    Meteor.logout();
  };

  handleResetGames = () => {
    this.setState({ isOpenResetGames: false });
    if (!this.resetDatabaseIsActived()) {
      return;
    }
    Meteor.call("adminResetDB", true, err => {
      if (err) {
        AlertToaster.show({ message: `Failed to reset games: ${err}` });
        return;
      } else {
        SuccessToaster.show({
          message: "Games reset!"
        });
      }
    });
  };

  handleResetApp = () => {
    this.setState({ isOpenResetApp: false });
    if (!this.resetDatabaseIsActived()) {
      return;
    }
    Meteor.call("adminResetDB", err => {
      if (err) {
        AlertToaster.show({ message: `Failed to reset app: ${err}` });
        return;
      } else {
        SuccessToaster.show({
          message: "App reset!"
        });
      }
    });
  };

  redirectLoggedOut(props) {
    const { user, loggingIn, loginPath } = props;
    const { router } = this.context;

    if (!loggingIn && !user) {
      router.history.push(loginPath || `/login`);
    }
  }

  render() {
    const { user, loggingIn } = this.props;
    const {
      mode,
      importing,
      exporting,
      isOpenResetGames,
      isOpenResetApp
    } = this.state;

    if (loggingIn || !user) {
      return null;
    }

    const adminClasses = ["admin"];

    const isConfigMode = mode === "configuration";
    if (isConfigMode) {
      adminClasses.push(Classes.DARK);
    }

    return (
      <div className={adminClasses.join(" ")}>
        <Helmet>
          <title>Empirica Admin</title>
        </Helmet>
        <Navbar className="header">
          <NavbarGroup align="left">
            <NavbarHeading>
              <strong>Empirica</strong>
              <Divider tagName="span" />
              <span className={Classes.TEXT_MUTED}>
                {isConfigMode ? "Configuration" : "Monitoring"}
              </span>
            </NavbarHeading>
            {isConfigMode ? (
              <>
                <NavBarLink path="/admin/treatments" name="Treatments" />
                <NavBarLink path="/admin/factors" name="Factors" />
                <NavBarLink
                  path="/admin/lobby-configurations"
                  name="Lobby Configurations"
                />
                <NavbarDivider />
                <Button
                  text="Import"
                  minimal
                  icon={IconNames.IMPORT}
                  onClick={this.handleConfigImport}
                  loading={importing}
                />
                <input
                  ref={this.uploadRef}
                  onChange={this.onImportConfigFileSelected}
                  type="file"
                />
                <Button
                  text="Export"
                  minimal
                  icon={IconNames.EXPORT}
                  onClick={this.handleConfigExport}
                  loading={exporting}
                />
              </>
            ) : (
              <>
                <NavBarLink exact path="/admin" name="Batches" />
                <NavBarLink path="/admin/games" name="Games" />
                <NavBarLink path="/admin/players" name="Players" />
                <NavBarLink path="/admin/export" name="Export" />
              </>
            )}
          </NavbarGroup>

          <NavbarGroup align="right">
            {isConfigMode ? (
              <Button
                icon={IconNames.PLAY}
                onClick={this.setMode.bind(this, "monitoring")}
              >
                Monitoring
              </Button>
            ) : (
              <Button
                icon={IconNames.COG}
                onClick={this.setMode.bind(this, "configuration")}
              >
                Configuration
              </Button>
            )}
            <NavbarDivider />
            {this.resetDatabaseIsActived() ? (
              <>
                <Popover
                  content={
                    <Menu>
                      <MenuItem
                        intent={Intent.WARNING}
                        icon={IconNames.ERASER}
                        text="Reset Games"
                        onClick={() =>
                          this.setState({ isOpenResetGames: true })
                        }
                      />

                      <MenuItem
                        intent={Intent.DANGER}
                        icon={IconNames.TRASH}
                        text="Reset Entire App"
                        onClick={() => this.setState({ isOpenResetApp: true })}
                      />
                    </Menu>
                  }
                >
                  <Button
                    className={Classes.MINIMAL}
                    icon={IconNames.ERASER}
                    text="Reset"
                  />
                </Popover>

                <Alert
                  className={isConfigMode ? Classes.DARK : ""}
                  canOutsideClickCancel
                  canEscapeKeyCancel
                  confirmButtonText="Reset Games"
                  cancelButtonText="Cancel"
                  intent={Intent.WARNING}
                  icon={IconNames.ERASER}
                  isOpen={isOpenResetGames}
                  onCancel={() => this.setState({ isOpenResetGames: false })}
                  onConfirm={this.handleResetGames}
                >
                  <p>
                    This will remove batches/games/players and keep
                    treatments/factors.
                  </p>
                  <p>Do you wish to continue?</p>
                </Alert>

                <Alert
                  className={isConfigMode ? Classes.DARK : ""}
                  canOutsideClickCancel
                  canEscapeKeyCancel
                  confirmButtonText="Reset Entire App"
                  cancelButtonText="Cancel"
                  intent={Intent.DANGER}
                  icon={IconNames.TRASH}
                  isOpen={isOpenResetApp}
                  onCancel={() => this.setState({ isOpenResetApp: false })}
                  onConfirm={this.handleResetApp}
                >
                  <p>You are about to delete all data in the DB!</p>
                  <p>Are you sure you want to do that?</p>
                </Alert>
              </>
            ) : (
              ""
            )}
            <NavbarDivider />{" "}
            <Button
              className={Classes.MINIMAL}
              icon={IconNames.LOG_OUT}
              text="Logout"
              onClick={this.handleLogout}
            />
          </NavbarGroup>
        </Navbar>

        <main>
          <Switch>
            <Route path="/admin" exact component={AdminBatchesContainer} />
            <Route
              path="/admin/batches/archived"
              component={withStaticProps(AdminBatchesContainer, {
                archived: true
              })}
            />
            <Route path="/admin/games" component={AdminGames} />
            <Route path="/admin/players" component={AdminPlayers} />
            <Route path="/admin/export" component={AdminExport} />
            <Route
              path="/admin/treatments/archived"
              component={withStaticProps(AdminTreatmentsContainer, {
                archived: true
              })}
            />
            <Route
              path="/admin/treatments"
              component={withStaticProps(AdminTreatmentsContainer, {
                archived: false
              })}
            />
            <Route
              path="/admin/lobby-configurations/archived"
              component={withStaticProps(AdminLobbyConfigsContainer, {
                archived: true
              })}
            />
            <Route
              path="/admin/lobby-configurations"
              component={withStaticProps(AdminLobbyConfigsContainer, {
                archived: false
              })}
            />
            <Route
              path="/admin/factors/archived"
              component={withStaticProps(AdminFactorsContainer, {
                archived: true
              })}
            />
            <Route path="/admin/factors" component={AdminFactorsContainer} />
          </Switch>
        </main>
      </div>
    );
  }
}

Admin.propTypes = {
  user: PropTypes.object, // Current meteor user
  loggingIn: PropTypes.bool, // Current meteor user logging in
  loading: PropTypes.bool // Subscription status
};

Admin.contextTypes = {
  router: PropTypes.object
};
