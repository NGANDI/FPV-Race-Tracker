var main;
(function (main) {
    'use strict';
    var PilotService = (function () {
        function PilotService(logService, $q, databaseService, clubService) {
            this.logService = logService;
            this.$q = $q;
            this.databaseService = databaseService;
            this.clubService = clubService;
            this.pilots = [];
            this.findAll();
            this.watchedPilotToEdit = null;
        }
        PilotService.prototype.getClub = function (clubIdx) {
            return this.clubService.find(clubIdx);
        };
        PilotService.prototype.findAll = function () {
            var _this = this;
            this.databaseService.getAll(main.DBStore.PILOTS).then(function (e) {
                _this.pilots = e;
            }).catch(function (reason) {
                _this.logService.error("get pilots list", reason, null);
                _this.pilots = [];
            });
        };
        PilotService.prototype.deletePilot = function (pilot) {
            var _this = this;
            var deferred = this.$q.defer();
            if (!pilot) {
                deferred.reject();
                this.logService.warn("PilotService deletePilot", "pilot was null", null);
            }
            this.databaseService.delete(main.DBStore.PILOTS, pilot.idx).then(function (e) {
                _this.findAll();
                deferred.resolve(e);
            }).catch(function (reason) {
                _this.logService.error("PilotService deletePilot", "error", reason);
                deferred.reject();
            });
            return deferred.promise;
        };
        PilotService.prototype.save = function (pilot) {
            var _this = this;
            var deferred = this.$q.defer();
            if (!pilot) {
                this.logService.warn("PilotService savePilot", "pilot was null", null);
                deferred.reject();
            }
            this.databaseService.save(main.DBStore.PILOTS, pilot).then(function (e) {
                _this.findAll();
                deferred.resolve(e);
            }).catch(function (reason) {
                _this.logService.error("new pilot db error", reason, pilot);
                deferred.reject();
            });
            return deferred.promise;
        };
        PilotService.$inject = [
            'logService',
            '$q',
            'databaseService',
            'clubService'
        ];
        return PilotService;
    }());
    main.PilotService = PilotService;
})(main || (main = {}));
