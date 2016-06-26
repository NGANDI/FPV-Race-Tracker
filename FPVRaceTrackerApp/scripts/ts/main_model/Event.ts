/// <reference path='../main_all.ts' />

module main {
    'use strict';

    export class Event extends StoredObject {

        constructor(
            public name: string,
            public country: string,
            public address: string,
            public dateFrom: Date,
            public dateTo: Date,
            public contactEmail: string
        ) {
            super();
        }
    }
}