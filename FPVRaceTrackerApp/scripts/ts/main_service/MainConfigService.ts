/// <reference path='../main_all.ts' />

module main {
    'use strict';

    export class MainConfigService {

        public static $inject = [
            'logService',
            'databaseService',
            '$q'
        ];

        constructor(
            private logService: LogService,
            private databaseService: DatabaseService,
            private $q: any
        ) {
        }

        public setDefaultLocation(location: string) {
            var deferred = this.$q.defer();

            this.getConfig().then((config: MainConfig) => {
                config.defaultLocation = location;
                this.saveConfig(config).then((e) => {
                    deferred.resolve(e);
                }).catch((reason) => {
                    this.logService.error("MainConfigService setDefaultLocation", "config could not be saved", reason);
                    deferred.reject();
                });
            }).catch((reason) => {
                this.logService.error("MainConfigService setDefaultLocation", "config could not be read", reason);
                deferred.reject();
            });
            return deferred.promise;
        }

        public setLanguageName(languageName: string) {
            var deferred = this.$q.defer();

            this.getConfig().then((config: MainConfig) => {
                config.languageName = languageName;
                this.saveConfig(config).then((e) => {
                    deferred.resolve(e);
                }).catch((reason) => {
                    this.logService.error("MainConfigService setLanguage", "language could not be saved", reason);
                    deferred.reject();
                });
            }).catch((reason) => {
                this.logService.error("MainConfigService setLanguage", "config could not be read", reason);
                deferred.reject();
            });
            return deferred.promise;
        }

        public getConfig() {
            var deferred = this.$q.defer();
            this.databaseService.getAll(DBStore.MAINCONFIG).then((configList: MainConfig[]) => {
                if (!configList || configList.length != 1) {
                    this.logService.error("MainConfigService getConfig", "configList was null or length not 1", configList);
                    deferred.reject();
                }
                deferred.resolve(configList[0]);
            }).catch((reason) => {
                this.logService.error("MainConfigService getConfig", "error", reason);
                deferred.reject();
            });
            return deferred.promise;
        }

        private saveConfig(config: MainConfig) {
            var deferred = this.$q.defer();
            this.databaseService.save(DBStore.MAINCONFIG, config).then((e) => {
                deferred.resolve(e);
            }).catch((reason) => {
                this.logService.error("MainConfigService saveConfig", "error", reason);
                deferred.reject();
            });
            return deferred.promise;
        }
    }
}
