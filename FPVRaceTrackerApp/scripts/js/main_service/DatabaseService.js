var main;
(function (main) {
    'use strict';
    var DatabaseService = (function () {
        function DatabaseService(logService, $indexedDB, $q) {
            this.logService = logService;
            this.$indexedDB = $indexedDB;
            this.$q = $q;
        }
        DatabaseService.prototype.find = function (storeName, key) {
            var _this = this;
            var deferred = this.$q.defer();
            if (!storeName) {
                this.logService.error("DatabaseService find", "storeName was null", null);
                deferred.reject();
            }
            if (!key) {
                this.logService.error("DatabaseService find", "key was null", null);
                deferred.reject();
            }
            this.$indexedDB.openStore(storeName, function (store) {
                store.find(key).then(function (e) {
                    deferred.resolve(e);
                }).catch(function (reason) {
                    _this.logService.error("DatabaseService getAll", reason, storeName);
                    deferred.reject(reason);
                });
            });
            return deferred.promise;
        };
        DatabaseService.prototype.delete = function (storeName, key) {
            var _this = this;
            var deferred = this.$q.defer();
            if (!storeName) {
                this.logService.error("DatabaseService delete", "storeName was null", null);
                deferred.reject();
            }
            if (!key) {
                this.logService.error("DatabaseService delete", "key was null", null);
                deferred.reject();
            }
            this.$indexedDB.openStore(storeName, function (store) {
                store.delete(key).then(function (e) {
                    deferred.resolve(e);
                }).catch(function (reason) {
                    _this.logService.error("DatabaseService delete", reason, storeName);
                    deferred.reject(reason);
                });
            });
            return deferred.promise;
        };
        DatabaseService.prototype.getAll = function (storeName) {
            var _this = this;
            var deferred = this.$q.defer();
            if (!storeName) {
                this.logService.error("DatabaseService getAll", "storeName was null", null);
                deferred.reject();
            }
            this.$indexedDB.openStore(storeName, function (store) {
                store.getAll().then(function (e) {
                    deferred.resolve(e);
                }).catch(function (reason) {
                    _this.logService.error("DatabaseService getAll", reason, storeName);
                    deferred.reject(reason);
                });
            });
            return deferred.promise;
        };
        DatabaseService.prototype.getAllKeys = function (storeName) {
            var _this = this;
            var deferred = this.$q.defer();
            if (!storeName) {
                this.logService.error("DatabaseService getAllKeys", "storeName was null", null);
                deferred.reject();
            }
            this.$indexedDB.openStore(storeName, function (store) {
                store.getAllKeys().then(function (e) {
                    deferred.resolve(e);
                }).catch(function (reason) {
                    _this.logService.error("DatabaseService getAllKeys", reason, storeName);
                    deferred.reject(reason);
                });
            });
            return deferred.promise;
        };
        DatabaseService.prototype.save = function (storeName, object) {
            var _this = this;
            var deferred = this.$q.defer();
            if (!storeName) {
                this.logService.error("DatabaseService save", "storeName was null", null);
                deferred.reject();
            }
            if (!object) {
                this.logService.error("DatabaseService save", "object was null", storeName);
                deferred.reject();
            }
            this.$indexedDB.openStore(storeName, function (store) {
                store.upsert(object).then(function (e) {
                    deferred.resolve(e);
                }).catch(function (reason) {
                    _this.logService.error("DatabaseService save", reason, storeName);
                    deferred.reject();
                });
            });
            return deferred.promise;
        };
        DatabaseService.$inject = [
            'logService',
            '$indexedDB',
            '$q'
        ];
        return DatabaseService;
    }());
    main.DatabaseService = DatabaseService;
})(main || (main = {}));
