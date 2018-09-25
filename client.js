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
import log from "./lib/log";

const Empirica = {
  Client(config) {
    const {
      // `name` will allow to namespace experiments within the same Meteor app.
      // CURRENTLY NOT SUPPORTED
      name = "empirica",

      // loginPath configures where to redirect Admin traffic if unauthenticated
      loginPath = "/login",

      // adminPath is configures where to redirect logged in traffic from the Login screen
      adminPath = "/admin",

      // Consent page
      Consent = Consent,

      // Round component
      Round = Round
    } = config;

    const AppComp = IdentifiedContainer(PublicContainer, config);
    const AdminComp = AuthorizedContainer(Admin, { loginPath });
    const LoginComp = AuthorizedContainer(Login, { adminPath });

    const Routes = (
      <BrowserRouter>
        <div className="app">
          <Switch>
            <Route path="/" exact component={AppComp} />
            <Route path="/admin" component={AdminComp} />
            <Route path="/login" component={LoginComp} />
          </Switch>
        </div>
      </BrowserRouter>
    );

    return { name, App: AppComp, Admin: AdminComp, Login: LoginComp, Routes };
  },

  Server() {
    log.error(
      "You are trying to access the Server part of Empirica on the client. Empirica.Server() is only accessible from the server."
    );
  }
};

export default Empirica;
export { StageTimeWrapper, Centered, AlertToaster, ConsentButton };
