Package.describe({
  name: "empirica:core",
  version: "1.17.0",
  summary: "Core Meteor package for the experiment Empirica platform.",
  git: "https://github.com/empiricaly/meteor-empirica-core.git",
  documentation: "README.md"
});

Package.onUse(function(api) {
  api.versionsFrom("1.10.2");

  api.use([
    "meteor-base",
    "ecmascript",
    "less@3.0.1",

    // Core Meteor. Needed?
    "es5-shim",
    "mongo",
    "reactive-var",
    "tracker",

    "aldeed:collection2@3.0.6", // Attach a SimpleSchema to a Mongo.Collection
    "aldeed:schema-deny@3.0.0", // deny update
    "aldeed:schema-index@3.0.0", // indexes
    "dburles:collection-helpers@1.1.0", // Add helper methods to Collection objects
    "reywood:publish-composite@1.7.3", // When publishes need to be reactive on multiple levels of data
    "matb33:collection-hooks@0.9.1", // Add before/after hooks on insert, update...

    // React
    "react-meteor-data@0.2.16", // Connects the meteor reactive model to react

    // Methods
    "mdg:validated-method@1.1.0", // Define Meteor methods in a structured way

    "random",
    "dynamic-import",
    "accounts-password",
    "mizzao:timesync@0.5.1",
    "underscore"
    // "tmeasday:check-npm-versions@0.3.2"
  ]);

  api.imply(["underscore"]);

  api.addFiles("main.less", "client");
  api.mainModule("client.js", "client");
  api.mainModule("server.js", "server");
});

Npm.depends({
  archiver: "3.0.0",
  "@blueprintjs/core": "3.6.1",
  "@blueprintjs/icons": "3.1.0",
  "babel-runtime": "6.26.0",
  bcrypt: "3.0.8",
  colors: "1.3.0",
  "content-disposition": "0.5.2",
  history: "4.7.2",
  hoek: "4.2.1",
  "identicon.js": "2.3.2",
  inflection: "1.12.0",
  jdenticon: "2.1.0",
  "js-yaml": "3.12.0",
  loglevel: "1.6.1",
  "meteor-node-stubs": "0.4.1",
  "message-box": "0.2.0",
  moment: "2.22.2",
  "prop-types": "15.6.1",
  react: "16.5.2",
  "react-addons-css-transition-group": "15.6.2",
  "react-dom": "16.5.2",
  "react-helmet": "5.2.0",
  "react-router-dom": "4.3.1",
  "stream-buffers": "3.0.2",
  "simpl-schema": "1.5.5"
});

Package.onTest(function(api) {
  api.use("ecmascript");
  api.use("tinytest");
  api.use("empirica:core");
  api.mainModule("core-tests.js");
});
