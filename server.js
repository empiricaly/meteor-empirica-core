import "./startup/server/index.js";

import SimpleSchema from "simpl-schema";
SimpleSchema.debug = true;

import { playerIdForConn } from "./startup/server/connections.js";
import { callOnChange } from "./api/server/onchange.js";
import { callOnSubmit } from "./api/server/onsubmit.js";
import shared from "./shared";
import log from "./lib/log";

// Maybe could do better...
const config = { bots: {} };

const Empirica = {
  // New name for init: gameInit
  gameInit(func) {
    config.gameInit = func;
  },

  bot(name, func) {
    if (config.bots[name]) {
      throw `Bot "${name}" was declared twice!`;
    }
    config.bots[name] = func;
  },

  onAssign(func) {
    config.onAssign = func;
  },

  onPreGameInit(func) {
    config.onPreGameInit = func;
  },

  onGameStart(func) {
    config.onGameStart = func;
  },

  onRoundStart(func) {
    config.onRoundStart = func;
  },

  onStageStart(func) {
    config.onStageStart = func;
  },

  onStageEnd(func) {
    config.onStageEnd = func;
  },

  onRoundEnd(func) {
    config.onRoundEnd = func;
  },

  onGameEnd(func) {
    config.onGameEnd = func;
  },

  onSet(func) {
    config.onSet = func;
  },

  onAppend(func) {
    config.onAppend = func;
  },

  onChange(func) {
    config.onChange = func;
  },

  onSubmit(func) {
    config.onSubmit = func;
  }
};

export { config };
export default Empirica;

// Help access to server only modules from shared modules
shared.playerIdForConn = playerIdForConn;
shared.callOnChange = callOnChange;
shared.callOnSubmit = callOnSubmit;
