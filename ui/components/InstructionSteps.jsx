import React from "react";
import Loading from "./Loading.jsx";
import { playerUpdateIntroStepIndex } from "../../api/players/methods.js";

export default class InstructionSteps extends React.Component {
  state = {};
  componentWillMount() {
    const { introSteps, treatment } = this.props;

    const factors = treatment.factorsObject();
    const steps = introSteps && introSteps({ treatment: factors }, factors);

    const noInstruction = !introSteps || !steps || steps.length === 0;

    if (noInstruction) {
      onDone();
    }

    this.setState({ steps, noInstruction });
  }

  onNext = () => {
    const { player, type } = this.props;
    const { steps } = this.state;
    if (steps.length - 1 > player.introStepIndex) {
      playerUpdateIntroStepIndex.call({
        playerId: player.id,
        introStepIndex: player.introStepIndex + 1,
        type
      });
    }
    if (player.introStepIndex === steps.length - 1) {
      onDone();
    }
  };

  onPrev = () => {
    const { player, type } = this.props;
    if (player.introStepIndex > 0) {
      playerUpdateIntroStepIndex.call({
        playerId: player.id,
        introStepIndex: player.introStepIndex - 1,
        type
      });
    }
  };

  render() {
    const { treatment, player } = this.props;
    const { steps, noInstruction } = this.state;

    if (noInstruction) {
      return <Loading />;
    }

    const Step = steps[player.introStepIndex];
    const hasNext = steps.length > player.introStepIndex;
    const hasPrev = player.introStepIndex > 0;
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
