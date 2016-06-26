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
            var _this = this;
            var deferred = this.$q.defer();
            this.getConfig().then(function (config) {
                config.defaultLocation = location;
                _this.saveConfig(config).then(function (e) {
                    deferred.resolve(e);
                }).catch(function (reason) {
                    _this.logService.error("MainConfigService setDefaultLocation", "config could not be saved", reason);
                    deferred.reject();
                });
            }).catch(function (reason) {
                _this.logService.error("MainConfigService setDefaultLocation", "config could not be read", reason);
                deferred.reject();
            });
            return deferred.promise;
        };
        MainConfigService.prototype.setLanguageName = function (languageName) {
            var _this = this;
            var deferred = this.$q.defer();
            this.getConfig().then(function (config) {
                config.languageName = languageName;
                _this.saveConfig(config).then(function (e) {
                    deferred.resolve(e);
                }).catch(function (reason) {
                    _this.logService.error("MainConfigService setLanguage", "language could not be saved", reason);
                    deferred.reject();
                });
            }).catch(function (reason) {
                _this.logService.error("MainConfigService setLanguage", "config could not be read", reason);
                deferred.reject();
            });
            return deferred.promise;
        };
        MainConfigService.prototype.getConfig = function () {
            var _this = this;
            var deferred = this.$q.defer();
            this.databaseService.getAll(main.DBStore.MAINCONFIG).then(function (configList) {
                if (!configList || configList.length != 1) {
                    _this.logService.error("MainConfigService getConfig", "configList was null or length not 1", configList);
                    deferred.reject();
                }
                deferred.resolve(configList[0]);
            }).catch(function (reason) {
                _this.logService.error("MainConfigService getConfig", "error", reason);
                deferred.reject();
            });
            return deferred.promise;
        };
        MainConfigService.prototype.saveConfig = function (config) {
            var _this = this;
            var deferred = this.$q.defer();
            this.databaseService.save(main.DBStore.MAINCONFIG, config).then(function (e) {
                deferred.resolve(e);
            }).catch(function (reason) {
                _this.logService.error("MainConfigService saveConfig", "error", reason);
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
