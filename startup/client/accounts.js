// This page work on saving a login token into a cookie for server requests
// such as data export.
//
// Note: this is suboptimal, we are hacking the internals of account:base, but
// there are no clea ways to integrate with tha Meteor acccount system.

Meteor.startup(() => {
  resetToken();
});

// override Meteor._localStorage methods and resetToken accordingly
const originalSetItem = Meteor._localStorage.setItem;
Meteor._localStorage.setItem = function(key, value) {
  if (key === "Meteor.loginToken") {
    Meteor.defer(resetToken);
  }
  originalSetItem.call(Meteor._localStorage, key, value);
};

const originalRemoveItem = Meteor._localStorage.removeItem;
Meteor._localStorage.removeItem = function(key) {
  if (key === "Meteor.loginToken") {
    Meteor.defer(resetToken);
  }
  originalRemoveItem.call(Meteor._localStorage, key);
};

function resetToken() {
  const loginToken = Meteor._localStorage.getItem("Meteor.loginToken");
  const loginTokenExpires = new Date(
    Meteor._localStorage.getItem("Meteor.loginTokenExpires")
  );

  if (loginToken) {
    setToken(loginToken, loginTokenExpires);
  } else {
    setToken(null, new Date());
  }
}

function setToken(loginToken, expires) {
  document.cookie = `meteor_login_token=${loginToken}; expires=${expires.toUTCString()}; path=/`;
}
