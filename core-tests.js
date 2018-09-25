// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by core.js.
import { name as packageName } from "meteor/empirica:core";

// Write your tests here!
// Here is an example.
Tinytest.add('core - example', function (test) {
  test.equal(packageName, "core");
});
