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
    config.onGameStart = function() {
      const results = func.apply(null, arguments);
      handleCallbackFuncParameters(func);

      return results;
    };
  },

  onRoundStart(func) {
    config.onRoundStart = function() {
      const results = func.apply(null, arguments);
      handleCallbackFuncParameters(func);

      return results;
    };
  },

  onStageStart(func) {
    config.onStageStart = function() {
      const results = func.apply(null, arguments);
      handleCallbackFuncParameters(func);

      return results;
    };
  },

  onStageEnd(func) {
    config.onStageEnd = function() {
      const results = func.apply(null, arguments);
      handleCallbackFuncParameters(func);

      return results;
    };
  },

  onRoundEnd(func) {
    config.onRoundEnd = function() {
      const results = func.apply(null, arguments);
      handleCallbackFuncParameters(func);

      return results;
    };
  },

  onGameEnd(func) {
    config.onGameEnd = function() {
      const results = func.apply(null, arguments);
      handleCallbackFuncParameters(func);

      return results;
    };
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
