import "./startup/server/index.js";

import SimpleSchema from "simpl-schema";
SimpleSchema.debug = true;

import { playerIdForConn } from "./startup/server/connections.js";
import { callOnChange } from "./api/server/onchange.js";
import { callOnSubmit } from "./api/server/onsubmit.js";
import shared from "./shared";
import log from "./lib/log";
import { getFunctionParameters } from "./lib/utils";

const handleCallbackFuncParameters = func => {
  const parameters = getFunctionParameters(func);
  const handler = {
    getOwnPropertyDescriptor(target, keyIndex) {
      const key = keyIndex.split("__-__")[0];
      const index = parseInt(keyIndex.split("__-__")[1]);
      if (
        (key === "game" && index === 0) ||
        (key === "round" && index === 1) ||
        (key === "stage" && index === 2)
      ) {
        return;
      } else if (key === "players") {
        throw new Error(
          `the "players" argument has been deprecated, use "game.players" instead`
        );
      } else {
        throw new Error(`"${key}" property is not allowed on this callback`);
      }
    }
  };

  const proxy = new Proxy({}, handler);
  parameters.forEach((key, index) => {
    const keyIndex = key + "__-__" + index;
    Object.getOwnPropertyDescriptor(proxy, keyIndex);
  });
};

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

  onGameStart(func) {
    handleCallbackFuncParameters(func);
    config.onGameStart = func;
  },

  onRoundStart(func) {
    handleCallbackFuncParameters(func);
    config.onRoundStart = func;
  },

  onStageStart(func) {
    handleCallbackFuncParameters(func);
    config.onStageStart = func;
  },

  onStageEnd(func) {
    handleCallbackFuncParameters(func);
    config.onStageEnd = func;
  },

  onRoundEnd(func) {
    handleCallbackFuncParameters(func);
    config.onRoundEnd = func;
  },

  onGameEnd(func) {
    handleCallbackFuncParameters(func);
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
