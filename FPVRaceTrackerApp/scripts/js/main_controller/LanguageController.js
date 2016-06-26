var main;
(function (main) {
    'use strict';
    var LanguageController = (function () {
        function LanguageController(languageService, logService, menuService, $timeout, $scope, notificationService) {
            var _this = this;
            this.languageService = languageService;
            this.logService = logService;
            this.menuService = menuService;
            this.$timeout = $timeout;
            this.$scope = $scope;
            this.notificationService = notificationService;
            this.$scope.$watch(function () { return _this.languageService.selectedLanguage; }, function (language) {
                if (!language) {
                    _this.language = null;
                    _this.selectedLanguageName = "";
                    return;
                }
                _this.language = language;
                _this.selectedLanguageName = language.name;
            });
            this.$scope.$watch(function () { return _this.languageService.languages; }, function (languages) {
                if (!languages || languages.length < 1) {
                    _this.language = null;
                    return;
                }
                _this.languages = languages;
            });
        }
        LanguageController.prototype.change = function (key, key2, val) {
            var _this = this;
            this.$timeout.cancel(this.saveLanguageTimeout);
            this.language.json[key][key2] = val;
            this.saveLanguageTimeout = this.$timeout(function () {
                _this.saveLanguage();
            }, 1000);
        };
        LanguageController.prototype.languageSelected = function () {
            var _this = this;
            this.languageService.selectLanguage(this.selectedLanguageName).then(function (e) {
                _this.languageService.getSelectedLanguage();
            });
        };
        LanguageController.prototype.saveLanguage = function () {
            var _this = this;
            this.languageService.saveLanguage(this.language).then(function (e) {
                _this.notificationService.notifySuccess("saved");
            });
        };
        LanguageController.prototype.isVisible = function () {
            return this.menuService.isVisible(main.MenuButton.SETTINGS, main.SubMenuButton.SETTINGS_LANGUAGE);
        };
        LanguageController.$inject = [
            'languageService',
            'logService',
            'menuService',
            '$timeout',
            '$scope',
            'notificationService'
        ];
        return LanguageController;
    }());
    main.LanguageController = LanguageController;
})(main || (main = {}));
