var main;
(function (main) {
    'use strict';
    var MainConfigService = (function () {
        function MainConfigService(logService, databaseService, $q) {
            this.logService = logService;
            this.databaseService = databaseService;
            this.$q = $q;
        }
        MainConfigService.prototype.setDefaultLocation = function (location) {
            var self = this;
            var deferred = self.$q.defer();
            self.getConfig().then(function (config) {
                config.defaultLocation = location;
                self.logService.log("MainConfigService setDefaultLocation", "config altered", config[0]);
                self.saveConfig(config).then(function (e) {
                    deferred.resolve(e);
                }).catch(function (reason) {
                    self.logService.warn("MainConfigService setDefaultLocation", "error", reason);
                    deferred.reject();
                });
            }).catch(function (reason) {
                self.logService.warn("MainConfigService setDefaultLocation", "error", reason);
                deferred.reject();
            });
            return deferred.promise;
        };
        MainConfigService.prototype.setLanguageName = function (languageName) {
            var self = this;
            var deferred = self.$q.defer();
            self.getConfig().then(function (config) {
                config.languageName = languageName;
                self.logService.log("MainConfigService setLanguage", "config altered", config[0]);
                self.saveConfig(config).then(function (e) {
                    deferred.resolve(e);
                }).catch(function (reason) {
                    self.logService.warn("MainConfigService setLanguage", "error", reason);
                    deferred.reject();
                });
            }).catch(function (reason) {
                self.logService.warn("MainConfigService setLanguage", "error", reason);
                deferred.reject();
            });
            return deferred.promise;
        };
        MainConfigService.prototype.getConfig = function () {
            var self = this;
            var deferred = self.$q.defer();
            self.databaseService.getAll(main.DBStore.MAINCONFIG).then(function (configList) {
                if (!configList || configList.length != 1) {
                    self.logService.warn("MainConfigService getConfig", "configList was null or length not 1", configList);
                    deferred.reject();
                }
                deferred.resolve(configList[0]);
            }).catch(function (reason) {
                self.logService.warn("MainConfigService getConfig", "error", reason);
                deferred.reject();
            });
            return deferred.promise;
        };
        MainConfigService.prototype.saveConfig = function (config) {
            var self = this;
            var deferred = self.$q.defer();
            self.databaseService(main.DBStore.MAINCONFIG, config).then(function (e) {
                deferred.resolve(e);
            }).catch(function (reason) {
                self.logService.warn("MainConfigService saveConfig", "error", reason);
                deferred.reject();
            });
            return deferred.promise;
        };
        MainConfigService.$inject = [
            'logService',
            'databaseService',
            '$q'
        ];
        return MainConfigService;
    }());
    main.MainConfigService = MainConfigService;
})(main || (main = {}));
