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
import { augmentGameObject } from "../games/augment.js";
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

  augmentGameObject({ game, treatment, round, stage });

  augmentGameStageRound(game, stage, round);

  player.stage = _.extend({}, stage);
  player.round = _.extend({}, round);
  augmentPlayerStageRound(player, player.stage, player.round, game);

  onSubmit(game, round, stage, player);
};
