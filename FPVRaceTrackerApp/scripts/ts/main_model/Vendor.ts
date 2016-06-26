/// <reference path='../main_all.ts' />

module main {
    'use strict';

    export class Vendor extends StoredObject {

        constructor(
            public name: string
        ) {
            super();
        }
    }
}