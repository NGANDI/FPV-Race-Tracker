/// <reference path='../main_all.ts' />

module main {
    'use strict';

    export class LanguageController {

        private language: Language;
        private languages: Language[];
        private selectedLanguageName: string;
        private saveLanguageTimeout: $timeout;

        public static $inject = [
            'languageService',
            'logService',
            'menuService',
            '$timeout',
            '$scope',
            'notificationService'
        ];

        constructor(
            private languageService: LanguageService,
            private logService: LogService,
            private menuService: MenuService,
            private $timeout: any,
            private $scope: any,
            private notificationService: NotificationService
        ) {
            this.$scope.$watch(() => this.languageService.selectedLanguage, (language) => {
                if (!language) {
                    this.language = null;
                    this.selectedLanguageName = "";
                    return;
                }
                this.language = language;
                this.selectedLanguageName = language.name;
            });
            this.$scope.$watch(() => this.languageService.languages, (languages) => {
                if (!languages || languages.length < 1) {
                    this.language = null;
                    return;
                }
                this.languages = languages;
            });

        }

        public change(key, key2, val) {
            this.$timeout.cancel(this.saveLanguageTimeout);
            this.language.json[key][key2] = val;
            this.saveLanguageTimeout = this.$timeout(() => {
                this.saveLanguage();
            }, 1000);
        }

        public languageSelected() {
            this.languageService.selectLanguage(this.selectedLanguageName).then((e) => {
                this.languageService.getSelectedLanguage();
            });
        }

        public saveLanguage() {
            this.languageService.saveLanguage(this.language).then((e) => {
                this.notificationService.notifySuccess("saved");
            });
        }

        private isVisible() {
            return this.menuService.isVisible(MenuButton.SETTINGS, SubMenuButton.SETTINGS_LANGUAGE);
        }
    }
}