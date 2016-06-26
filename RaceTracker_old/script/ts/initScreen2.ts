/// <reference path='_reference.ts' />
/// <reference path='_all.ts' />
'use strict';

var appScreen2 = angular.module('appScreen2', ['indexedDB'])
    .config(function($provide) {
        // Prevent Angular from sniffing for the history API
        // since it's not supported in packaged apps.
        $provide.decorator('$window', function($delegate) {
            $delegate.history = null;
            return $delegate;
        });
    })
    .config(function($indexedDBProvider) {
        $indexedDBProvider
            .connection('FPV_RACE_TRACKER')
            .upgradeDatabase(1, function(event, db: IDBDatabase, tx) {
                //                var objStore = db.createObjectStore('pilots');
                //                var objStore = db.createObjectStore('competitions');
                //                var objStore = db.createObjectStore('races');
                //                var objStore = db.createObjectStore('racebands');
                //                var objStore = db.createObjectStore('classes');
            })
            .upgradeDatabase(18, function(event, db: IDBDatabase, tx) {
            })
    })
    .controller('Screen2Controller', Screen2Controller);