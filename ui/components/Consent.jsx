import React from "react";

import { Button, Intent } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import Centered from "./Centered.jsx";
import { ConsentButtonContext } from "./NewPlayer.jsx";

const ConsentButton = ({ text = "AGREE", onConsent }) => (
  <ConsentButtonContext.Consumer>
    {consentCallback => (
      <Button
        text={text}
        icon={IconNames.TICK}
        intent={Intent.SUCCESS}
        onClick={onConsent || consentCallback}
      />
    )}
  </ConsentButtonContext.Consumer>
);

export default class Consent extends React.Component {
  render() {
    return (
      <Centered>
        <div className="consent">
          <h1> Consent Form </h1>
          <p>
            This experiment is part of a MIT scientific project. Your decision
            to participate in this experiment is entirely voluntary. There are
            no known or anticipated risks to participating in this experiment.
            There is no way for us to identify you. The only information we will
            have, in addition to your responses, is the timestamps of your
            interactions with our site. The results of our research may be
            presented at scientific meetings or published in scientific
            journals. Clicking on the "AGREE" button indicates that you are at
            least 18 years of age, and agree to participate voluntary.
          </p>
          <ConsentButton />
        </div>
      </Centered>
    );
  }
}

export { ConsentButton };
