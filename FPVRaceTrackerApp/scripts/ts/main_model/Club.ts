/// <reference path='../main_all.ts' />

module main {
    'use strict';

    export class Club extends StoredObject {

        constructor(
            public name: string,
            public country: string
        ) {
            super();
        }
    }
}