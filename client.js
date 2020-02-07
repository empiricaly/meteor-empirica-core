import React from "react";
import _ from "lodash";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./startup/client/index.js";
import About from "./ui/components/About.jsx";
import Admin from "./ui/components/Admin.jsx";
import Centered from "./ui/components/Centered.jsx";
import Consent, { ConsentButton } from "./ui/components/Consent.jsx";
import Login from "./ui/components/Login.jsx";
import StageTimeWrapper from "./ui/components/StageTimeWrapper.jsx";
import { AlertToaster } from "./ui/components/Toasters.jsx";
import AuthorizedContainer from "./ui/containers/AuthorizedContainer.jsx";
import IdentifiedContainer from "./ui/containers/IdentifiedContainer.jsx";
import PublicContainer from "./ui/containers/PublicContainer.jsx";

import { isReactComponents } from "./lib/utils";

const config = {
  exitSteps: () => [],
  introSteps: () => []
};

const Empirica = {
  about(AboutComp) {
    config.About = AboutComp || About;
  },

  consent(ConsentComp) {
    config.Consent = ConsentComp || Consent;
  },

  round(RoundComp) {
    config.Round = RoundComp;
  },

  header(HeaderComp) {
    config.Header = HeaderComp;
  },

  // gameLobby, treatment, player
  lobby(LobbyComp) {
    config.Lobby = LobbyComp;
  },

  breadcrumb(BreadcrumbComp) {
    config.Breadcrumb = BreadcrumbComp;
  },

  introSteps(func) {
    if (!_.isFunction(func)) {
      throw new Error("introSteps requires a function");
    }

    config.introSteps = isReactComponents(func()) ? func : () => [];
  },

  exitSteps(func) {
    if (!_.isFunction(func)) {
      throw new Error("exitSteps requires a function");
    }

    config.exitSteps = isReactComponents(func()) ? func : () => [];
  },

  routes() {
    return (
      <BrowserRouter>
        <div className="app">
          <Switch>
            <Route path="/" exact component={this.appComp()} />
            <Route path="/admin" component={this.adminComp()} />
            <Route path="/login" component={this.loginComp()} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  },

  appComp() {
    return IdentifiedContainer(PublicContainer, config);
  },
  adminComp({ loginPath = "/login" } = {}) {
    return AuthorizedContainer(Admin, { loginPath });
  },
  loginComp({ adminPath = "/admin" } = {}) {
    return AuthorizedContainer(Login, { adminPath });
  }
};

export default Empirica;
export { StageTimeWrapper, Centered, AlertToaster, ConsentButton };
