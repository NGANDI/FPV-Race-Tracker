/// <reference path='../main_all.ts' />

module main {
    'use strict';

    export class ClubService {

        public clubs: Club[];
        public watchedClubToEdit: Club;

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
            this.init();
        }

        private init() {
            this.watchedClubToEdit = null;
            this.clubs = [];
            this.findAll();
        }

        public saveClub(club: Club) {
            var deferred = this.$q.defer();
            if (!club) {
                this.logService.error("ClubService saveClub", "club was null", null);
                deferred.reject();
            }
            this.databaseService.save(DBStore.CLUBS, club).then((e) => {
                this.findAll();
                deferred.resolve(e);
            }).catch((reason) => {
                this.logService.error("ClubService saveClub", "error", reason);
                deferred.reject();
            });
            return deferred.promise;
        }

        public deleteClub(club: Club) {
            var deferred = this.$q.defer();
            if (!club) {
                this.logService.error("ClubService deleteClub", "club was null", null);
                deferred.reject();
            }
            this.databaseService.delete(DBStore.CLUBS, club.idx).then((e) => {
                this.findAll();
                deferred.resolve(e);
            }).catch((reason) => {
                this.logService.error("ClubService deleteClub", "error", reason);
                deferred.reject();
            });
            return deferred.promise;
        }

        public find(idx: number) {
            if (!idx) {
                this.logService.error("ClubService find", "idx was null", idx);
                return null;
            }
            var club = this.clubs.filter((club: Club) => {
                return club.idx == idx;
            });
            if (club && club.length > 0) {
                return club[0];
            }
            else {
                this.logService.error("ClubService find", "club could not be found", idx);
                return null;
            }
        }

        public findAll() {
            this.databaseService.getAll(DBStore.CLUBS).then((e) => {
                this.clubs = e;
            }).catch((reason) => {
                this.logService.error("ClubService findAll", "error", reason);
                this.clubs = [];
            });
        }
    }
}