import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { isReactComponents } from "./lib/utils";
import "./startup/client/index.js";
import About from "./ui/components/About.jsx";
import Admin from "./ui/components/Admin.jsx";
import Centered from "./ui/components/Centered.jsx";
import Consent, { ConsentButton } from "./ui/components/Consent.jsx";
import Login from "./ui/components/Login.jsx";
import NewPlayer from "./ui/components/NewPlayer.jsx";
import NoBatch from "./ui/components/NoBatch";
import StageTimeWrapper from "./ui/components/StageTimeWrapper.jsx";
import { AlertToaster } from "./ui/components/Toasters.jsx";
import AuthorizedContainer from "./ui/containers/AuthorizedContainer.jsx";
import IdentifiedContainer from "./ui/containers/IdentifiedContainer.jsx";
import PublicContainer from "./ui/containers/PublicContainer.jsx";

const config = {
  exitSteps: () => [],
  introSteps: () => []
};

const Empirica = {
  about(AboutComp) {
    config.About = AboutComp || About;
  },

  noBatch(NoBatchComp) {
    config.NoBatch = NoBatchComp || NoBatch;
  },

  consent(ConsentComp) {
    config.Consent = ConsentComp || Consent;
  },

  newPlayer(NewPlayerComp) {
    config.NewPlayer = NewPlayerComp || NewPlayer;
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

  waiting(WaitingComp) {
    config.Waiting = WaitingComp;
  },

  introSteps(func) {
    if (!_.isFunction(func)) {
      throw new Error("Empirica.introSteps() requires a function");
    }

    config.introSteps = function() {
      const results = func.apply(null, arguments);
      if (!results || isReactComponents(results)) {
        return results || [];
      } else {
        console.error(
          "Empirica.introSteps() is not returning an array of components as expected."
        );
        return [];
      }
    };
  },

  exitSteps(func) {
    if (!_.isFunction(func)) {
      throw new Error("Empirica.exitSteps() requires a function");
    }

    config.exitSteps = function() {
      const results = func.apply(null, arguments);
      if (!results || isReactComponents(results)) {
        return results || [];
      } else {
        console.error(
          "Empirica.exitSteps() is not returning an array of components as expected."
        );
        return [];
      }
    };
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
