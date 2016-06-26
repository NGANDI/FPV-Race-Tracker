/// <reference path='../main_all.ts' />

module main {
    'use strict';

    export class DatabaseService {

        public static $inject = [
            'logService',
            '$indexedDB',
            '$q'
        ];

        constructor(
            private logService: LogService,
            private $indexedDB: any,
            private $q: any
        ) {
        }
        
        public find(storeName: string, key: any) {
            var deferred = this.$q.defer();
            if (!storeName) {
                this.logService.error("DatabaseService find", "storeName was null", null);
                deferred.reject();
            }
            if (!key) {
                this.logService.error("DatabaseService find", "key was null", null);
                deferred.reject();
            }
            this.$indexedDB.openStore(storeName, (store) => {
                store.find(key).then((e) => {
                    deferred.resolve(e);
                }).catch((reason) => {
                    this.logService.error("DatabaseService getAll", reason, storeName);
                    deferred.reject(reason);
                });
            });
            return deferred.promise;
        }
        
        public delete(storeName: string, key: any) {
            var deferred = this.$q.defer();
            if (!storeName) {
                this.logService.error("DatabaseService delete", "storeName was null", null);
                deferred.reject();
            }
            if (!key) {
                this.logService.error("DatabaseService delete", "key was null", null);
                deferred.reject();
            }
            this.$indexedDB.openStore(storeName, (store) => {
                store.delete(key).then((e) => {
                    deferred.resolve(e);
                }).catch((reason) => {
                    this.logService.error("DatabaseService delete", reason, storeName);
                    deferred.reject(reason);
                });
            });
            return deferred.promise;
        }

        public getAll(storeName: string) {
            var deferred = this.$q.defer();
            if (!storeName) {
                this.logService.error("DatabaseService getAll", "storeName was null", null);
                deferred.reject();
            }
            this.$indexedDB.openStore(storeName, (store) => {
                store.getAll().then((e) => {
                    deferred.resolve(e);
                }).catch((reason) => {
                    this.logService.error("DatabaseService getAll", reason, storeName);
                    deferred.reject(reason);
                });
            });
            return deferred.promise;
        }
        
         public getAllKeys(storeName: string) {
            var deferred = this.$q.defer();
            if (!storeName) {
                this.logService.error("DatabaseService getAllKeys", "storeName was null", null);
                deferred.reject();
            }
            this.$indexedDB.openStore(storeName, (store) => {
                store.getAllKeys().then((e) => {
                    deferred.resolve(e);
                }).catch((reason) => {
                    this.logService.error("DatabaseService getAllKeys", reason, storeName);
                    deferred.reject(reason);
                });
            });
            return deferred.promise;
        }

        public save(storeName: string, object: StoredObject) {
            var deferred = this.$q.defer();
            if (!storeName) {
                this.logService.error("DatabaseService save", "storeName was null", null);
                deferred.reject();
            }
            if (!object) {
                this.logService.error("DatabaseService save", "object was null", storeName);
                deferred.reject();
            }
            this.$indexedDB.openStore(storeName, (store) => {
                store.upsert(object).then((e) => {
                    deferred.resolve(e);
                }).catch((reason) => {
                    this.logService.error("DatabaseService save", reason, storeName);
                    deferred.reject();
                });
            });
            return deferred.promise;
        }

    }
}
