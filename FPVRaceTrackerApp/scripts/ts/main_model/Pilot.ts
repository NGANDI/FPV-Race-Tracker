/// <reference path='../main_all.ts' />

module main {
    'use strict';

    export class Pilot extends StoredObject {

        constructor(
            public firstName: string,
            public lastName: string,
            public alias: string,
            public country: string,
            public clubIdx: number,
            public email: string,
            public registrationNumber: string,
            public transponder: Transponder
        ) {
            super();
        }
    }
}