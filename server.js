import "./startup/server/index.js";

import SimpleSchema from "simpl-schema";
SimpleSchema.debug = true;

import { playerIdForConn } from "./startup/server/connections.js";
import { callOnChange } from "./api/server/onchange.js";
import { callOnSubmit } from "./api/server/onsubmit.js";
import shared from "./shared";
import log from "./lib/log";
import { getFunctionParameters } from "./lib/utils";

const safeCallback = function(name, func, arguments) {
  try {
    switch (name) {
      case "onGameStart":
      case "onRoundStart":
      case "onStageStart":
      case "onStageEnd":
      case "onRoundEnd":
      case "onGameEnd":
        handleCallbackFuncParameters(func);
        break;

      default:
        break;
    }

    return func.apply(this, arguments);
  } catch (err) {
    console.error(`Fatal error encounter calling Empirica.${name}:`);
    console.error(err);
  }
};

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
    config.bots[name] = function() {
      return safeCallback("bot", func, arguments);
    };
  },

  onGameStart(func) {
    config.onGameStart = function() {
      return safeCallback("onGameStart", func, arguments);
    };
  },

  onRoundStart(func) {
    config.onRoundStart = function() {
      return safeCallback("onRoundStart", func, arguments);
    };
  },

  onStageStart(func) {
    config.onStageStart = function() {
      return safeCallback("onStageStart", func, arguments);
    };
  },

  onStageEnd(func) {
    config.onStageEnd = function() {
      return safeCallback("onStageEnd", func, arguments);
    };
  },

  onRoundEnd(func) {
    config.onRoundEnd = function() {
      return safeCallback("onRoundEnd", func, arguments);
    };
  },

  onGameEnd(func) {
    config.onGameEnd = function() {
      return safeCallback("onGameEnd", func, arguments);
    };
  },

  onSet(func) {
    config.onSet = function() {
      return safeCallback("onSet", func, arguments);
    };
  },

  onAppend(func) {
    config.onAppend = function() {
      return safeCallback("onAppend", func, arguments);
    };
  },

  onChange(func) {
    config.onChange = function() {
      return safeCallback("onChange", func, arguments);
    };
  },

  onSubmit(func) {
    config.onSubmit = function() {
      return safeCallback("onSubmit", func, arguments);
    };
  }
};

export { config };
export default Empirica;

// Help access to server only modules from shared modules
shared.playerIdForConn = playerIdForConn;
shared.callOnChange = callOnChange;
shared.callOnSubmit = callOnSubmit;
