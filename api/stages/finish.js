import moment from "moment";
import { config } from "../../server";
import { Games } from "../games/games.js";
import {
  augmentGameStageRound,
  augmentPlayerStageRound
} from "../player-stages/augment.js";
import { augmentGameObject } from "../games/augment.js";
import { Players } from "../players/players.js";
import { Rounds } from "../rounds/rounds.js";
import { Treatments } from "../treatments/treatments.js";
import { Stages } from "./stages.js";

export const endOfStage = stageId => {
  const stage = Stages.findOne(stageId);
  const { index, gameId, roundId } = stage;
  const game = Games.findOne(gameId);
  const round = Rounds.findOne(roundId);
  const treatment = Treatments.findOne(game.treatmentId);

  augmentGameObject(game, treatment);

  augmentGameStageRound(game, stage, round);
  game.players.forEach(player => {
    player.round = _.extend({}, round);
    player.stage = _.extend({}, stage);
    augmentPlayerStageRound(player, player.stage, player.round, game);
  });

  const { onStageEnd, onRoundEnd, onRoundStart, onStageStart } = config;
  if (onStageEnd) {
    onStageEnd(game, round, stage, game.players);
  }

  const nextStage = Stages.findOne({ gameId, index: index + 1 });

  if ((onRoundEnd && !nextStage) || stage.roundId !== nextStage.roundId) {
    onRoundEnd(game, round, game.players);
  }

  if (nextStage && (onRoundStart || onStageStart)) {
    const nextRound = Rounds.findOne(nextStage.roundId);
    augmentGameStageRound(game, nextStage, nextRound);
    game.players.forEach(player => {
      player.round = _.extend({}, nextRound);
      player.stage = _.extend({}, nextStage);
      augmentPlayerStageRound(player, player.stage, player.round, game);
    });

    if (onRoundStart && stage.roundId !== nextStage.roundId) {
      onRoundStart(game, nextRound, game.players);
    }

    if (onStageStart) {
      onStageStart(game, nextRound, nextStage, game.players);
    }
  }

  if (nextStage) {
    // go to next stage
    const currentStageId = nextStage._id;
    Games.update(gameId, {
      $set: { currentStageId }
    });
    const startTimeAt = moment().add(Stages.stagePaddingDuration);
    Stages.update(currentStageId, {
      $set: {
        startTimeAt: startTimeAt.toDate()
      }
    });
  } else {
    const onGameEnd = config.onGameEnd;
    if (onGameEnd) {
      onGameEnd(game, game.players);
    }
    Players.update(
      {
        _id: {
          $in: _.pluck(game.players, "_id"),
          $exists: { exitStatus: false }
        }
      },
      {
        $set: { exitStatus: "finished", exitAt: new Date() }
      },
      { multi: true }
    );
    Games.update(gameId, {
      $set: { finishedAt: new Date() }
    });
  }
};
