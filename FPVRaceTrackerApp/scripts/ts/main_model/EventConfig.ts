/// <reference path='../main_all.ts' />

module main {
    'use strict';

    export class EventConfig extends StoredObject {

        constructor(
            public raceMode: string,
            public heatWinnerMode: string, //TODO: enum ?
            public raceWinnerMode: string, //TODO: enum ?
            public teamWinnerMode: string, //TODO: enum ?
            public amountOfRounds: number, //TODO: enum ?
            public points: number[]
        ) {
            super();
        }
    }
}