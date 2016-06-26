/// <reference path='../../_all.ts' />
'use strict';

class Screen2Controller {

    public static $inject = [
        '$scope',
        '$indexedDB',
        '$interval'
    ];

    // dependencies are injected via AngularJS $injector
    // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
    constructor(
        private $scope: IResultsScreen,
        private $indexedDB: any,
        private $interval: any
        ) {

        $scope.vm = this;
        $interval(() => {
            $indexedDB.openStore('windowConfig', function(store) {
                store.getAll().then((windowConfig: WindowConfig) => {
                    $scope.windowConfig = windowConfig;
                    if (windowConfig[0] && windowConfig[0].currentCompetitionUUID) {
                        $indexedDB.openStore('races', function(store) {
                            store.findWhere(
                                store.query()
                                    .$index("competitionUUID")
                                    .$eq(windowConfig[0].currentCompetitionUUID))
                                .then((races) => {
                                    $scope.races = races ? races : [];
                                });
                        })
                    }
                });
            })
        }, 1000, 0);
        $scope.heatResults = [];
        $scope.upcomingHeats = [];
        $scope.$watch('races', () => this.racesChanged(), true);
    }

    racesChanged() {
        this.$scope.heatResults.length = 0;
        this.$scope.upcomingHeats.length = 0;
        var this = this;
        if (this.$scope.races) {
            this.$scope.races.forEach(function(race) {
                race.rounds.forEach(function(round) {
                    round.heats.forEach(function(heat) {
                        if (heat.heatResult) {
                            if (heat.heatResult.results && heat.heatResult.results.length > 0) {
                                this.$scope.heatResults.push(new HeatResultViewObject({
                                    heatNumber: heat.heatNumber,
                                    roundNumber: round.roundNumber,
                                    roundDescription: round.description,
                                    roundType: race.type,
                                    raceFormat: race.format,
                                    raceClass: race.classs.name,
                                    raceResultEntries: heat.heatResult.results,
                                    heatTimestamp: heat.heatResult.timestamp
                                }));
                            };
                        } else {
                            this.$scope.upcomingHeats.push(new UpcomingHeatViewObject({
                                heatNumber: heat.heatNumber,
                                roundNumber: round.roundNumber,
                                roundDescription: round.description,
                                roundType: race.type,
                                raceFormat: race.format,
                                raceClass: race.classs.name,
                                pilots: heat.pilots,
                                heatTimestamp: heat.startTime
                            }));
                        }
                    });
                });
            });
        }
    }
}