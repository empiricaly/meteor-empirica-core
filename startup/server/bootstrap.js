import log from "../../lib/log.js";

const admins = [];

const settingsAdmins = Meteor.settings.admins;
if (settingsAdmins) {
  if (!_.isArray(settingsAdmins)) {
    log.error("settings: `admins` field is not an array");
  } else {
    settingsAdmins.forEach(({ username, password }) => {
      if (!username || !password) {
        log.error("settings: `admins` require `username` and `password`");
      } else {
        admins.push({ username, password });
      }
    });
  }
}

if (admins.length === 0) {
  const tempPassword =
    Math.random()
      .toString(36)
      .slice(2) +
    Math.random()
      .toString(36)
      .slice(2);

  admins.push({
    username: "admin",
    password: tempPassword
  });

  log.warn(
    `You have not set a custom password for admin login.
If you have a settings file (e.g. local.json) with "admins" configured, you can
restart the app passing in the settings arg: "meteor --settings local.json".
You can temporarily log in with (reset on each app reload):
  - username: admin
  - password: ${tempPassword}
`
  );
}

export const bootstrapFunctions = [];
export const bootstrap = () => {
  bootstrapFunctions.forEach(f => f());
  log.debug("Bootstrapped!");
};

Meteor.startup(() => {
  bootstrap();
});

bootstrapFunctions.push(() => {
  admins.forEach(admin => {
    const exists = Meteor.users.findOne(_.omit(admin, "password"));
    if (!exists) {
      Accounts.createUser(admin);
    } else {
      Accounts.setPassword(exists._id, admin.password, { logout: false });
    }
  });
});
