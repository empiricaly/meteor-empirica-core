import { withTracker } from "meteor/react-meteor-data";
import { Batches } from "../../api/batches/batches.js";
import { GameLobbies } from "../../api/game-lobbies/game-lobbies.js";
import { Games } from "../../api/games/games.js";
import { PlayerRounds } from "../../api/player-rounds/player-rounds.js";
import { PlayerStages } from "../../api/player-stages/player-stages.js";
import { Rounds } from "../../api/rounds/rounds.js";
import { Stages } from "../../api/stages/stages.js";
import { Players } from "../../api/players/players.js";
import { ActivityMonitor } from "../../lib/monitor.js";
import Public from "../components/Public";

const withStageDependencies = withTracker(({ loading, game, ...rest }) => {
  const gameId = game && game._id;
  const stageId = game && game.currentStageId;

  const sub = Meteor.subscribe("gameCurrentRoundStage", {
    gameId,
    stageId
  });

  const playerStage = PlayerStages.findOne({ gameId, stageId });
  const playerRound =
    playerStage &&
    PlayerRounds.findOne({ gameId, roundId: playerStage.roundId });

  const stage = Stages.findOne({ gameId, _id: stageId });
  const stages =
    stage && Stages.find({ gameId, roundId: stage.roundId }).fetch();
  const round = stage && Rounds.findOne({ gameId, _id: stage.roundId });

  return {
    loading: loading || !sub.ready(),
    game,
    playerStage,
    playerRound,
    stage,
    stages,
    round,
    ...rest
  };
})(Public);

const withGameDependencies = withTracker(
  ({ loading, game, gameLobby, ...rest }) => {
    if (loading) {
      return { loading: true };
    }

    const gameId = game && game._id;
    const gameLobbyId = gameLobby && gameLobby._id;
    const sub = Meteor.subscribe("gameDependencies", { gameId });
    const subGameLobby = Meteor.subscribe("gameLobbyDependencies", {
      gameLobbyId
    });
    const treatmentId =
      (game && game.treatmentId) || (gameLobby && gameLobby.treatmentId);
    const subTreatment = Meteor.subscribe("treatment", treatmentId);

    return {
      loading: !sub.ready() || !subTreatment.ready() || !subGameLobby.ready(),
      game,
      gameLobby,
      ...rest
    };
  }
)(withStageDependencies);

export default withTracker(({ loading, player, playerId, ...rest }) => {
  ActivityMonitor.start();

  if (loading) {
    return { loading: true };
  }

  const subBatches = Meteor.subscribe("runningBatches", { playerId });
  const subLobby = Meteor.subscribe("gameLobby", { playerId });
  const subGame = Meteor.subscribe("game", { playerId });
  loading = !subBatches.ready() || !subLobby.ready() || !subGame.ready();

  // Are there non-full batches left
  const batchAvailable = Batches.find({ full: false }).count() > 0;

  // Current user's assigned game and lobby
  const gameLobby = GameLobbies.findOne({
    $or: [{ playerIds: playerId }, { queuedPlayerIds: playerId }]
  });
  const game = Games.findOne({ playerIds: playerId });

  if (player && !game && !gameLobby) {
    return { loading: true };
  }

  // Check if playerId parameter is required, make sure it's present.
  const { playerIdParam, playerIdParamExclusive } = Meteor.settings.public;
  const playerIdParamRequired = playerIdParam && playerIdParamExclusive;
  const urlParams = new window.URL(document.location).searchParams;
  const playerIdParamPresent = urlParams.get(playerIdParam);
  const playerIdParamOk = playerIdParamRequired ? playerIdParamPresent : true;

  // Only open if a batch is available and the playerIdParam configuration is
  // fulfilled, or a game lobby, or a game assigned.
  const renderPublic = (batchAvailable && playerIdParamOk) || gameLobby || game;

  return {
    batchAvailable,
    renderPublic,
    loading,
    player,
    gameLobby,
    game,
    ...rest
  };
})(withGameDependencies);
