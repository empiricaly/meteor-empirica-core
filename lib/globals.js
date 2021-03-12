var introStates = [];

const addState = (playerId, index) => {
  let currentPlayer = introStates.find(p => p.playerId === playerId);

  if (!currentPlayer) {
    introStates.push({ playerId, index });
    return;
  }

  currentPlayer.index = index;
};

const findState = playerId => {
  let currentPlayer = introStates.find(p => p.playerId === playerId);

  return currentPlayer ? currentPlayer.index : 0;
};

module.exports = { addState, findState };
