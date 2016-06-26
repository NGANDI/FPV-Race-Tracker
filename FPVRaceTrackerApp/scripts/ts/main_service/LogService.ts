/// <reference path='../main_all.ts' />

module main {
    'use strict';

    export class LogService {

        private static SEPERATOR = ": ";

        public static $inject = [
            '$log',
            '$indexedDB'
        ];

        constructor(
            private $log: any,
            private $indexedDB: any
        ) {
            this.log("LogService init", "LOGGING ENABLED", null);
        }

        public log(reporter: string, message: string, data: any) {
            if (data) {
                this.$log.debug(reporter + LogService.SEPERATOR + message, data);
            }
            else {
                this.$log.debug(reporter + LogService.SEPERATOR + message);
            }
        }

        public warn(reporter: string, message: string, data: any) {
            if (data) {
                this.$log.warn(reporter + LogService.SEPERATOR + message, data);
            }
            else {
                this.$log.warn(reporter + LogService.SEPERATOR + message);
            }
        }
        
        public error(reporter: string, message: string, data: any) {
            if (data) {
                this.$log.error(reporter + LogService.SEPERATOR + message, data);
            }
            else {
                this.$log.error(reporter + LogService.SEPERATOR + message);
            }
            this.saveLog(LogLevel.ERROR, reporter, message, JSON.stringify(data));
        }

        private saveLog(level: LogLevel, reporter: string, message: string, json: string) {
            var entry = new LogEntry(new Date().getTime(), level, reporter, message, json);
            this.$indexedDB.openStore(DBStore.LOGS, (store) => {
                store.insert(entry).catch((reason) => {
                    console.error("could not save log", reason);
                    console.error("entry", entry);
                });
            });
        }
    }
}