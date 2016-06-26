/// <reference path='../main_all.ts' />

module main {
    'use strict';

    export class EventService {

        public events: Event[];

        public static $inject = [
            'logService',
            '$q',
            'databaseService'
        ];

        constructor(
            private logService: LogService,
            private $q: any,
            private databaseService: DatabaseService
        ) {
            this.events = [];
            this.findAll();
        }

        public findAll() {
            this.databaseService.getAll(DBStore.EVENTS).then((e) => {
                this.events = e;
            }).catch((reason) => {
                this.logService.error("get events list", reason, null);
                this.events = [];
            });
        }

        public deleteEvent(event: Event) {
            var deferred = this.$q.defer();
            if (!event) {
                deferred.reject();
                this.logService.warn("EventService deleteEvent", "event was null", null);
            }
            this.databaseService.delete(DBStore.EVENTS, event.idx).then((e) => {
                this.findAll();
                deferred.resolve(e);
            }).catch((reason) => {
                this.logService.error("EventService deleteEvent", "error", reason);
                deferred.reject();
            });
            return deferred.promise;
        }

        public save(event: Event) {
            var deferred = this.$q.defer();
            if (!event) {
                this.logService.warn("EventService saveEvent", "event was null", null);
                deferred.reject();
            }
            this.databaseService.save(DBStore.EVENTS, event).then((e) => {
                this.findAll();
                deferred.resolve(e);
            }).catch((reason) => {
                this.logService.error("new event db error", reason, event);
                deferred.reject();
            });

            return deferred.promise;
        }
    }
}