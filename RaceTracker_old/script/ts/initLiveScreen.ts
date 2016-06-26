/// <reference path='_reference.ts' />
/// <reference path='_all_livescreen.ts' />
'use strict';

var appScreenLive = angular.module('appScreenLive', ['indexedDB'])
    .config(function($provide) {
        // Prevent Angular from sniffing for the history API
        // since it's not supported in packaged apps.
        $provide.decorator('$window', function($delegate) {
            $delegate.history = null;
            return $delegate;
        });
    })
    .config(function($indexedDBProvider) {
        $indexedDBProvider.connection('FPV_RACE_TRACKER')
            .upgradeDatabase(18, function(event, db: IDBDatabase, tx) {
            });
    })
    .controller('LiveScreenController', LiveScreenController);