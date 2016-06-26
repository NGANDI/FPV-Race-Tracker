/// <reference path="_reference.ts"/>
/// <reference path='controller/ManageScreen2Controller.ts' /> 
'use strict'

// https://github.com/angular/angular.js/issues/11932
var app = angular.module('app', [], function($provide) {
    // Prevent Angular from sniffing for the history API
    // since it's not supported in packaged apps.
    $provide.decorator('$window', function($delegate) {
        $delegate.history = null;
        return $delegate;
    });
});

app.controller('PilotController', PilotController);
app.controller('RaceController', RaceController);
app.controller('UsbController', UsbController);
app.controller('StatisticController', StatisticController);
app.controller('ConfirmationController', ConfirmationController);
app.controller('CompetitionController', CompetitionController);
app.controller('NotificationController', NotificationController);
app.controller('RaceBandController', RaceBandController);
app.controller('ClassController', ClassController);
app.controller('TTSController', TTSController);
app.controller('UserController', UserController);
app.controller('CloudController', CloudController);

app.service('DisplayService', DisplayService);
app.controller('ManageScreen2Controller', ManageScreen2Controller);
app.controller('ManageLiveScreenController', ManageLiveScreenController);

var time = "";
var LOGGING = false;

//DONT FORGET HOST, PORT and PROTOCOL IN AJAX-SERVICE !!!!
var SERIAL_ENABLED = true; // switch flag to true to use device, TRUE = production
var changelogString = "";

