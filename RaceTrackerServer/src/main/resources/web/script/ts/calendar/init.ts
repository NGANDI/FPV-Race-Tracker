var eventKey = "";

//var port = "";
var port = ":8080";
//var host = "cloud.fpvracetracker.com";
var host = "localhost";
//var protocol = "https";
var protocol = "http";

var path_getEvent = "onlineEvent/";


var app = angular.module('calendar', [], function($provide) {
    // Prevent Angular from sniffing for the history API
    // since it's not supported in packaged apps.
    $provide.decorator('$window', function($delegate) {
        $delegate.history = null;
        return $delegate;
    });
});
app.controller('CalendarController', CalendarController);
