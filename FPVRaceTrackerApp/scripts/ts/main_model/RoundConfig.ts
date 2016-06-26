/// <reference path='../main_all.ts' />

module main {
    'use strict';

    export class RoundConfig extends StoredObject {

        constructor(
            public amountOfPilots: number,
            public amountOfHeats: number,
            public roundMode: string,
            public timePerHeat: number,
            public overtime: number,
            public individualStart: boolean,
            public blockingTime: number,
            public heatStartCountdown: number,
            public roundStartDate: Date
        ) {
            super();
        }
    }
}