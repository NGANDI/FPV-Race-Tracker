/// <reference path="../_reference.ts"/>
class DatabaseService {

    public static DB_NAME = "FPV_RACE_TRACKER";
    public static DB_VERSION = 18;
    public static IDB_SUPPORTED = false;
    public static DB;
    public static store_pilots = "pilots";
    public static store_competitions = "competitions";
    public static store_races = "races";
    public static store_liveResults = "liveResults";
    public static store_raceBands = "racebands";
    public static store_classes = "classes";
    public static store_windowConfig = "windowConfig";
    public static store_user = "user";

    static init(onSuccess) {
        if ("indexedDB" in window) {
            DatabaseService.IDB_SUPPORTED = true;
        }
        else {
            NotificationService.notify("local storage not supported!!!!, please tell me!!");
        }

        if (DatabaseService.IDB_SUPPORTED) {
            var openRequest = indexedDB.open(DatabaseService.DB_NAME, DatabaseService.DB_VERSION);
            
            //this is not supported in minor chrome versions
            openRequest.onupgradeneeded = function(e) {
                DatabaseService.DB = e.target.result;
                if (!DatabaseService.DB.objectStoreNames.contains(DatabaseService.store_pilots)) {
                    DatabaseService.DB.createObjectStore(DatabaseService.store_pilots, { autoIncrement: true });
                }
                if (!DatabaseService.DB.objectStoreNames.contains(DatabaseService.store_competitions)) {
                    DatabaseService.DB.createObjectStore(DatabaseService.store_competitions, { autoIncrement: true });
                }
                if (!DatabaseService.DB.objectStoreNames.contains(DatabaseService.store_races)) {
                    var store = DatabaseService.DB.createObjectStore(DatabaseService.store_races, { autoIncrement: true });
                    store.createIndex("competitionUUID", "competitionUUID", { unique: false });
                }
                if (!DatabaseService.DB.objectStoreNames.contains(DatabaseService.store_liveResults)) {
                    DatabaseService.DB.createObjectStore(DatabaseService.store_liveResults, { autoIncrement: true });
                }
                if (!DatabaseService.DB.objectStoreNames.contains(DatabaseService.store_classes)) {
                    DatabaseService.DB.createObjectStore(DatabaseService.store_classes, { autoIncrement: true });
                }
                if (!DatabaseService.DB.objectStoreNames.contains(DatabaseService.store_raceBands)) {
                    DatabaseService.DB.createObjectStore(DatabaseService.store_raceBands, { autoIncrement: true });
                }
                if (!DatabaseService.DB.objectStoreNames.contains(DatabaseService.store_windowConfig)) {
                    DatabaseService.DB.createObjectStore(DatabaseService.store_windowConfig, { autoIncrement: true });
                }
                if (!DatabaseService.DB.objectStoreNames.contains(DatabaseService.store_user)) {
                    DatabaseService.DB.createObjectStore(DatabaseService.store_user, { autoIncrement: true });
                }
                if (DatabaseService.DB.version == 9) {
                    setTimeout(function() {
                        var transaction = DatabaseService.DB.transaction([DatabaseService.store_windowConfig], "readwrite");
                        var store = transaction.objectStore(DatabaseService.store_windowConfig);
                        var request = store.clear();
                    },
                        3000);
                }
                if (DatabaseService.DB_VERSION == 14) {
                    console.log("reset");
                    setTimeout(CloudSyncService.resetAllSyncForDeveloper,
                        3000);
                }
                if (DatabaseService.DB_VERSION == 18) {
                    setTimeout(function() {
                        if (!UserService.user.calendarKey || UserService.user.calendarKey.length == 0) {
                            UserService.user.calendarKey = UUIDService.next();
                        }
                        UserService.saveCurrentUser();
                    },
                        3000);
                }
            }

            openRequest.onsuccess = function(e) {
                DatabaseService.DB = e.target.result;
                onSuccess();
            }

            openRequest.onerror = function(e) {
                NotificationService.notify("Database initialization failed, please contact developer!");
                console.dir(e);
            }
        }
    }

    static readAll(dbName: string, callback) {
        var transaction = DatabaseService.DB.transaction([dbName], "readonly");
        var objectStore = transaction.objectStore(dbName);
        var cursor = objectStore.openCursor();
        var array = [];
        cursor.onsuccess = function(e) {
            var res = e.target.result;
            if (res) {
                if (!res.value.deleted) {
                    array.push(res.value);
                }
                res.continue();
            }
        }
        transaction.oncomplete = function(e) {
            callback(array);
        }
    }

    static resetAllSyncRecords(dbName: string) {
        var transaction = DatabaseService.DB.transaction([dbName], "readwrite");
        var objectStore = transaction.objectStore(dbName);
        var cursor = objectStore.openCursor();
        var array = [];
        cursor.onsuccess = function(e) {
            var res = e.target.result;
            if (res) {
                var obj: BaseEntity = res.value;
                obj.saved = null;
                obj.synced = null;
                DatabaseService.save(dbName, obj, function() {
                }, function() {
                });
                res.continue();
            }
        }
    }

