import moment from "moment";

import { Games } from "../games.js";
import { Players } from "../../players/players.js";
import { Rounds } from "../../rounds/rounds.js";
import { Stages } from "../../stages/stages.js";
import { Treatments } from "../../treatments/treatments.js";
import {
  augmentPlayerStageRound,
  augmentGameStageRound
} from "../../player-stages/augment.js";
import { config } from "../../../server";
import { endOfStage } from "../../stages/finish.js";
import Cron from "../../../startup/server/cron.js";

Cron.add({
  name: "Trigger stage timeout or Run bots",
  interval: 1000,
  task: function(log) {
    const query = {
      status: "running",
      estFinishedTime: { $gte: new Date() },
      finishedAt: { $exists: false }
    };
    Games.find(query).forEach(game => {
      const stage = Stages.findOne(game.currentStageId);

      const now = moment();
      const startTimeAt = moment(stage.startTimeAt);
      const endTimeAt = startTimeAt.add(stage.durationInSeconds, "seconds");
      const ended = now.isSameOrAfter(endTimeAt);
      if (ended) {
        endOfStage(stage._id);
      } else {
        const { gameId } = stage;
        // make bots play
        const query = { gameId, bot: { $exists: true } };
        if (Players.find(query).count() === 0) {
          return;
        }
        const botPlayers = Players.find(query);
        const treatment = Treatments.findOne(game.treatmentId);
        const round = Rounds.findOne(stage.roundId);

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
                gamePlayers.forEach(player => {
                  let playerRound = null,
                    playerStage = null;

                  Object.defineProperties(player, {
                    round: {
                      get() {
                        if (!playerRound) {
                          playerRound = _.extend({}, round);
                        }

                        return playerRound;
                      }
                    },
                    stage: {
                      get() {
                        if (!playerStage) {
                          playerStage = _.extend({}, stage);
                        }

                        return playerStage;
                      }
                    }
                  });

                  augmentPlayerStageRound(
                    player,
                    player.stage,
                    player.round,
                    game
                  );
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

        botPlayers.forEach(botPlayer => {
          const bot = config.bots[botPlayer.bot];
          if (!bot) {
            log.error(
              `Definition for bot "${botPlayer.bot}" was not found in the server config!`
            );
            return;
          }

          if (!bot.onStageTick) {
            return;
          }

          augmentGameStageRound(game, stage, round);

          let botPlayerStage = null,
            botPlayerRound = null;

          Object.defineProperties(botPlayer, {
            stage: {
              get() {
                if (!botPlayerStage) {
                  botPlayer.stage = _.extend({}, stage);
                }

                return botPlayerStage;
              }
            },
            round: {
              get() {
                if (!botPlayerRound) {
                  botPlayer.round = _.extend({}, round);
                }

                return botPlayerRound;
              }
            }
          });

          augmentPlayerStageRound(
            botPlayer,
            botPlayer.stage,
            botPlayer.round,
            game
          );

          const tick = endTimeAt.diff(now, "seconds");

          bot.onStageTick(botPlayer, game, round, stage, tick);
        });
      }
    });
  }
});
