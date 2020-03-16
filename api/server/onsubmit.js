import shared from "../../shared.js";
import { Games } from "../games/games.js";
import { Players } from "../players/players.js";
import { Rounds } from "../rounds/rounds.js";
import { Stages } from "../stages/stages.js";
import { Treatments } from "../treatments/treatments.js";
import {
  augmentGameStageRound,
  augmentPlayerStageRound
} from "../player-stages/augment.js";
import { config } from "../../server";

export const callOnSubmit = params => {
  const { onSubmit } = config;
  if (!onSubmit) {
    return;
  }

  const { playerId, playerStage } = params;

  const player = Players.findOne(playerId);
  const game = Games.findOne(player.gameId);
  if (!game) {
    console.error(`${targetType} data updated without game`);
    return;
  }
  const stage = Stages.findOne(playerStage.stageId);
  if (!stage) {
    console.error(`${targetType} data updated without stage`);
    return;
  }

  const { roundId } = stage;
  const round = Rounds.findOne(roundId);
  const treatment = Treatments.findOne(game.treatmentId);

  let gameTreatment = null,
    gamePlayers = null,
    gameRounds = null;

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
          gamePlayers.forEach(player => {
            let gamePlayerRound = null,
              gamePlayerStage = null;

            Object.defineProperties(player, {
              round: {
                get() {
                  if (!gamePlayerRound) {
                    gamePlayerRound = _.extend({}, round);
                  }

                  return gamePlayerRound;
                }
              },
              stage: {
                get() {
                  if (!gamePlayerStage) {
                    gamePlayerStage = _.extend({}, stage);
                  }

                  return gamePlayerStage;
                }
              }
            });

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
    }
  });

  augmentGameStageRound(game, stage, round);

  let playerStageObj = null,
    playerRoundObj = null;

  Object.defineProperties(player, {
    stage: {
      get() {
        if (!playerStageObj) {
          player.stage = _.extend({}, stage);
        }

        return playerStageObj;
      }
    },
    round: {
      get() {
        if (!playerRoundObj) {
          player.round = _.extend({}, round);
        }

        return playerRoundObj;
      }
    }
  });

  augmentPlayerStageRound(player, player.stage, player.round, game);

  onSubmit(game, round, stage, player);
};