    static allColumnsSynced(dbName: string, callback) {
        var transaction = DatabaseService.DB.transaction([dbName], "readonly");
        var objectStore = transaction.objectStore(dbName);
        var cursor = objectStore.openCursor();
        var everythingSyced = true;
        cursor.onsuccess = function(e) {
            var res = e.target.result;
            if (res) {
                var obj: BaseEntity = res.value;
                if (!obj.synced || obj.synced < obj.saved) {
                    everythingSyced = false;
                }
                res.continue();
            }
        }
        transaction.oncomplete = function(e) {
            callback(everythingSyced);
        }
    }

    static readAllUpdatesForSync(dbName: string, callback) {
        var transaction = DatabaseService.DB.transaction([dbName], "readonly");
        var objectStore = transaction.objectStore(dbName);
        var cursor = objectStore.openCursor();
        var array = [];
        var syncDate = new Date();
        cursor.onsuccess = function(e) {
            var res = e.target.result;
            if (res) {
                var obj: BaseEntity = res.value;
                if (!obj.synced || obj.synced < obj.saved) {
                    array.push(obj);
                    obj.synced = syncDate;
                }
                res.continue();
            }
        }
        transaction.oncomplete = function(e) {
            array.forEach(function(obj) {
                DatabaseService.saveSync(dbName, obj, function() {
                }, function() {
                    console.error("SYNC SAVE TIMESTAMP ERROR");
                });
            });
            callback(array);
        }
    }

    public static getStore(dbName: string) {
        return DatabaseService.DB.transaction([dbName], "readonly").objectStore(dbName);
    }

    static findByUUID(dbName: string, uuid: string, callback) {
        try {
            var transaction = DatabaseService.DB.transaction([dbName], "readonly");
            var objectStore = transaction.objectStore(dbName);
            var ob = objectStore.get(uuid);
            ob.onsuccess = function(e) {
                if (ob.result && ob.result.deleted) {
                    callback(null);
                }
                else {
                    callback(ob.result);
                }
            }
            ob.onerror = function(e) {
                callback(null);
            }
        }
        catch (ex) {
            console.log("ex", ex);
        }
    }


    static saveSync(dbName: string, object: BaseEntity, success, error) { //success and error take (e) as param
        var transaction = DatabaseService.DB.transaction([dbName], "readwrite");
        var store = transaction.objectStore(dbName);
        var request = store.put(object, object.uuid)
        request.onsuccess = success;
        request.onerror = function() {
            object.saved = null;
            error();
        };
    }


    static save(dbName: string, object: BaseEntity, success, error) { //success and error take (e) as param
        object.saved = new Date();
        var transaction = DatabaseService.DB.transaction([dbName], "readwrite");
        var store = transaction.objectStore(dbName);
        var request = store.put(object, object.uuid)
        request.onsuccess = success;
        request.onerror = function() {
            object.saved = null;
            error();
        };
    }

    static replaceContent(dbName: string, data: BaseEntity[], callback) {
        var mappedData: BaseEntity[] = [];
        switch (dbName) {
            case DatabaseService.store_pilots:
                data.forEach((entry) => {
                    mappedData.push(new Pilot(entry));
                });
                break;
            case DatabaseService.store_competitions:
                data.forEach((entry) => {
                    mappedData.push(new Competition(entry));
                });
                break;
            case DatabaseService.store_races:
                data.forEach((entry) => {
                    mappedData.push(new Race(entry));
                });
                break;
            case DatabaseService.store_raceBands:
                data.forEach((entry) => {
                    mappedData.push(new RaceBand(entry));
                });
                break;
            case DatabaseService.store_classes:
                data.forEach((entry) => {
                    mappedData.push(new Classs(entry));
                });
                break;
            case DatabaseService.store_user:
                data.forEach((entry) => {
                    mappedData.push(new User(entry));
                });
                break;
            case DatabaseService.store_liveResults:
                data.forEach((entry) => {
                    mappedData.push(new RaceResultEntry(entry));
                });
                break;
        }

        var transaction = DatabaseService.DB.transaction([dbName], "readwrite");
        var store = transaction.objectStore(dbName);
        var request = store.clear();
        request.onsuccess = function(e) {
            mappedData.forEach((entry) => {
                DatabaseService.saveSync(dbName, entry, function(e) { }, function(e) { });
            });
        }
        request.onerror = function(e) {
        }
        transaction.oncomplete = function(e) { callback(); };
    }


    static delete(dbName: string, object: BaseEntity, success, error) { //success and error take (e) as param
        object.deleted = true;
        DatabaseService.save(dbName, object, success, error);
        //        try {
        //            var transaction = DatabaseService.DB.transaction([dbName], "readwrite");
        //            var store = transaction.objectStore(dbName);
        //            var request = store.delete(object.uuid);
        //
        //            request.onsuccess = success;
        //            request.onerror = error;
        //        }
        //        catch (ex) {
        //        }
    }
}

