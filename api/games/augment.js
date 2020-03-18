import { Stages } from "../stages/stages";
import { augmentPlayerStageRound } from "../player-stages/augment";

export const augmentGameObject = ({
  game,
  treatment,
  round = undefined,
  stage = undefined,
  firstRoundId = undefined,
  currentStageId = undefined
}) => {
  let gameTreatment = null,
    gamePlayers = null,
    gameRounds = null,
    gameStages = null;

  Object.defineProperties(game, {
    treatment: {
      get() {
        if (!gameTreatment) {
          gameTreatment = treatment.factorsObject();
        }

        return gameTreatment;
      }
    },
    players: {
      get() {
        if (!gamePlayers) {
          gamePlayers = game.getPlayers();

          if (firstRoundId) {
            round = game.getRounds().find(r => r._id === firstRoundId);
            stage = round.stages.find(s => s._id === currentStageId);
          }

          gamePlayers.forEach(player => {
            player.round = _.extend({}, round);
            player.stage = _.extend({}, stage);
            augmentPlayerStageRound(player, player.stage, player.round, game);
          });
        }

        return gamePlayers;
      }
    },
    rounds: {
      get() {
        if (!gameRounds) {
          gameRounds = game.getRounds();
          gameRounds.forEach(round => {
            let stages = null;
            Object.defineProperty(round, "stages", {
              get() {
                if (!stages) {
                  stages = Stages.find({ roundId: round._id }).fetch();
                }

                return stages;
              }
            });
          });
        }

        return gameRounds;
      }
    },
    stages: {
      get() {
        if (!gameStages) {
          gameStages = game.getStages();
        }

        return gameStages;
      }
    }
  });
};
