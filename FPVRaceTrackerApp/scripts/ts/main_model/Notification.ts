/// <reference path='../main_all.ts' />

module main {
    'use strict';

    export class Notification extends StoredObject {

        public created: number;
        public fade: boolean;

        constructor(
            public text: string,
            public type: NotificationType,
            public displayTimeInMS: number
        ) {
            super();
            this.created = new Date().getTime();
            this.fade = false;
        }
    }
}
