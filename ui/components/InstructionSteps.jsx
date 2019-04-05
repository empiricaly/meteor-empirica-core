import React from "react";
import Loading from "./Loading.jsx";

export default class InstructionSteps extends React.Component {
  state = { current: 0 };
  componentWillMount() {
    const { introSteps, treatment, onDone } = this.props;

    const factors = treatment.factorsObject();
    const steps = introSteps && introSteps({ treatment: factors }, factors);

    const noInstruction = !introSteps || !steps || steps.length === 0;

    if (noInstruction) {
      onDone();
    }

    this.setState({ steps, noInstruction }, this.focusFirstField);
  }

  focusFirstField = () => {
    const input = window.document.querySelector(".introduction-steps input");
    if (input) {
      input.focus();
    }
  };

  onNext = () => {
    let { onDone } = this.props;
    let { steps, current } = this.state;
    current = current + 1;
    if (current >= steps.length) {
      onDone();
      return;
    }
    this.setState({ current }, this.focusFirstField);
  };

  onPrev = () => {
    this.setState({ current: this.state.current - 1 }, this.focusFirstField);
  };

  render() {
    const { treatment, player } = this.props;
    const { steps, current, noInstruction } = this.state;

    if (noInstruction) {
      return <Loading />;
    }

    const Step = steps[current];
    const hasNext = steps.length - 1 > current;
    const hasPrev = current > 0;
    const conds = treatment.factorsObject();
    return (
      <div className="introduction-steps">
        <Step
          hasPrev={hasPrev}
          hasNext={hasNext}
          onPrev={this.onPrev}
          onNext={this.onNext}
          treatment={conds}
          game={{ treatment: conds }}
          player={player}
        />
      </div>
    );
  }
}
