// ActivityMonitor tracks user activity and can emit an idle/active indicator
// and a last active timestamp, in the browser.

import { Tracker } from "meteor/tracker";
import { TimeSync } from "meteor/mizzao:timesync";

// idleThreshold is the duration in ms without activity after which we declare
// the user idle.
const idleThreshold = 60000;

// Interval at which to check if there was activity detected.
const checkInterval = 1000;

let monitorInterval = null;
let idle = false;
let lastActivityTime = TimeSync.serverTime();

const idleDep = new Tracker.Dependency();
const activityDep = new Tracker.Dependency();

let focused = document.hasFocus();

function monitor(hasActivity) {
  const now = Tracker.nonreactive(TimeSync.serverTime);

  // Time hasn't synced yet
  if (!now) {
    return;
  }

  if (!lastActivityTime || (hasActivity && focused)) {
    lastActivityTime = now;
    activityDep.changed();
  }

  const newIdleness = !(focused && now - lastActivityTime < idleThreshold);
  if (newIdleness !== idle) {
    idle = newIdleness;
    idleDep.changed();
  }
}
const trueMonitor = _.bind(monitor, null, true);
const signalActivity = _.throttle(trueMonitor, checkInterval);
const signalInactivity = () => monitor(false);
function startup() {
  if (monitorInterval) {
    return;
  }

  // Listen for mouse and keyboard events on window
  // TODO other stuff - e.g. touch events?
  window.addEventListener("mousemove", signalActivity);
  window.addEventListener("click", signalActivity);
  window.addEventListener("keydown", signalActivity);

  // catch window blur events when requested and where supported
  // We'll use jQuery here instead of window.blur so that other code can attach blur events:
  // http://stackoverflow.com/q/22415296/586086
  window.addEventListener("blur", () => {
    focused = false;
    signalInactivity();
  });
  window.addEventListener("focus", () => {
    focused = true;
    signalActivity();
  });

  // First check initial state if window loaded while blurred
  // Some browsers don't fire focus on load: http://stackoverflow.com/a/10325169/586086
  focused = document.hasFocus();

  lastActivityTime = Tracker.nonreactive(TimeSync.serverTime);
  activityDep.changed();

  monitorInterval = Meteor.setInterval(monitor, checkInterval);
}

export const ActivityMonitor = {
  start() {
    startup();
  },

  get isIdle() {
    idleDep.depend();
    return idle;
  },

  get isActive() {
    idleDep.depend();
    return !idle;
  },

  get lastActivityAt() {
    activityDep.depend();

    if (_.isNaN(lastActivityTime)) {
      return null;
    }

    return new Date(lastActivityTime);
  }
};
