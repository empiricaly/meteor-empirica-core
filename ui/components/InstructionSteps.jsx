import React from "react";
import Loading from "./Loading.jsx";

export default class InstructionSteps extends React.Component {
  state = { current: 0 };

  componentDidMount() {
    this.setIntroStepIndex();
  }

  setIntroStepIndex() {
    const { player } = this.props;
    if (!window.currentIntroStep) {
      window.currentIntroStep = {};
      return;
    }

    const currentIntroStep = window.currentIntroStep[player._id];
    if (!currentIntroStep) {
      return;
    }

    this.setState({ current: currentIntroStep });
  }

  componentWillMount() {
    const { introSteps, treatment, onDone } = this.props;

    const factors = treatment.factorsObject();
    const steps = introSteps({ treatment: factors }, factors);

    const noInstruction = !steps || steps.length === 0;

    if (noInstruction) {
      onDone();
    }

    this.setState({ steps, noInstruction });
  }

  onNext = () => {
    let { onDone, player } = this.props;
    let { steps, current } = this.state;
    current = current + 1;
    if (current >= steps.length) {
      onDone();
      return;
    }
    this.setState({ current });
    window.currentIntroStep[player._id] = current;
  };

  onPrev = () => {
    const { player } = this.props;
    let current = this.state.current - 1;

    this.setState({ current });
    window.currentIntroStep[player._id] = current;
  };

  resetIntroSteps = () => {
    const { player } = this.props;
    this.setState({ current: 0 });

    if (!window.currentIntroStep) {
      return;
    }

    if (!window.currentIntroStep[player._id]) {
      return;
    }

    window.currentIntroStep[player._id] = 0;
  };

  render() {
    const { treatment, player, ...rest } = this.props;
    const { steps, current, noInstruction } = this.state;

    if (noInstruction) {
      return <Loading />;
    }

    const Step = steps[current];
    const hasNext = steps.length - 1 > current;
    const hasPrev = current > 0;
    const conds = treatment.factorsObject();
    const introPlayer = { ...player, resetIntroSteps: this.resetIntroSteps };

    return (
      <div className="introduction-steps">
        <Step
          {...rest}
          hasPrev={hasPrev}
          hasNext={hasNext}
          onPrev={this.onPrev}
          onNext={this.onNext}
          player={introPlayer}
          treatment={conds}
          game={{ treatment: conds }}
        />
      </div>
    );
  }
}
