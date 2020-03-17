import { Stages } from "../stages/stages";

export const augmentGameObject = (game, treatment) => {
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
