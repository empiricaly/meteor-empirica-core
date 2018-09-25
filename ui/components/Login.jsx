import PropTypes from "prop-types";
import React from "react";

import { Button, ControlGroup, Intent, InputGroup } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { AlertToaster } from "./Toasters.jsx";

export default class Login extends React.Component {
  state = { username: "", password: "" };

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  componentDidMount() {
    const redirecting = this.redirectLoggedIn(this.props);
    if (redirecting) {
      return;
    }
    this.timeout = setTimeout(() => {
      this.timeout = null;
      const field = document.querySelector("input");
      if (field) {
        field.focus();
      }
    }, 100);
  }

  componentWillReceiveProps(nextProps) {
    this.redirectLoggedIn(nextProps);
  }

  onChange = event => {
    const { value, name } = event.currentTarget;
    this.setState({ [name]: value });
  };

  redirectLoggedIn(props) {
    const { user, loggingIn, adminPath } = props;
    const { router } = this.context;

    if (!loggingIn && user) {
      router.history.push(adminPath || `/admin`);
      return true;
    }
  }

  handleForm = event => {
    event.preventDefault();
    const t = event.currentTarget;
    const username = t.querySelector("#username").value;
    const password = t.querySelector("#password").value;
    Meteor.loginWithPassword(username, password, err => {
      if (err) {
        AlertToaster.show({ message: String(err) });
      }
    });
  };

  render() {
    const { user, loggingIn } = this.props;
    const { username, password } = this.state;

    if (loggingIn || user) {
      return null;
    }

    return (
      <div className="login">
        <form onSubmit={this.handleForm}>
          <h1>Log in</h1>

          <ControlGroup vertical>
            <InputGroup
              large
              leftIcon={IconNames.PERSON}
              name="username"
              id="username"
              placeholder="Username"
              value={username}
              onChange={this.onChange}
              autoComplete={"off"}
            />
            <InputGroup
              large
              leftIcon={IconNames.LOCK}
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={this.onChange}
            />
            <Button text="Login" large intent={Intent.PRIMARY} type="submit" />
          </ControlGroup>
        </form>
      </div>
    );
  }
}

Login.propTypes = {
  user: PropTypes.object, // Current meteor user
  loggingIn: PropTypes.bool, // Current meteor user logging in
  loading: PropTypes.bool // Subscription status
};

Login.contextTypes = {
  router: PropTypes.object
};