document
    .addEventListener(
    "DOMContentLoaded",
    function() {
        //					document.getElementById("welcomeButton").addEventListener(
        //							"click", hideWelcome, false);
        
        changelogString += "ANNOUNCEMENT: fpv race tracker 1.0\n";
        changelogString += "thanks to the community, supporters and advisors, we are certain to create the perfect solution for everybody.\n";
        changelogString += "visit our facebook page and stay tuned for a few more weeks to the release of version 1.0: www.facebook.com/FPVRaceTracker\n";
        changelogString += "\t* we promise major improvements in the way the app looks and feels\n";
        changelogString += "\t* different race modes to support all possible ways to run races and events\n";
        changelogString += "\t* full internationalization for different languages\n";
        changelogString += "\t* new ways to manage events, making it as easy as possible\n";
        changelogString += "\t* and many more new features to count on\n";
        
        changelogString += "\n\n23.May 2016\n";
        changelogString += "Version 0.3.9.4\n";
        changelogString += "\t* added overtime for laps.\n";
        changelogString += "\t* added download qualification result.\n";
        
        changelogString += "\n\n24.Mar 2016\n";
        changelogString += "Version 0.3.9.3\n";
        changelogString += "\t* fixed a bug where Pilot 0 appeared in training.\n";
        changelogString += "\t* changed language in text-to-speech service.\n";
        changelogString += "\t* race view will always start with round 1 (before it was always the last one).\n";

        changelogString += "\n22.Jan 2016\n";
        changelogString += "Version 0.3.9.2\n";
        changelogString += "\t* added manual timing.\n";
        changelogString += "\t  pressing the buttons 1-9 simulates a pilot passing a gate.\n";
        changelogString += "\t  no additional hardware is required.\n";

        changelogString += "\n5.Jan 2016\n";
        changelogString += "Version 0.3.8.0\n";
        changelogString += "\t* added online public/private race calendar for events (see 'events' -> 'online' tab) \n";
        changelogString += "\t* added online event view for events (see 'events' -> 'online' tab) \n";

        changelogString += "\n10.Dez 2015\n";
        changelogString += "Version 0.3.7.0\n";
        changelogString += "\t* added online results for events (see 'events' -> 'online' tab) \n";

        changelogString += "\n13.Nov 2015\n";
        changelogString += "Version 0.3.6.0\n";
        changelogString += "\t* added online registration for events (see 'events' -> 'online' tab) \n";

        changelogString += "\n29.Okt 2015\n";
        changelogString += "Version 0.3.5.0\n";
        changelogString += "\t* added single-pilot live view \n";
        changelogString += "\t* fixed a bug where multiple created race-bands disappeared after restart \n";
        changelogString += "\t* fixed a bug which messed up classes and racebands after saving a pilot \n";
        changelogString += "\t* fixed a bug which auto-assigned one pilot multiple times to a training heat \n";

        changelogString += "\n20.Okt 2015\n";
        changelogString += "Version 0.3.4.0\n";
        changelogString += "\t* text to speech, when passing a gate, does not include pilot number anymore \n";
        changelogString += "\t* training mode is now free of class restrictions, any pilot can participate in a training heat\n";
        changelogString += "\t* in training heats, unknown pilots are tracked as well (named via transponder id)\n";
        changelogString += "\t* pilots can now have duplicate transponder ids in the same event, but not in the same heat\n";

        changelogString += "\n20.Okt 2015\n";
        changelogString += "Version 0.3.3.1\n";
        changelogString += "\t* text to speech stops now 5 seconds after heat finishes \n";
        changelogString += "\t* text to speech is now always english\n";

        changelogString += "\n18.Okt 2015\n";
        changelogString += "Version 0.3.3.0\n";
        changelogString += "\t* added visible countdown to 'start heat' \n";
        changelogString += "\t* simulate race button is visible heat menu \n";
        changelogString += "\t  it can be used to test the software without hardware\n";


        changelogString += "\n12.Okt 2015\n";
        changelogString += "Version 0.3.2.0\n";
        changelogString += "\t* added beta live-screen feature in 'Config' -> 'Streaming' \n";
        changelogString += "\t  more options will be contained in next releases.\n";

        changelogString += "\n3.Okt 2015\n";
        changelogString += "Version 0.3.1.0\n";
        changelogString += "\t* enabled transfer account feature in 'Config' -> 'Cloud' \n";

        changelogString += "\n23.Sept 2015\n";
        changelogString += "Version 0.3.0.0\n";

        changelogString += "\n* cloud services\n";
        changelogString += "\t* transfer account feature coming in the next few days \n";
        changelogString += "\t* added 'login' to verify transfer account requests \n";
        //            changelogString += "\t* transfer account and all local data to different computer \n";
            
        changelogString += "\n6.Sept 2015\n";
        changelogString += "Version 0.2.2.0\n";

        changelogString += "\n* added USA for pilots\n";

        changelogString += "\n3.Sep 2015\n";
        changelogString += "Version 0.2.1.0\n";

        changelogString += "\n* events\n";
        changelogString += "\t* create events with location and date\n";
        changelogString += "\t* assign classes to events\n";
        changelogString += "\t* define amount of rounds and race type (time or laps) per class\n";
        changelogString += "\t* add pilot with class to event\n";
        changelogString += "\t* filter pilot names for easy use\n";

        changelogString += "\n* races\n";
        changelogString += "\t* start unlimited trainings races\n";
        changelogString += "\t* start qualification races over several rounds\n";
        changelogString += "\t* automatically assign qualification race pilots to heats\n";
        changelogString += "\t* view total qualification result\n";
        changelogString += "\t* automatically assign competition race pilots to heats based on qualification result\n";
        changelogString += "\t* manually move pilots in heats\n";
        changelogString += "\t* automatically assign pilots in advanced rounds based on their previous rank\n";
        changelogString += "\t* define lap distance and view pilot speed\n";
        changelogString += "\t* define heat start time for timetable\n";
        changelogString += "\t* print timetable\n";
        changelogString += "\t* preconfigure and save all rounds and heats\n";
        changelogString += "\t* restart and close heats\n";
        changelogString += "\t* add time penalty to each lap or disqualify pilot\n";
        changelogString += "\t* download each race result\n";
        changelogString += "\t* automated voice announcements for many events\n";

        changelogString += "\n* pilots\n";
        changelogString += "\t* create and manage pilots\n";
        changelogString += "\t* save alias, country, email, transponder id, global pilot number and more\n";
        changelogString += "\t* create and assign pilot to race in one click\n";
        changelogString += "\t* enter or scan transponder id for pilots\n";
        changelogString += "\t* download list of all pilots\n";
        changelogString += "\t* filter pilots for easy managment\n";

        changelogString += "\n* statistics\n";
        changelogString += "\t* review all previous race results\n";
        changelogString += "\t* view every single lap time\n";
        changelogString += "\t* delete whole events\n";
        changelogString += "\t* delete single heats\n";
        changelogString += "\t* download result\n";

        changelogString += "\n* config\n";
        changelogString += "\t* easy connect to i-laps device\n";
        changelogString += "\t* manage available race bands\n";
        changelogString += "\t* manage available classes\n";
        changelogString += "\t* enable or disable voice announcements\n";
        changelogString += "\t* open screen 2 to present results and timetable\n";

        document.getElementById("changelog").innerHTML = changelogString;
        
        // ConnectionStateService.init();
        DatabaseService
            .init(function() {
                DatabaseService.replaceContent(DatabaseService.store_liveResults, [], function(e) { });
                SerialConnectionService.init();
                MenuService.init();
                SubMenuService.init();
                UserService.init(function() {
                    RaceBandService.init(function() {
                        ClassService.init(function() {
                            PilotService.init(function() {
                                CompetitionService.init(function() {
                                    RaceService.init(function() {
                                        CloudSyncService.init();
                                        WindowConfigService.resetLiveView();
                                        ManualTimingService.init();
                                    });
                                })
                            })
                        })
                    })
                });
                SoundService.init();
                if (!SERIAL_ENABLED) {
                    NotificationService
                        .notify("SERIAL DISABLED, SERIAL DISABLED, SERIAL DISABLED, SERIAL DISABLED, SERIAL !!!! NOT PRODUCTION READY");
                }

            });
    }, false);

function hideWelcome() {
    document.getElementById("welcome").classList.add("removed");
}
function log(text, data) {
    if (LOGGING) {
        console.log(text, data);
    }
}