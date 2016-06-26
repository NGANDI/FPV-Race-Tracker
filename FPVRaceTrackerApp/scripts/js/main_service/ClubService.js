var main;
(function (main) {
    'use strict';
    var ClubService = (function () {
        function ClubService(logService, databaseService, $q) {
            this.logService = logService;
            this.databaseService = databaseService;
            this.$q = $q;
            this.init();
        }
        ClubService.prototype.init = function () {
            this.watchedClubToEdit = null;
            this.clubs = [];
            this.findAll();
        };
        ClubService.prototype.saveClub = function (club) {
            var _this = this;
            var deferred = this.$q.defer();
            if (!club) {
                this.logService.error("ClubService saveClub", "club was null", null);
                deferred.reject();
            }
            this.databaseService.save(main.DBStore.CLUBS, club).then(function (e) {
                _this.findAll();
                deferred.resolve(e);
            }).catch(function (reason) {
                _this.logService.error("ClubService saveClub", "error", reason);
                deferred.reject();
            });
            return deferred.promise;
        };
        ClubService.prototype.deleteClub = function (club) {
            var _this = this;
            var deferred = this.$q.defer();
            if (!club) {
                this.logService.error("ClubService deleteClub", "club was null", null);
                deferred.reject();
            }
            this.databaseService.delete(main.DBStore.CLUBS, club.idx).then(function (e) {
                _this.findAll();
                deferred.resolve(e);
            }).catch(function (reason) {
                _this.logService.error("ClubService deleteClub", "error", reason);
                deferred.reject();
            });
            return deferred.promise;
        };
        ClubService.prototype.find = function (idx) {
            if (!idx) {
                this.logService.error("ClubService find", "idx was null", idx);
                return null;
            }
            var club = this.clubs.filter(function (club) {
                return club.idx == idx;
            });
            if (club && club.length > 0) {
                return club[0];
            }
            else {
                this.logService.error("ClubService find", "club could not be found", idx);
                return null;
            }
        };
        ClubService.prototype.findAll = function () {
            var _this = this;
            this.databaseService.getAll(main.DBStore.CLUBS).then(function (e) {
                _this.clubs = e;
            }).catch(function (reason) {
                _this.logService.error("ClubService findAll", "error", reason);
                _this.clubs = [];
            });
        };
        ClubService.$inject = [
            'logService',
            'databaseService',
            '$q'
        ];
        return ClubService;
    }());
    main.ClubService = ClubService;
})(main || (main = {}));
