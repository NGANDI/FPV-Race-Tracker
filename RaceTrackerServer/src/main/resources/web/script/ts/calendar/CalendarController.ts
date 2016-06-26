'use strict';

class CalendarController {

    public static $inject = [
        '$scope'
    ];

    constructor(
        private $scope: ICalendar
    ) {
        $scope.vm = this;
        $scope.now = new Date();
        
        window.location.search.replace('?', '').split("&").forEach((param: any) => {
            var param = param.split("=");
            if (param && param.length == 2) {
                if (param[0] == "key") {
                    eventKey = param[1];
                    this.sendRequest2(path_getEvent + "" + eventKey, null, function(result) {
                        if (!result || result.onlineEventGroups == null || result.onlineEventGroups.length < 1) {
                        }
                        else {
                            $scope.onlineEventGroups = result.onlineEventGroups;
                            console.log("scope", $scope);
                        }
                        angular.element(document.getElementById('calendar')).scope().$apply();
                    });
                }
            }
        });
    }

    private showRegistration(event: any) {
        console.log("ev", event);
        var url = protocol + "://" + host + "" + port + "/web/onlineRegistration.html?key=" + event.onlineRegistrationKey;
        try {
            window.top.fpvracetrackerForward(url);
        } catch (ex) {
            console.log("could not call parrent function window.top.fpvracetrackerForward(url);");
        }
    }


    private openEvent(event: any) {
        var url = protocol + "://" + host + "" + port + "/web/onlineEvent.html?showPilots=true&resultKey=" + event.onlineResultKey +
            "&place=" + event.location + "&registrationKey=" + event.onlineRegistrationKey;
        try {
            window.top.fpvracetrackerForward(url);
        } catch (ex) {
            console.log("could not call parrent function window.top.fpvracetrackerForward(url);");
        }
    }

    private sendRequest2(path, request, callback) {
        var http = new XMLHttpRequest();
        var url = protocol + "://" + host + "" + port + "/" + path;
        var body = JSON.stringify(request);

        if (!request) {
            http.open("GET", url, true);
        }
        else {
            http.open("POST", url, true);
        }
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        //        http.setRequestHeader("auth", request.auth);
        http.onreadystatechange = function() {
            if (http.readyState == 4 && http.status == 200) {
                callback(JSON.parse(http.responseText));
            } else if (http.readyState == 4
                && (http.status == 0 || http.status > 500)) {
                console.log("error: ", http);
                callback({
                    status: "ERROR"
                });
            }
        }
        http.send(body);
    }
}