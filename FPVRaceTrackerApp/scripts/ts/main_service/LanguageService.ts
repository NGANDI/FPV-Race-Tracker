/// <reference path='../main_all.ts' />

module main {
    'use strict';

    export class LanguageService {

        public selectedLanguage: Language;
        public languages: string[];

        public static $inject = [
            'logService',
            'databaseService',
            'mainConfigService',
            '$q'
        ];

        constructor(
            private logService: LogService,
            private databaseService: DatabaseService,
            private mainConfigService: MainConfigService,
            private $q: any
        ) {
            this.languages = [];
            this.selectedLanguage = null;
            this.getSelectedLanguage();
            this.getAllLanguages();
        }

        public getSelectedLanguage() {
            var configPromise = this.mainConfigService.getConfig();
            configPromise.then((config: MainConfig) => {
                this.databaseService.find(DBStore.LANGUAGE, config.languageName).then((language: Language) => {
                    this.selectedLanguage = language;
                }).catch((reason) => {
                    this.logService.error("LanguageService getSelectedLanguage", reason, config.languageName);
                    this.selectedLanguage = null;
                });
            })
        }

        public selectLanguage(languageName: string) {
            return this.mainConfigService.setLanguageName(languageName);
        }

        public saveLanguage(language: Language) {
            var deferred = this.$q.defer();
            if (!language) {
                this.logService.error("LanguageService saveLanguage", "language was null", null);
                deferred.reject();
            }
            this.databaseService.save(DBStore.LANGUAGE, language).then((e) => {
                deferred.resolve(e);
            }).catch((reason) => {
                this.logService.error("LanguageService saveLanguage", "error", reason);
                deferred.reject();
            });
            return deferred.promise;
        }

        public resetLanguage() {
            this.getSelectedLanguage();
        }

        public getAllLanguages() {
            this.databaseService.getAllKeys(DBStore.LANGUAGE).then((languages: string[]) => {
                this.languages = languages;
            }).catch((reason) => {
                this.logService.warn("LanguageService getSelectedLanguage", "language keys could not be found", reason);
                this.languages = [];
            });
        }
    }
}