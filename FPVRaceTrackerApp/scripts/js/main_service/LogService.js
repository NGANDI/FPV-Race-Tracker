var main;
(function (main) {
    'use strict';
    var LogService = (function () {
        function LogService($log, $indexedDB) {
            this.$log = $log;
            this.$indexedDB = $indexedDB;
            this.log("LogService init", "LOGGING ENABLED", null);
        }
        LogService.prototype.log = function (reporter, message, data) {
            if (data) {
                this.$log.debug(reporter + LogService.SEPERATOR + message, data);
            }
            else {
                this.$log.debug(reporter + LogService.SEPERATOR + message);
            }
        };
        LogService.prototype.warn = function (reporter, message, data) {
            if (data) {
                this.$log.warn(reporter + LogService.SEPERATOR + message, data);
            }
            else {
                this.$log.warn(reporter + LogService.SEPERATOR + message);
            }
        };
        LogService.prototype.error = function (reporter, message, data) {
            if (data) {
                this.$log.error(reporter + LogService.SEPERATOR + message, data);
            }
            else {
                this.$log.error(reporter + LogService.SEPERATOR + message);
            }
            this.saveLog(main.LogLevel.ERROR, reporter, message, JSON.stringify(data));
        };
        LogService.prototype.saveLog = function (level, reporter, message, json) {
            var entry = new main.LogEntry(new Date().getTime(), level, reporter, message, json);
            this.$indexedDB.openStore(main.DBStore.LOGS, function (store) {
                store.insert(entry).catch(function (reason) {
                    console.error("could not save log", reason);
                    console.error("entry", entry);
                });
            });
        };
        LogService.SEPERATOR = ": ";
        LogService.$inject = [
            '$log',
            '$indexedDB'
        ];
        return LogService;
    }());
    main.LogService = LogService;
})(main || (main = {}));
