// This should contain admin top level type operations like resetting the DB
// or performing other grand operations. Use with extreme caution.
import yaml from "js-yaml";

import { Treatments } from "../../api/treatments/treatments.js";
import { Factors } from "../../api/factors/factors.js";
import { FactorTypes } from "../../api/factor-types/factor-types.js";
import { LobbyConfigs } from "../../api/lobby-configs/lobby-configs.js";
import { bootstrap } from "../../startup/server/bootstrap.js";
import log from "../../lib/log.js";

const userColls = ["meteor_accounts_loginServiceConfiguration", "users"];
const keepPartial = ["treatments", "factors", "factor_types", "lobby_configs"];
const deleteColls = [
  "game_lobbies",
  "player_inputs",
  "batches",
  "rounds",
  "counters",
  "games",
  "player_rounds",
  "players",
  "player_stages",
  "player_logs",
  "stages"
].concat(keepPartial);

const localTypeForImported = data => {
  return factorTypeId => {
    const importedType = data.factorTypes.find(t => t._id === factorTypeId);
    if (!importedType) {
      log.warn("could not find corresponding factorTypeId", factorTypeId);
      return;
    }
    const type = FactorTypes.findOne({ name: importedType.name });
    if (!type) {
      log.warn("could not import factor type, no correponding type");
      return;
    }

    return type._id;
  };
};

const localFactorForImported = data => {
  return factorId => {
    const importedFactor = data.factors.find(t => t._id === factorId);
    if (!importedFactor) {
      log.warn("could not import factor, no correponding imported factor");
      return;
    }
    const { value, factorTypeId: importedFactorTypeId } = importedFactor;

    const factorTypeId = localTypeForImported(data)(importedFactorTypeId);
    if (!factorTypeId) {
      log.warn("could not convert factor types");
      return;
    }
    const factor = Factors.findOne({ value, factorTypeId });
    if (!factor) {
      log.warn("could not import factor, no correponding factor");
      return;
    }

    return factor._id;
  };
};

const archivedUpdate = (archivedAt, existingArchivedAt) =>
  !!archivedAt === !!existingArchivedAt
    ? null
    : archivedAt
    ? { $set: { archivedAt: new Date() } }
    : { $unset: { archivedAt: true, archivedById: true } };

Meteor.methods({
  adminImportConfiguration({ text }) {
    log.debug("Import starting.");
    const data = yaml.safeLoad(text);
    const convertFactorTypeId = localTypeForImported(data);
    const convertFactorId = localFactorForImported(data);

    (data.factorTypes || []).forEach(f => {
      const { archivedAt, name } = f;
      const exists = FactorTypes.findOne({ name });
      if (exists) {
        log.debug("exists FactorTypes");
        const query = archivedUpdate(archivedAt, exists.archivedAt);
        if (query) {
          FactorTypes.update(exists._id, query);
        }
        return;
      }
      log.debug("new FactorTypes");
      FactorTypes.insert(f);
    });

    (data.factors || []).forEach(f => {
      const { factorTypeId: importedFactorTypeId, value } = f;
      const factorTypeId = convertFactorTypeId(importedFactorTypeId);
      if (!factorTypeId) {
        log.debug("could not convert factorTypeIds");
        return;
      }
      const exists = Factors.findOne({ factorTypeId, value });
      if (exists) {
        log.debug("exists Factors");
        return;
      }
      const params = { ...f, factorTypeId };
      log.debug("new Factors", params);
      Factors.insert(params);
    });

    (data.treatments || []).forEach(t => {
      const { archivedAt, factorIds: importedFactorIds } = t;
      const factorIds = importedFactorIds.map(convertFactorId);
      if (_.compact(factorIds).length !== importedFactorIds.length) {
        log.debug("could not convert factorIds");
        return;
      }
      const exists = Treatments.findOne({ factorIds });
      if (exists) {
        log.debug("exists Treatments");
        const query = archivedUpdate(archivedAt, exists.archivedAt);
        if (query) {
          Treatments.update(exists._id, query);
        }
        return;
      }
      const params = { ...t, factorIds };
      log.debug("new Treatments", params);
      Treatments.insert(params);
    });

    (data.lobbyConfigs || []).forEach(l => {
      const query = _.pick(
        l,
        "timeoutType",
        "timeoutInSeconds",
        "timeoutStrategy",
        "timeoutBots",
        "extendCount"
      );
      const exists = LobbyConfigs.findOne(query);
      if (exists) {
        log.debug("exists LobbyConfigs");
        const query = archivedUpdate(l.archivedAt, exists.archivedAt);
        if (query) {
          LobbyConfigs.update(exists._id, query);
        }
        return;
      }
      log.debug("new LobbyConfigs");
      LobbyConfigs.insert(l);
    });

    log.debug("Import done.");
  },

  adminExportConfiguration() {
    if (!this.userId) {
      throw new Error("unauthorized");
    }

    const out = {
      treatments: [],
      factorTypes: [],
      factors: [],
      lobbyConfigs: []
    };

    const treatments = Treatments.find().fetch();
    treatments.forEach(t =>
      out.treatments.push(_.pick(t, "name", "factorIds", "archivedAt"))
    );

    const factorTypes = FactorTypes.find().fetch();
    factorTypes.forEach(t =>
      out.factorTypes.push(
        _.pick(
          t,
          "_id",
          "name",
          "description",
          "required",
          "type",
          "min",
          "max",
          "archivedAt"
        )
      )
    );

    const factors = Factors.find().fetch();
    factors.forEach(f =>
      out.factors.push(
        _.pick(f, "_id", "name", "value", "factorTypeId", "archivedAt")
      )
    );

    const lobbyConfigs = LobbyConfigs.find().fetch();
    lobbyConfigs.forEach(l =>
      out.lobbyConfigs.push(
        _.pick(
          l,
          "name",
          "timeoutType",
          "timeoutInSeconds",
          "timeoutStrategy",
          "timeoutBots",
          "extendCount",
          "bacthIds",
          "gameLobbyIds",
          "archivedAt"
        )
      )
    );

    return yaml.safeDump(out);
  }
});

if (Meteor.isDevelopment || Meteor.settings.public.debug_resetDatabase) {
  Meteor.methods({
    adminResetDB(partial) {
      if (!this.userId) {
        throw new Error("unauthorized");
      }

      if (Meteor.isClient) {
        return;
      }

      const driver = MongoInternals.defaultRemoteCollectionDriver();
      const db = driver.mongo.db;

      db.listCollections().toArray(
        Meteor.bindEnvironment((err, colls) => {
          if (err) {
            console.error(err);
            return;
          }
          colls = _.sortBy(colls, c => (c.name === "players" ? 0 : 1));
          colls.forEach(collection => {
            if (!deleteColls.includes(collection.name)) {
              return;
            }
            if (partial && keepPartial.includes(collection.name)) {
              return;
            }
            const coll = driver.open(collection.name);
            coll.rawCollection().drop();
          });

          db.listCollections().toArray(
            Meteor.bindEnvironment((err, colls) => {
              if (err) {
                console.error(err);
                return;
              }

              log.debug("Keeping:");
              colls.forEach(collection => {
                let extra = "";
                if (userColls.includes(collection.name)) {
                  extra = "(used by admin login system)";
                }
                log.debug(" - " + collection.name, extra);
              });

              log.debug("Cleared DB");

              bootstrap();
            })
          );
        })
      );
    }
  });
}

Meteor.startup(() => {});
