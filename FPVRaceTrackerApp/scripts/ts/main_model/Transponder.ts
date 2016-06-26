/// <reference path='../main_all.ts' />

module main {
    'use strict';

    export class Transponder extends StoredObject {

        constructor(
            public vendorIdx: number,
            public identifier: string
        ) {
            super();
        }
    }
}