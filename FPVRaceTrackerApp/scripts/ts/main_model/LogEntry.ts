/// <reference path='../main_all.ts' />

module main {
    'use strict';

    export class LogEntry extends StoredObject {

        constructor(
            public date: number,
            public level: LogLevel,
            public reporter: string,
            public errorMessage: string,
            public json: string
        ) {
            super();
        }
    }
}