/// <reference path='../main_all.ts' />

module main {
    'use strict';

    export class Language extends StoredObject {

        constructor(
            public name: string,
            public json: any,
            public editable: boolean
        ) {
            super();
        }
    }
}