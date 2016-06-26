/// <reference path='../main_all.ts' />

module main {
    'use strict';

    export class PilotService {

        public pilots: Pilot[];
        public watchedPilotToEdit: Pilot;

        public static $inject = [
            'logService',
            '$q',
            'databaseService',
            'clubService'
        ];

        constructor(
            private logService: LogService,
            private $q: any,
            private databaseService: DatabaseService,
            private clubService: ClubService
        ) {
            this.pilots = [];
            this.findAll();
            this.watchedPilotToEdit = null;
        }

        public getClub(clubIdx: number) {
            return this.clubService.find(clubIdx);
        }

        public findAll() {
            this.databaseService.getAll(DBStore.PILOTS).then((e) => {
                this.pilots = e;
            }).catch((reason) => {
                this.logService.error("get pilots list", reason, null);
                this.pilots = [];
            });
        }

        public deletePilot(pilot: Pilot) {
            var deferred = this.$q.defer();
            if (!pilot) {
                deferred.reject();
                this.logService.warn("PilotService deletePilot", "pilot was null", null);
            }
            this.databaseService.delete(DBStore.PILOTS, pilot.idx).then((e) => {
                this.findAll();
                deferred.resolve(e);
            }).catch((reason) => {
                this.logService.error("PilotService deletePilot", "error", reason);
                deferred.reject();
            });
            return deferred.promise;
        }

        public save(pilot: Pilot) {
            var deferred = this.$q.defer();
            if (!pilot) {
                this.logService.warn("PilotService savePilot", "pilot was null", null);
                deferred.reject();
            }
            this.databaseService.save(DBStore.PILOTS, pilot).then((e) => {
                this.findAll();
                deferred.resolve(e);
            }).catch((reason) => {
                this.logService.error("new pilot db error", reason, pilot);
                deferred.reject();
            });

            return deferred.promise;
        }
    }
}