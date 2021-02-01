import { Stages } from "../stages/stages";
import { augmentPlayerStageRound } from "../player-stages/augment";
import { Rounds } from "../rounds/rounds";
import { Players } from "../players/players";

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
          gamePlayers = Players.find({ _id: { $in: game.playerIds } }).fetch();

          if (firstRoundId) {
            round = Rounds.findOne(firstRoundId);
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
          gameRounds = Rounds.find({ gameId: game._id }).fetch();
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
          gameStages = Stages.find({ gameId: game._id }).fetch();
        }

        return gameStages;
      }
    }
  });
};
