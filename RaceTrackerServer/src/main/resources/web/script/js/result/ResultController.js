'use strict';
var ResultController = (function () {
    function ResultController($scope) {
        var _this = this;
        this.$scope = $scope;
        $scope.vm = this;
        $scope.showError = false;
        $scope.showPilots = false;
        $scope.showOnlineRegistration = false;
        window.location.search.replace('?', '').split("&").forEach(function (param) {
            var param = param.split("=");
            if (param && param.length == 2) {
                if (param[0] == "key") {
                    eventKey = param[1];
                    _this.sendRequest1(path_getResult + "" + eventKey, null, function (result) {
                        if (!result || result.competition == null || !result.races || result.races.length < 1) {
                            $scope.showError = true;
                        }
                        else {
                            $scope.races = result.races;
                            $scope.competition = result.competition;
                            $scope.vm.selectDefaultRace();
                            $scope.vm.buildPilotList(result.competition.pilots);
                            console.log("scope", $scope);
                        }
                        angular.element(document.getElementById('results')).scope().$apply();
                    });
                }
                else if (param[0] == "showPilots") {
                    $scope.showPilots = (param[1] == "true" ? true : false);
                }
            }
        });
    }
    ResultController.prototype.buildPilotList = function (pilots) {
        var classPilotsList = [];
        var allClasses = [];
        pilots.forEach(function (pilot) {
            if (allClasses.every(function (classs) {
                return classs.uuid != pilot.classs.uuid;
            })) {
                allClasses.push(pilot.classs);
            }
        });
        allClasses.forEach(function (classs) {
            var classPilots = new ClassPilots(classs, []);
            pilots.forEach(function (pilot) {
                if (classs.uuid == pilot.classs.uuid) {
                    classPilots.pilots.push(pilot);
                }
            });
            classPilotsList.push(classPilots);
        });
        this.$scope.classPilotsList = classPilotsList;
    };
    ResultController.prototype.calculateTotalRaceResult = function (race) {
        //        for (var lapsNumber = race.rounds.length; lapsNumber > 0; lapsNumber--) {
        //            var filteredResults = raceResult.filter(function(result: RaceResultEntry) {
        //                return result.amountOfLaps == lapsNumber && !result.disqualified;
        //            });
        //            filteredResults.sort(function(a: RaceResultEntry, b: RaceResultEntry) {
        //                return +a.totalTimeComputed() - +b.totalTimeComputed();
        //            });
        //            for (var rIdx in filteredResults) {
        //                filteredResults[rIdx].rank = rank;
        //                rank++;
        //            }
        //        }
    };
    ResultController.prototype.roundNumberArray = function () {
        if (this.$scope.selectedRace && this.$scope.selectedRace.rounds.length) {
            return new Array(this.$scope.selectedRace.rounds.length);
        }
        return [];
    };
    ResultController.prototype.selectDefaultRace = function () {
        var competitionRaces = this.$scope.races.filter(function (race) {
            return race.format == "Competition";
        });
        if (competitionRaces.length > 0) {
            this.calculateTotalRaceResult(competitionRaces[0]);
            this.selectRace(competitionRaces[0]);
        }
        else {
            var qualifyingRaces = this.$scope.races.filter(function (race) {
                return race.format == "Qualifying";
            });
            if (qualifyingRaces.length > 0) {
                this.selectRace(qualifyingRaces[0]);
            }
            else {
                var trainingRaces = this.$scope.races.filter(function (race) {
                    return race.format == "Training";
                });
                if (trainingRaces.length > 0) {
                    this.selectRace(trainingRaces[0]);
                }
            }
        }
    };
    ResultController.prototype.toggleHidePilots = function () {
        this.$scope.showPilots = !this.$scope.showPilots;
    };
    ResultController.prototype.selectRace = function (race) {
        console.log("race", race);
        if (race.format == "Competition") {
            this.calculateTotalRaceResult(race);
        }
        this.$scope.selectedRace = race;
    };
    ResultController.prototype.filterTraining = function (race, index, array) {
        if (race.format == "Training") {
            return true;
        }
        return false;
    };
    ResultController.prototype.filterQualifying = function (race, index, array) {
        if (race.format == "Qualifying") {
            return true;
        }
        return false;
    };
    ResultController.prototype.filterCompetition = function (race, index, array) {
        if (race.format == "Competition") {
            return true;
        }
        return false;
    };
    ResultController.prototype.sendRequest1 = function (path, request, callback) {
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
        http.onreadystatechange = function () {
            if (http.readyState == 4 && http.status == 200) {
                callback(JSON.parse(http.responseText));
            }
            else if (http.readyState == 4
                && (http.status == 0 || http.status > 500)) {
                console.log("error: ", http);
                callback({
                    status: "ERROR"
                });
            }
        };
        http.send(body);
    };
    ResultController.$inject = [
        '$scope'
    ];
    return ResultController;
}());
