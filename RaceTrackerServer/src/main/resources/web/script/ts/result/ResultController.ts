'use strict';

class ResultController {

    public static $inject = [
        '$scope'
    ];

    constructor(
        private $scope: IRaceResult
    ) {
        $scope.vm = this;
        $scope.showError = false;
        $scope.showPilots = false;
        $scope.showOnlineRegistration = false;

        window.location.search.replace('?', '').split("&").forEach((param: any) => {
            var param = param.split("=");
            if (param && param.length == 2) {
                if (param[0] == "key") {
                    eventKey = param[1];
                    this.sendRequest1(path_getResult + "" + eventKey, null, function(result) {
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

    public buildPilotList(pilots: Pilot[]) {
        var classPilotsList = [];
        var allClasses = [];
        pilots.forEach((pilot) => {
            if (allClasses.every((classs) => {
                return classs.uuid != pilot.classs.uuid;
            })) {
                allClasses.push(pilot.classs);
            }
        });
        allClasses.forEach((classs) => {
            var classPilots: ClassPilots = new ClassPilots(classs, []);
            pilots.forEach((pilot) => {
                if (classs.uuid == pilot.classs.uuid) {
                    classPilots.pilots.push(pilot);
                }
            });
            classPilotsList.push(classPilots);
        });
        this.$scope.classPilotsList = classPilotsList;
    }

    public calculateTotalRaceResult(race) {
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
    }

    public roundNumberArray() {
        if (this.$scope.selectedRace && this.$scope.selectedRace.rounds.length) {
            return new Array(this.$scope.selectedRace.rounds.length);
        }
        return [];
    }

    private selectDefaultRace() {
        var competitionRaces = this.$scope.races.filter((race) => {
            return race.format == "Competition";
        });
        if (competitionRaces.length > 0) {
            this.calculateTotalRaceResult(competitionRaces[0]);
            this.selectRace(competitionRaces[0]);
        } else {
            var qualifyingRaces = this.$scope.races.filter((race) => {
                return race.format == "Qualifying";
            });
            if (qualifyingRaces.length > 0) {
                this.selectRace(qualifyingRaces[0]);
            } else {
                var trainingRaces = this.$scope.races.filter((race) => {
                    return race.format == "Training";
                });
                if (trainingRaces.length > 0) {
                    this.selectRace(trainingRaces[0]);
                }
            }
        }
    }

    private toggleHidePilots() {
        this.$scope.showPilots = !this.$scope.showPilots;
    }
    
    private selectRace(race) {
        console.log("race", race);
        if (race.format == "Competition") {
            this.calculateTotalRaceResult(race);
        }
        this.$scope.selectedRace = race;
    }

    private filterTraining(race, index, array) {
        if (race.format == "Training") {
            return true;
        }
        return false;
    }
    private filterQualifying(race, index, array) {
        if (race.format == "Qualifying") {
            return true;
        }
        return false;
    }
    private filterCompetition(race, index, array) {
        if (race.format == "Competition") {
            return true;
        }
        return false;
    }

    private sendRequest1(path, request, callback) {
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