import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./startup/client/index.js";
import Admin from "./ui/components/Admin.jsx";
import Login from "./ui/components/Login.jsx";
import Consent, { ConsentButton } from "./ui/components/Consent.jsx";
import IdentifiedContainer from "./ui/containers/IdentifiedContainer.jsx";
import AuthorizedContainer from "./ui/containers/AuthorizedContainer.jsx";
import PublicContainer from "./ui/containers/PublicContainer.jsx";
import StageTimeWrapper from "./ui/components/StageTimeWrapper.jsx";
import Centered from "./ui/components/Centered.jsx";
import { AlertToaster } from "./ui/components/Toasters.jsx";

const config = {};

const Empirica = {
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
    config.introSteps = func;
  },

  exitSteps(func) {
    config.exitSteps = func;
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
