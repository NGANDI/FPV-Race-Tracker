var main;
(function (main) {
    'use strict';
    var LanguageService = (function () {
        function LanguageService(logService, databaseService, mainConfigService, $q) {
            this.logService = logService;
            this.databaseService = databaseService;
            this.mainConfigService = mainConfigService;
            this.$q = $q;
            this.languages = [];
            this.selectedLanguage = null;
            this.getSelectedLanguage();
            this.getAllLanguages();
        }
        LanguageService.prototype.getSelectedLanguage = function () {
            var _this = this;
            var configPromise = this.mainConfigService.getConfig();
            configPromise.then(function (config) {
                _this.databaseService.find(main.DBStore.LANGUAGE, config.languageName).then(function (language) {
                    _this.selectedLanguage = language;
                }).catch(function (reason) {
                    _this.logService.error("LanguageService getSelectedLanguage", reason, config.languageName);
                    _this.selectedLanguage = null;
                });
            });
        };
        LanguageService.prototype.selectLanguage = function (languageName) {
            return this.mainConfigService.setLanguageName(languageName);
        };
        LanguageService.prototype.saveLanguage = function (language) {
            var _this = this;
            var deferred = this.$q.defer();
            if (!language) {
                this.logService.error("LanguageService saveLanguage", "language was null", null);
                deferred.reject();
            }
            this.databaseService.save(main.DBStore.LANGUAGE, language).then(function (e) {
                deferred.resolve(e);
            }).catch(function (reason) {
                _this.logService.error("LanguageService saveLanguage", "error", reason);
                deferred.reject();
            });
            return deferred.promise;
        };
        LanguageService.prototype.resetLanguage = function () {
            this.getSelectedLanguage();
        };
        LanguageService.prototype.getAllLanguages = function () {
            var _this = this;
            this.databaseService.getAllKeys(main.DBStore.LANGUAGE).then(function (languages) {
                _this.languages = languages;
            }).catch(function (reason) {
                _this.logService.warn("LanguageService getSelectedLanguage", "language keys could not be found", reason);
                _this.languages = [];
            });
        };
        LanguageService.$inject = [
            'logService',
            'databaseService',
            'mainConfigService',
            '$q'
        ];
        return LanguageService;
    }());
    main.LanguageService = LanguageService;
})(main || (main = {}));
