var main;
(function (main) {
    'use strict';
    var EventService = (function () {
        function EventService(logService, $q, databaseService) {
            this.logService = logService;
            this.$q = $q;
            this.databaseService = databaseService;
            this.events = [];
            this.findAll();
        }
        EventService.prototype.findAll = function () {
            var _this = this;
            this.databaseService.getAll(main.DBStore.EVENTS).then(function (e) {
                _this.events = e;
            }).catch(function (reason) {
                _this.logService.error("get events list", reason, null);
                _this.events = [];
            });
        };
        EventService.prototype.deleteEvent = function (event) {
            var _this = this;
            var deferred = this.$q.defer();
            if (!event) {
                deferred.reject();
                this.logService.warn("EventService deleteEvent", "event was null", null);
            }
            this.databaseService.delete(main.DBStore.EVENTS, event.idx).then(function (e) {
                _this.findAll();
                deferred.resolve(e);
            }).catch(function (reason) {
                _this.logService.error("EventService deleteEvent", "error", reason);
                deferred.reject();
            });
            return deferred.promise;
        };
        EventService.prototype.save = function (event) {
            var _this = this;
            var deferred = this.$q.defer();
            if (!event) {
                this.logService.warn("EventService saveEvent", "event was null", null);
                deferred.reject();
            }
            this.databaseService.save(main.DBStore.EVENTS, event).then(function (e) {
                _this.findAll();
                deferred.resolve(e);
            }).catch(function (reason) {
                _this.logService.error("new event db error", reason, event);
                deferred.reject();
            });
            return deferred.promise;
        };
        EventService.$inject = [
            'logService',
            '$q',
            'databaseService'
        ];
        return EventService;
    }());
    main.EventService = EventService;
})(main || (main = {}));
