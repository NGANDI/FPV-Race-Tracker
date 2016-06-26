/// <reference path='../main_all.ts' />

module main {
    'use strict';

    export class MainConfig extends StoredObject {

        constructor(
            public languageName: LanguageName,
            public defaultLocation: string
        ) {
            super();
        }
    }
}