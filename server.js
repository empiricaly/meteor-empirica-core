import "./startup/server/index.js";

import SimpleSchema from "simpl-schema";
SimpleSchema.debug = true;

import { playerIdForConn } from "./startup/server/connections.js";
import { callOnChange } from "./api/server/onchange.js";
import shared from "./shared";
import log from "./lib/log";

// Maybe could do better...
const config = {};

const Empirica = {
  Server(conf) {
    _.extend(config, conf);
  },

  Client() {
    log.error(
      `You are trying to access the Client part of Empirica on the server.
Empirica.Client() is only accessible from the client.`
    );
  }
};

export { config };
export default Empirica;

// Help access to server only modules from shared modules
shared.playerIdForConn = playerIdForConn;
shared.callOnChange = callOnChange;

// console.log(process.env["PWD"]);
