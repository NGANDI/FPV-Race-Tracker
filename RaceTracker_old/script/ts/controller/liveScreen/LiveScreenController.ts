/// <reference path="../../_all_liveScreen.ts"/>
'use strict';

class LiveScreenController {

    private timerStart: number;
    private newPilot: boolean;

    public static $inject = [
        '$scope',
        '$indexedDB',
        '$interval',
        '$timeout'
    ];

    constructor(
        private $scope: ILiveScreen,
        private $indexedDB: any,
        private $interval: any,
        private $timeout: any
    ) {
        $scope.vm = this;
        $scope.showLapTime = false;

        $scope.$watch(function() {
            return $scope.singleResult;
        }, function(newVal: RaceResultEntry, oldVal: RaceResultEntry) {
            if (!newVal || !newVal.lastPassing) {
                return;
            }
            if (!$scope.vm.newPilot) {
                $scope.showLapTime = true;
                $timeout(() => { $scope.showLapTime = false; }, 2000, 0);
            }
            else {
                $scope.vm.newPilot = false;
            }
            $interval.cancel($scope.lapTimerInterval);
            $scope.lapTimerValue = 0;
            $scope.vm.timerStart = newVal.lastPassing;
            $scope.lapTimerInterval = $interval(() => {
                $scope.lapTimerValue = new Date().getTime() - $scope.vm.timerStart;
            }, 100, 0);
        }, true);

        $interval(() => {
            $indexedDB.openStore('liveResults', function(store) {
                store.getAll().then((raceResults: RaceResultEntry[]) => {
                    var newValuesFound = false;
                    if (raceResults && $scope.raceResults && raceResults.length == $scope.raceResults.length) {
                        for (var i = 0; i < raceResults.length; i++) {
                            if (raceResults[i].pilotUUID != $scope.raceResults[i].pilotUUID) {
                                newValuesFound = true;
                                break;
                            }
                            if (raceResults[i].amountOfLaps != $scope.raceResults[i].amountOfLaps) {
                                newValuesFound = true;
                                break;
                            }
                            if (raceResults[i].totalTime != $scope.raceResults[i].totalTime) {
                                newValuesFound = true;
                                break;
                            }
                        }
                    } else if (raceResults) {
                        newValuesFound = true;
                    }
                    if (newValuesFound) {
                        $scope.raceResults = raceResults;
                    }
                    if ($scope.windowConfig && $scope.windowConfig.currentLivePilotUUID) {
                        for (var idx in raceResults) {
                            if (raceResults[idx].pilotUUID == $scope.windowConfig.currentLivePilotUUID) {
                                var newResult = new RaceResultEntry(raceResults[idx]);
                                if (!newResult.customEquals($scope.singleResult)) {
                                    if (!$scope.singleResult || $scope.singleResult.pilotUUID != newResult.pilotUUID) {
                                        console.log("new pilot");
                                        $scope.vm.newPilot = true;
                                    }
                                    $scope.singleResult = newResult;
                                }
                            }
                        }
                    }
                });
            })
        }, 250, 0);


        $interval(() => {
            $indexedDB.openStore('windowConfig', function(store) {
                store.getAll().then((windowConfig: WindowConfig) => {
                    $scope.windowConfig = windowConfig[0];
                    if (windowConfig[0] && windowConfig[0].currentCompetitionUUID) {
                        if ($scope.currentRace && $scope.currentRace.competitionUUID == $scope.windowConfig.currentCompetitionUUID &&
                            $scope.currentHeat && $scope.currentHeat.uuid == $scope.windowConfig.currentHeatUUID) {
                            return;
                        }
                        $indexedDB.openStore('races', function(store) {
                            store.findWhere(
                                store.query()
                                    .$index("competitionUUID")
                                    .$eq(windowConfig[0].currentCompetitionUUID))
                                .then((races) => {
                                    if ($scope.currentRace && $scope.currentRound && $scope.currentHeat && $scope.currentHeat.uuid == $scope.windowConfig.currentHeatUUID) {
                                        return;
                                    }
                                    for (var idx0 in races) {
                                        for (var idx1 in races[idx0].rounds) {
                                            for (var idx2 in races[idx0].rounds[idx1].heats) {
                                                if (races[idx0].rounds[idx1].heats[idx2].uuid == $scope.windowConfig.currentHeatUUID) {
                                                    if (!$scope.currentRace || $scope.currentRace.uuid != races[idx0].uuid) {
                                                        $scope.currentRace = races[idx0];
                                                    }
                                                    if (!$scope.currentRound || $scope.currentRound.uuid != races[idx0].rounds[idx1].uuid) {
                                                        $scope.currentRound = races[idx0].rounds[idx1];
                                                    }

                                                    if (!$scope.currentHeat || $scope.currentHeat.uuid != races[idx0].rounds[idx1].heats[idx2][idx0].uuid) {
                                                        $scope.currentHeat = races[idx0].rounds[idx1].heats[idx2];
                                                    }
                                                }
                                            }
                                        }
                                    }
                                });
                        })
                    }
                });
            })
        }, 1000, 0);
    }
}