/// <reference path="../../_reference.ts"/>
var BaseSyncRequest = (function () {
    function BaseSyncRequest(user) {
        this.user = user;
    }
    return BaseSyncRequest;
}());
/// <reference path="../_reference.ts"/>
'use strict';
var ManageScreen2Controller = (function () {
    function ManageScreen2Controller($scope, displayService) {
        var _this = this;
        this.$scope = $scope;
        this.displayService = displayService;
        $scope.screens = [];
        $scope.vm = this;
        $scope.$on('screens:updated', function (event, data) {
            _this.updateScreens(event, data);
        });
    }
    ManageScreen2Controller.prototype.updateScreens = function (event, data) {
        this.$scope.screens = data;
        angular.element(document.getElementById('screen2')).scope().$apply();
    };
    ManageScreen2Controller.prototype.showScreen2 = function (screen) {
        this.displayService.openScreen(screen.workArea.left, screen.workArea.top, true, DisplayService.SCREEN2_WINDOW_ID_PREFIX);
    };
    ManageScreen2Controller.$inject = [
        '$scope',
        'DisplayService'
    ];
    return ManageScreen2Controller;
}());
/// <reference path="../_all.ts"/>
/// <reference path='../../_all.ts' />
'use strict';
var Screen2Controller = (function () {
    // dependencies are injected via AngularJS $injector
    // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
    function Screen2Controller($scope, $indexedDB, $interval) {
        var _this = this;
        this.$scope = $scope;
        this.$indexedDB = $indexedDB;
        this.$interval = $interval;
        $scope.vm = this;
        $interval(function () {
            $indexedDB.openStore('windowConfig', function (store) {
                store.getAll().then(function (windowConfig) {
                    $scope.windowConfig = windowConfig;
                    if (windowConfig[0] && windowConfig[0].currentCompetitionUUID) {
                        $indexedDB.openStore('races', function (store) {
                            store.findWhere(store.query()
                                .$index("competitionUUID")
                                .$eq(windowConfig[0].currentCompetitionUUID))
                                .then(function (races) {
                                $scope.races = races ? races : [];
                            });
                        });
                    }
                });
            });
        }, 1000, 0);
        $scope.heatResults = [];
        $scope.upcomingHeats = [];
        $scope.$watch('races', function () { return _this.racesChanged(); }, true);
    }
    Screen2Controller.prototype.racesChanged = function () {
        this.$scope.heatResults.length = 0;
        this.$scope.upcomingHeats.length = 0;
        var ;
        this = this;
        if (this.$scope.races) {
            this.$scope.races.forEach(function (race) {
                race.rounds.forEach(function (round) {
                    round.heats.forEach(function (heat) {
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
                            }
                            ;
                        }
                        else {
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
    };
    Screen2Controller.$inject = [
        '$scope',
        '$indexedDB',
        '$interval'
    ];
    return Screen2Controller;
}());
/// <reference path='controller/ManageScreen2Controller.ts' /> 
/// <reference path='definition/jquery.d.ts' />
/// <reference path='definition/angular.d.ts' />
/// <reference path='definition/custom.d.ts' />
/// <reference path='interfaces/IResultScreen.ts' />
/// <reference path='controller/screen2/Screen2Controller.ts' />
/// <reference path='initScreen2.ts' /> 
/// <reference path='_reference.ts' />
/// <reference path='_all.ts' />
'use strict';
var appScreen2 = angular.module('appScreen2', ['indexedDB'])
    .config(function ($provide) {
    // Prevent Angular from sniffing for the history API
    // since it's not supported in packaged apps.
    $provide.decorator('$window', function ($delegate) {
        $delegate.history = null;
        return $delegate;
    });
})
    .config(function ($indexedDBProvider) {
    $indexedDBProvider
        .connection('FPV_RACE_TRACKER')
        .upgradeDatabase(1, function (event, db, tx) {
        //                var objStore = db.createObjectStore('pilots');
        //                var objStore = db.createObjectStore('competitions');
        //                var objStore = db.createObjectStore('races');
        //                var objStore = db.createObjectStore('racebands');
        //                var objStore = db.createObjectStore('classes');
    })
        .upgradeDatabase(18, function (event, db, tx) {
    });
})
    .controller('Screen2Controller', Screen2Controller);
/// <reference path="../../_all_liveScreen.ts"/>
'use strict';
var LiveScreenController = (function () {
    function LiveScreenController($scope, $indexedDB, $interval, $timeout) {
        this.$scope = $scope;
        this.$indexedDB = $indexedDB;
        this.$interval = $interval;
        this.$timeout = $timeout;
        $scope.vm = this;
        $scope.showLapTime = false;
        $scope.$watch(function () {
            return $scope.singleResult;
        }, function (newVal, oldVal) {
            if (!newVal || !newVal.lastPassing) {
                return;
            }
            if (!$scope.vm.newPilot) {
                $scope.showLapTime = true;
                $timeout(function () { $scope.showLapTime = false; }, 2000, 0);
            }
            else {
                $scope.vm.newPilot = false;
            }
            $interval.cancel($scope.lapTimerInterval);
            $scope.lapTimerValue = 0;
            $scope.vm.timerStart = newVal.lastPassing;
            $scope.lapTimerInterval = $interval(function () {
                $scope.lapTimerValue = new Date().getTime() - $scope.vm.timerStart;
            }, 100, 0);
        }, true);
        $interval(function () {
            $indexedDB.openStore('liveResults', function (store) {
                store.getAll().then(function (raceResults) {
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
                    }
                    else if (raceResults) {
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
            });
        }, 250, 0);
        $interval(function () {
            $indexedDB.openStore('windowConfig', function (store) {
                store.getAll().then(function (windowConfig) {
                    $scope.windowConfig = windowConfig[0];
                    if (windowConfig[0] && windowConfig[0].currentCompetitionUUID) {
                        if ($scope.currentRace && $scope.currentRace.competitionUUID == $scope.windowConfig.currentCompetitionUUID &&
                            $scope.currentHeat && $scope.currentHeat.uuid == $scope.windowConfig.currentHeatUUID) {
                            return;
                        }
                        $indexedDB.openStore('races', function (store) {
                            store.findWhere(store.query()
                                .$index("competitionUUID")
                                .$eq(windowConfig[0].currentCompetitionUUID))
                                .then(function (races) {
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
                        });
                    }
                });
            });
        }, 1000, 0);
    }
    LiveScreenController.$inject = [
        '$scope',
        '$indexedDB',
        '$interval',
        '$timeout'
    ];
    return LiveScreenController;
}());
/// <reference path="../_all_liveScreen.ts"/>
/// <reference path='controller/ManageScreen2Controller.ts' /> 
/// <reference path='definition/jquery.d.ts' />
/// <reference path='definition/angular.d.ts' />
/// <reference path='definition/custom.d.ts' />
/// <reference path='controller/liveScreen/LiveScreenController.ts' />
/// <reference path='interfaces/ILiveScreen.ts' />
/// <reference path='initLiveScreen.ts' />  
/// <reference path='_reference.ts' />
/// <reference path='_all_livescreen.ts' />
'use strict';
var appScreenLive = angular.module('appScreenLive', ['indexedDB'])
    .config(function ($provide) {
    // Prevent Angular from sniffing for the history API
    // since it's not supported in packaged apps.
    $provide.decorator('$window', function ($delegate) {
        $delegate.history = null;
        return $delegate;
    });
})
    .config(function ($indexedDBProvider) {
    $indexedDBProvider.connection('FPV_RACE_TRACKER')
        .upgradeDatabase(18, function (event, db, tx) {
    });
})
    .controller('LiveScreenController', LiveScreenController);
/// <reference path="../_reference.ts"/>
var UUIDService = (function () {
    function UUIDService() {
    }
    UUIDService.next = function () {
        return Date.now() + '-xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    return UUIDService;
}());
/// <reference path="../_reference.ts"/>
var BaseEntity = (function () {
    function BaseEntity(json) {
        this.uuid = (json.uuid != undefined ? json.uuid : UUIDService.next());
        this.saved = (json.saved != undefined ? new Date(json.saved) : null);
        this.synced = (json.synced != undefined ? new Date(json.synced) : null);
        this.deleted = (json.deleted ? json.deleted : false);
    }
    return BaseEntity;
}());
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../_reference.ts"/>
var Classs = (function (_super) {
    __extends(Classs, _super);
    function Classs(json) {
        _super.call(this, json);
        this.name = json.name;
    }
    return Classs;
}(BaseEntity));
/// <reference path="../_reference.ts"/>
var CompetitionConfig = (function (_super) {
    __extends(CompetitionConfig, _super);
    function CompetitionConfig(json) {
        _super.call(this, json);
        this.classs = json.classs;
        this.roundsTraining = json.roundsTraining ? json.roundsTraining : 1;
        this.roundsQualifying = json.roundsQualifying ? json.roundsQualifying : 1;
        this.roundsCompetition = json.roundsCompetition ? json.roundsCompetition : 1;
        this.typeTraining = json.typeTraining ? json.typeTraining : 'Time';
        this.typeQualifying = json.typeQualifying ? json.typeQualifying : 'Time';
        this.typeCompetition = json.typeCompetition ? json.typeCompetition : 'Time';
    }
    return CompetitionConfig;
}(BaseEntity));
/// <reference path="../_reference.ts"/>
var Competition = (function (_super) {
    __extends(Competition, _super);
    function Competition(json) {
        _super.call(this, json);
        this.description = json.description;
        var date = new Date();
        date.setMilliseconds(0);
        date.setSeconds(0);
        this.dateFrom = json.dateFrom ? new Date(json.dateFrom) : date;
        this.dateTo = json.dateTo ? new Date(json.dateTo) : date;
        this.onlineRegistrationEnd = json.onlineRegistrationEnd ? new Date(json.onlineRegistrationEnd) : date;
        this.location = json.location;
        this.pilots = Competition.mapPilots(json.pilots);
        this.classes = Competition.mapClasses(json.classes);
        this.competitionConfigs = Competition.mapCompetitionConfigs(json.competitionConfigs);
        this.onlineRegistrationPossible = (typeof json.onlineRegistrationPossible == "undefined") ? true : json.onlineRegistrationPossible;
        this.onlineRegistrationKey = json.onlineRegistrationKey ? json.onlineRegistrationKey : UUIDService.next();
        this.onlineResultPossible = (typeof json.onlineResultPossible == "undefined") ? true : json.onlineResultPossible;
        this.onlineResultKey = json.onlineResultKey ? json.onlineResultKey : UUIDService.next();
        this.onlineEventPossible = (typeof json.onlineEventPossible == "undefined") ? false : json.onlineEventPossible;
    }
    Competition.mapCompetitionConfigs = function (configs) {
        var competitionConfigs = [];
        for (var idx in configs) {
            competitionConfigs.push(new CompetitionConfig(configs[idx]));
        }
        return competitionConfigs;
    };
    Competition.mapClasses = function (classes) {
        var classObjects = [];
        for (var idx in classes) {
            classObjects.push(new Classs(classes[idx]));
        }
        return classObjects;
    };
    Competition.mapPilots = function (pilots) {
        var pilotObjects = [];
        for (var idx in pilots) {
            pilotObjects.push(new Pilot(pilots[idx]));
        }
        return pilotObjects;
    };
    return Competition;
}(BaseEntity));
/// <reference path="../_reference.ts"/>
var OnlineRegistration = (function (_super) {
    __extends(OnlineRegistration, _super);
    function OnlineRegistration(json) {
        var _this = this;
        _super.call(this, json);
        this.firstName = json.firstName;
        this.lastName = json.lastName;
        this.alias = json.alias;
        this.phone = json.phone;
        this.country = json.country;
        this.email = json.email;
        this.club = json.club;
        this.pilotNumber = +json.pilotNumber;
        this.deviceId = json.deviceId;
        this.classes = [];
        if (json.classes) {
            json.classes.forEach(function (classs) {
                var classObj = ClassService.getClassByUUID(classs.uuid);
                _this.classes.push(classObj ? classObj : new Classs(json.classs));
            });
        }
        this.competition = json.competition;
    }
    OnlineRegistration.prototype.getPilotObjects = function () {
        var _this = this;
        var pilots = [];
        this.classes.forEach(function (classs) {
            pilots.push(new Pilot({
                firstName: _this.firstName,
                lastName: _this.lastName,
                alias: _this.alias,
                phone: _this.phone,
                country: _this.country,
                email: _this.email,
                club: _this.club,
                deviceId: _this.deviceId,
                classs: classs
            }));
        });
        return pilots;
    };
    return OnlineRegistration;
}(BaseEntity));
/// <reference path="../_reference.ts"/>
var HeatListViewObject = (function (_super) {
    __extends(HeatListViewObject, _super);
    function HeatListViewObject(json) {
        _super.call(this, json);
        this.heatNumber = json.heatNumber;
        this.roundNumber = json.roundNumber;
        this.roundDescription = json.roundDescription;
        this.roundUUID = json.roundUUID;
        this.raceUUID = json.raceUUID;
        this.roundType = json.roundType;
        this.raceFormat = json.raceFormat;
        this.raceClass = json.raceClass;
    }
    return HeatListViewObject;
}(BaseEntity));
/// <reference path="../_reference.ts"/>
var HeatResultViewObject = (function (_super) {
    __extends(HeatResultViewObject, _super);
    function HeatResultViewObject(json) {
        _super.call(this, json);
        this.heatNumber = json.heatNumber;
        this.roundNumber = json.roundNumber;
        this.roundDescription = json.roundDescription;
        this.competitionDescription = json.competitionDescription;
        this.roundType = json.roundType;
        this.raceFormat = json.raceFormat;
        this.raceClass = json.raceClass;
        this.raceResultEntries = json.raceResultEntries ? json.raceResultEntries : [];
        this.heatTimestamp = json.heatTimestamp ? new Date(json.heatTimestamp) : null;
    }
    return HeatResultViewObject;
}(BaseEntity));
/// <reference path="../_reference.ts"/>
var Heat = (function (_super) {
    __extends(Heat, _super);
    function Heat(json) {
        _super.call(this, json);
        this.pilots = Heat.mapPilots(json.pilots);
        this.heatNumber = json.heatNumber;
        this.heatResult = json.heatResult ? new RaceResult(json.heatResult) : null;
        var date = new Date();
        date.setMilliseconds(0);
        date.setSeconds(0);
        this.exactStartTime = json.exactStartTime;
        this.startTime = json.startTime ? new Date(json.startTime) : date;
    }
    Heat.mapPilots = function (pilots) {
        var pilotObjects = [];
        for (var idx in pilots) {
            pilotObjects.push(new Pilot(pilots[idx]));
        }
        return pilotObjects;
    };
    return Heat;
}(BaseEntity));
/// <reference path="../_reference.ts"/>
var Lap = (function (_super) {
    __extends(Lap, _super);
    function Lap(json) {
        _super.call(this, json);
        this.raceUUID = json.raceUUID;
        this.pilotUUID = json.pilotUUID;
        this.pilotName = json.pilotName;
        this.lapNumber = +json.lapNumber;
        this.startTime = +json.startTime;
        this.endTime = +json.endTime;
        this.time = +json.time;
        this.penalty = json.penalty ? +json.penalty : 0;
        this.totalTime = +json.totalTime;
        this.startTimestamp = json.startTimestamp;
        this.disqualified = json.disqualified ? json.disqualified : false;
    }
    return Lap;
}(BaseEntity));
/// <reference path="../_reference.ts"/>
var Pilot = (function (_super) {
    __extends(Pilot, _super);
    function Pilot(json) {
        _super.call(this, json);
        this.firstName = json.firstName;
        this.lastName = json.lastName;
        this.alias = json.alias;
        this.phone = json.phone;
        this.country = json.country;
        this.email = json.email;
        this.club = json.club;
        this.pilotNumber = +json.pilotNumber;
        this.deviceId = json.deviceId;
        this.manualTimingIndex = json.manualTimingIndex;
        if (json.classs) {
            var classObj = ClassService.getClassByUUID(json.classs.uuid);
            this.classs = classObj ? classObj : new Classs(json.classs);
        }
        if (json.assignedRaceBand) {
            var raceBandObj = RaceBandService.getRaceBandByUUID(json.assignedRaceBand.uuid);
            this.assignedRaceBand = raceBandObj ? raceBandObj : new RaceBand(json.assignedRaceBand);
        }
    }
    return Pilot;
}(BaseEntity));
/// <reference path="../_reference.ts"/>
var QualifiedPilot = (function (_super) {
    __extends(QualifiedPilot, _super);
    function QualifiedPilot(json) {
        _super.call(this, json);
        this.rank = json.rank;
        this.lapTimes = json.lapTimes ? json.lapTimes : [];
        this.lapTimeSum = json.lapTimeSum;
        this.amountOfLaps = json.amountOfLaps;
    }
    return QualifiedPilot;
}(Pilot));
/// <reference path="../_reference.ts"/>
var RaceBand = (function (_super) {
    __extends(RaceBand, _super);
    function RaceBand(json) {
        _super.call(this, json);
        this.value = json.value;
    }
    return RaceBand;
}(BaseEntity));
/// <reference path="../_reference.ts"/>
var RaceIdentificationObject = (function (_super) {
    __extends(RaceIdentificationObject, _super);
    function RaceIdentificationObject(json) {
        _super.call(this, json);
        this.format = json.format,
            this.class = json.class,
            this.round = json.round,
            this.type = json.type,
            this.heat = json.heat,
            this.description = json.description,
            this.heatUUID = json.heatUUID,
            this.raceUUID = json.raceUUID,
            this.result = json.result;
    }
    return RaceIdentificationObject;
}(BaseEntity));
/// <reference path="../_reference.ts"/>
var RaceResultEntry = (function (_super) {
    __extends(RaceResultEntry, _super);
    function RaceResultEntry(json) {
        _super.call(this, json);
        this.raceUUID = json.raceUUID;
        this.pilotUUID = json.pilotUUID;
        this.rank = json.rank;
        this.amountOfLaps = json.amountOfLaps;
        this.totalTime = json.totalTime;
        this.lastRoundTime = json.lastRoundTime;
        this.bestRoundTime = json.bestRoundTime;
        this.averageRoundTime = json.averageRoundTime;
        this.pilotName = json.pilotName;
        this.manualTimingIndex = json.manualTimingIndex;
        this.round = json.round;
        this.heat = json.heat;
        this.pilotNumber = json.pilotNumber;
        this.deviceId = json.deviceId;
        this.disqualified = json.disqualified ? json.disqualified : false;
        this.lastPassing = json.lastPassing;
    }
    RaceResultEntry.prototype.saveOrderedRank = function (rank) {
        this.rank = rank;
    };
    RaceResultEntry.prototype.bestRoundTimeComputed = function () {
        return this.bestRoundTime ? this.bestRoundTime : 999999999;
    };
    RaceResultEntry.prototype.totalTimeComputed = function () {
        return this.totalTime ? this.totalTime : 999999999;
    };
    RaceResultEntry.prototype.customEquals = function (other) {
        if (!this || !other) {
            return false;
        }
        if (this.pilotUUID != other.pilotUUID) {
            return false;
        }
        if (this.amountOfLaps != other.amountOfLaps) {
            return false;
        }
        if (this.totalTime != other.totalTime) {
            return false;
        }
        if (this.lastRoundTime != other.lastRoundTime) {
            return false;
        }
        return true;
    };
    return RaceResultEntry;
}(BaseEntity));
/// <reference path="../_reference.ts"/>
var RaceResult = (function (_super) {
    __extends(RaceResult, _super);
    function RaceResult(json) {
        _super.call(this, json);
        this.results = RaceResult.mapRaceResults(json.results);
        this.laps = RaceResult.mapLaps(json.laps);
        var date = new Date();
        date.setMilliseconds(0);
        date.setSeconds(0);
        this.timestamp = json.timestamp ? new Date(json.timestamp) : date;
    }
    RaceResult.mapRaceResults = function (raceResults) {
        var raceResultObjects = [];
        for (var idx in raceResults) {
            raceResultObjects.push(new RaceResultEntry(raceResults[idx]));
        }
        return raceResultObjects;
    };
    RaceResult.mapLaps = function (laps) {
        var lapObjects = [];
        for (var idx in laps) {
            lapObjects.push(new Lap(laps[idx]));
        }
        return lapObjects;
    };
    return RaceResult;
}(BaseEntity));
/// <reference path="../_reference.ts"/>
var Race = (function (_super) {
    __extends(Race, _super);
    function Race(json) {
        _super.call(this, json);
        this.competitionUUID = json.competitionUUID;
        this.rounds = Race.mapRounds(json.rounds);
        this.type = json.type;
        this.format = json.format;
        this.classs = json.classs ? new Classs(json.classs) : null;
        this.qualificationResults = Race.mapQualificationResults(json.qualificationResults);
    }
    Race.mapRounds = function (rounds) {
        var roundsObjects = [];
        for (var idx in rounds) {
            roundsObjects.push(new Round(rounds[idx]));
        }
        return roundsObjects;
    };
    Race.mapQualificationResults = function (qualificationResults) {
        var qualificationResultObjects = [];
        for (var idx in qualificationResults) {
            qualificationResultObjects.push(new RoundResultEntry(qualificationResults[idx]));
        }
        return qualificationResultObjects;
    };
    return Race;
}(BaseEntity));
/// <reference path="../_reference.ts"/>
var User = (function (_super) {
    __extends(User, _super);
    function User(json) {
        _super.call(this, json);
        this.name = json.name;
        //        this.passwordHash = json.passwordHash;
        this.email = json.email;
        this.registered = json.registered ? json.registered : false;
        this.calendarKey = json.calendarKey ? json.calendarKey : UUIDService.next();
    }
    return User;
}(BaseEntity));
/// <reference path="../../_reference.ts"/>
var ClassSyncRequest = (function (_super) {
    __extends(ClassSyncRequest, _super);
    function ClassSyncRequest(user, data) {
        _super.call(this, user);
        this.data = data;
    }
    return ClassSyncRequest;
}(BaseSyncRequest));
/// <reference path="../../_reference.ts"/>
var CompetitionSyncRequest = (function (_super) {
    __extends(CompetitionSyncRequest, _super);
    function CompetitionSyncRequest(user, data) {
        _super.call(this, user);
        this.data = data;
    }
    return CompetitionSyncRequest;
}(BaseSyncRequest));
/// <reference path="../../_reference.ts"/>
var PilotSyncRequest = (function (_super) {
    __extends(PilotSyncRequest, _super);
    function PilotSyncRequest(user, data) {
        _super.call(this, user);
        this.data = data;
    }
    return PilotSyncRequest;
}(BaseSyncRequest));
/// <reference path="../../_reference.ts"/>
var RaceBandSyncRequest = (function (_super) {
    __extends(RaceBandSyncRequest, _super);
    function RaceBandSyncRequest(user, data) {
        _super.call(this, user);
        this.data = data;
    }
    return RaceBandSyncRequest;
}(BaseSyncRequest));
/// <reference path="../../_reference.ts"/>
var RaceSyncRequest = (function (_super) {
    __extends(RaceSyncRequest, _super);
    function RaceSyncRequest(user, data) {
        _super.call(this, user);
        this.data = data;
    }
    return RaceSyncRequest;
}(BaseSyncRequest));
/// <reference path="../_reference.ts"/>
var RoundResultEntry = (function (_super) {
    __extends(RoundResultEntry, _super);
    function RoundResultEntry(json) {
        //TODO: evaluate if roundresultentry could be replaced with raceresultentry
        _super.call(this, json);
        this.pilotUUID = json.pilotUUID;
        this.rank = json.rank;
        this.lapTimes = json.lapTimes ? json.lapTimes : [];
        this.lapTimesSum = json.lapTimesSum;
        this.pilotName = json.pilotName;
        this.pilotNumber = json.pilotNumber;
        this.deviceId = json.deviceId;
        this.disqualified = json.disqualified ? json.disqualified : false;
    }
    return RoundResultEntry;
}(BaseEntity));
/// <reference path="../_reference.ts"/>
var Round = (function (_super) {
    __extends(Round, _super);
    function Round(json) {
        _super.call(this, json);
        this.blockingTime = json.blockingTime;
        this.countdown = json.countdown;
        this.duration = json.duration;
        this.roundNumber = json.roundNumber;
        this.overtime = json.overtime;
        var date = new Date();
        date.setMilliseconds(0);
        date.setSeconds(0);
        this.timestamp = json.timestamp ? new Date(json.timestamp) : date;
        this.amountOfHeats = json.amountOfHeats;
        this.lapDistance = json.lapDistance;
        this.amountOfQualifiedPilots = json.amountOfQualifiedPilots;
        this.amountOfLaps = json.amountOfLaps;
        this.heats = Round.mapHeats(json.heats);
        this.description = json.description;
        this.competitionResults = Round.mapCompetitionResults(json.competitionResults);
    }
    Round.mapHeats = function (heats) {
        var heatObjects = [];
        for (var idx in heats) {
            heatObjects.push(new Heat(heats[idx]));
        }
        return heatObjects;
    };
    Round.mapCompetitionResults = function (competitionResults) {
        var competitionResultObjects = [];
        for (var idx in competitionResults) {
            competitionResultObjects.push(new RaceResultEntry(competitionResults[idx]));
        }
        return competitionResultObjects;
    };
    return Round;
}(BaseEntity));
/// <reference path="../_reference.ts"/>
var Timer = (function () {
    function Timer() {
        this.countdownValue = 0;
        this.finishCallback = null;
        this.updateCallback = null;
        this.lastSecond = 0;
        this.stop = false;
        this.countdownValue = 0;
    }
    Timer.prototype.startTimer = function (countdownValue, finishCallback, startPlayed, reloadCallback) {
        var _this = this;
        this.startPlayed = startPlayed;
        this.stop = false;
        this.initCountdownValue = countdownValue;
        this.intervalTime = 20;
        this.countdownValue = countdownValue;
        this.lastExecution = this.getCurrentMillis();
        clearTimeout(this.internalTimer);
        this.finishCallback = finishCallback;
        this.reloadCallback = reloadCallback;
        this.internalTimer = setTimeout(function () { return _this.updateCountdown(); }, this.intervalTime);
        return this;
    };
    Timer.prototype.setTimerStopable = function () {
        this.stop = true;
    };
    Timer.prototype.stopTimer = function () {
        this.countdownValue = 0;
        clearTimeout(this.internalTimer);
        this.finishCallback();
    };
    Timer.prototype.updateCountdown = function () {
        var _this = this;
        var now = this.getCurrentMillis();
        if (!this.stop && this.countdownValue - (now - this.lastExecution) > 0) {
            this.countdownValue = this.countdownValue - now + this.lastExecution;
            this.lastExecution = now;
            var progress = 100 - (100 * (this.countdownValue / this.initCountdownValue));
            this.internalTimer = setTimeout(function () { return _this.updateCountdown(); }, this.intervalTime);
            if (!this.startPlayed && this.countdownValue < 5000) {
                this.startPlayed = true;
                SoundService.playStart();
            }
            if (this.reloadCallback && Math.floor(this.countdownValue) != this.lastSecond) {
                this.lastSecond = Math.floor(this.countdownValue);
                this.reloadCallback();
            }
        }
        else {
            this.stopTimer();
        }
    };
    Timer.prototype.getCurrentMillis = function () {
        return new Date().getTime();
    };
    return Timer;
}());
/// <reference path="../_reference.ts"/>
var UpcomingHeatViewObject = (function (_super) {
    __extends(UpcomingHeatViewObject, _super);
    function UpcomingHeatViewObject(json) {
        _super.call(this, json);
        this.heatNumber = json.heatNumber;
        this.roundNumber = json.roundNumber;
        this.roundDescription = json.roundDescription;
        this.roundType = json.roundType;
        this.raceFormat = json.raceFormat;
        this.raceClass = json.raceClass;
        this.pilots = json.pilots ? json.pilots : [];
        this.heatTimestamp = json.heatTimestamp;
    }
    return UpcomingHeatViewObject;
}(BaseEntity));
/// <reference path="../_reference.ts"/>
var WindowConfig = (function (_super) {
    __extends(WindowConfig, _super);
    function WindowConfig(json) {
        _super.call(this, { uuid: "" + 1 });
        this.currentCompetitionUUID = json.currentCompetitionUUID;
        this.liveScreenBackgroundColorCode = json.liveScreenBackgroundColorCode ? json.liveScreenBackgroundColorCode : '#00ff00';
        this.currentHeatUUID = json.currentHeatUUID;
        this.currentLivePilotUUID = json.currentLivePilotUUID;
        this.showLiveResultList = (typeof json.showLiveResultList == "undefined") ? true : json.showLiveResultList;
    }
    return WindowConfig;
}(BaseEntity));
/// <reference path="../_reference.ts"/>
var AjaxService = (function () {
    function AjaxService() {
    }
    AjaxService.send = function (path, request, callback) {
        var http = new XMLHttpRequest();
        var url = AjaxService.protocol + "://" + AjaxService.host + "" + AjaxService.port + "/" + path;
        var body = JSON.stringify(request);
        if (request) {
            http.open("POST", url, true);
        }
        else {
            http.open("GET", url, true);
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
    AjaxService.port = "";
    //public static port: string = ":8080";
    AjaxService.host = "cloud.fpvracetracker.com";
    //public static host: string = "localhost";
    AjaxService.protocol = "https";
    //public static protocol: string = "http";
    AjaxService.path_syncPilots = "sync/pilots";
    AjaxService.path_syncCompetitions = "sync/competitions";
    AjaxService.path_syncRaces = "sync/races";
    AjaxService.path_syncRaceBands = "sync/raceBands";
    AjaxService.path_syncClasses = "sync/classes";
    AjaxService.path_syncUser = "sync/user";
    AjaxService.path_createAccountTransfer = "createAccountTransfer";
    AjaxService.path_transferAccount = "transferAccount";
    AjaxService.path_getOnlinePilots = "onlineRegister/registrations";
    AjaxService.path_removeRegistration = "onlineRegister/removeRegistration";
    return AjaxService;
}());
/// <reference path="../_reference.ts"/>
var MenuService = (function () {
    function MenuService() {
    }
    MenuService.init = function () {
        document.getElementById("menuNewRace").onclick = MenuService.races;
        document.getElementById("menuNewPilot").onclick = MenuService.pilots;
        document.getElementById("menuStatistics").onclick = MenuService.statistics;
        document.getElementById("menuConfiguration").onclick = MenuService.configuration;
        document.getElementById("menuNewEvent").onclick = MenuService.events;
    };
    MenuService.showElementById = function (id) {
        MenuService.hideAll();
        document.getElementById(id).classList.add('visible');
    };
    MenuService.hideAll = function () {
        document.getElementById('pilots').classList.remove('visible');
        document.getElementById('races').classList.remove('visible');
        document.getElementById('statistic').classList.remove('visible');
        document.getElementById('events').classList.remove('visible');
        SubMenuService.hideAllContent();
        SubMenuService.hideSubMenu();
    };
    MenuService.events = function () {
        CompetitionService.init(null);
        MenuService.showElementById("events");
    };
    MenuService.races = function () {
        MenuService.showElementById("races");
        RaceService.init(null);
    };
    MenuService.pilots = function () {
        PilotService.init(null);
        MenuService.showElementById("pilots");
    };
    MenuService.configuration = function () {
        MenuService.hideAll();
        SubMenuService.showConfigurationSubMenu();
    };
    MenuService.statistics = function () {
        StatisticService.init();
        MenuService.showElementById("statistic");
    };
    return MenuService;
}());
/// <reference path="../_reference.ts"/>
var RaceService = (function () {
    function RaceService() {
    }
    RaceService.getCurrentRace = function () {
        return RaceService.currentRace;
    };
    RaceService.toggleShowTotalQualificationResult = function () {
        RaceService.CURRENT_STATUS.showTotalQualificationResult = !RaceService.CURRENT_STATUS.showTotalQualificationResult;
    };
    RaceService.downloadTimetable = function () {
        var csv = "";
        csv += "Event:;" + RaceService.selectedCompetition.description + "\n\n\n";
        var upcomingHeats = [];
        RaceService.races.forEach(function (race) {
            if (race.competitionUUID == RaceService.currentRace.competitionUUID) {
                race.rounds.forEach(function (round) {
                    round.heats.forEach(function (heat) {
                        csv += "Format;Class;Type;Round;Heat;Start Time;Description\n";
                        csv += RaceService.currentRace.format + ";";
                        csv += RaceService.currentRace.classs.name + ";";
                        csv += RaceService.currentRace.type + ";";
                        csv += round.roundNumber + ";";
                        csv += heat.heatNumber + ";";
                        csv += heat.startTime + ";";
                        csv += round.description ? round.description : "" + ";";
                        if (heat.pilots && heat.pilots.length > 0) {
                            csv += "\n\n";
                            csv += ";Pilot Nr;Pilot;Race Band,Transponder ID\n";
                            heat.pilots.forEach(function (pilot) {
                                csv += ";";
                                csv += pilot.pilotNumber + ";";
                                csv += pilot.firstName + " " + pilot.lastName + ";";
                                csv += pilot.assignedRaceBand.value + ";";
                                csv += pilot.deviceId + ";";
                                csv += "\n";
                            });
                        }
                        else {
                            csv += "\nNo pilots assigned!\n";
                        }
                        csv += "\n\n";
                    });
                });
            }
        });
        var blobdata = new Blob([csv], { type: 'text/csv' });
        var filename = "race_result_(" + new Date().toJSON() + ").csv";
        filename = filename.replace(" ", "");
        var link = document.createElement("a");
        link.setAttribute("href", window.URL.createObjectURL(blobdata));
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        NotificationService.notify(NotificationService.fileDownloadText);
    };
    RaceService.init = function (callback) {
        if (RaceService.CURRENT_STATUS.startInProgress || RaceService.CURRENT_STATUS.raceStarted || RaceService.CURRENT_STATUS.raceCloseable) {
            return;
        }
        RaceService.updateDefaultCompetitionValue();
        DatabaseService.readAll(DatabaseService.store_races, function (result) {
            RaceService.setRaces(result);
            if (callback)
                callback();
        });
        if (!SERIAL_ENABLED) {
            RaceService.CURRENT_STATUS.deviceNotReady = false;
        }
    };
    RaceService.toogleHeatMenu = function (heat) {
        if (RaceService.heatToEdit == heat) {
            RaceService.heatToEdit = null;
            return;
        }
        RaceService.heatToEdit = heat;
    };
    RaceService.getMostLapsInfo = function () {
        var mostLaps = 0;
        RaceService.raceResult.forEach(function (result) {
            if (result.amountOfLaps > mostLaps) {
                mostLaps = result.amountOfLaps;
            }
        });
        return mostLaps;
    };
    RaceService.allPreviousHeatsAreFinished = function () {
        var allPreviousHeatsFinished = true;
        RaceService.currentRace.rounds.forEach(function (round) {
            if (round.roundNumber < RaceService.currentRound.roundNumber) {
                round.heats.forEach(function (heat) {
                    if (!heat.heatResult) {
                        allPreviousHeatsFinished = false;
                    }
                });
            }
        });
        return allPreviousHeatsFinished;
    };
    RaceService.isEditableRound = function () {
        var roundNumber = 1;
        RaceService.currentRace.rounds.forEach(function (round) {
            round.heats.forEach(function (heat) {
                if (heat.heatResult) {
                    roundNumber = round.roundNumber;
                }
            });
        });
        return roundNumber <= RaceService.currentRound.roundNumber;
    };
    RaceService.restartHeat = function () {
        RaceService.heatToEdit.heatResult = null;
        RaceService.calculateCurrentQualificationResults();
        RaceService.reloadQualificationResults();
        RaceService.update(RaceService.currentRace);
        RaceService.toogleHeatMenu(null);
    };
    RaceService.simulateHeat = function () {
        RaceService.startHeat(RaceService.heatToEdit, true);
        RaceService.toogleHeatMenu(null);
    };
    RaceService.closeHeat = function () {
        RaceService.heatToEdit.heatResult = new RaceResult({ results: [], laps: [] });
        RaceService.calculateCurrentQualificationResults();
        RaceService.reloadQualificationResults();
        RaceService.update(RaceService.currentRace);
        RaceService.toogleHeatMenu(null);
    };
    RaceService.roundNumberHelperCurrent = function () {
        if (RaceService.currentRoundNumber) {
            return new Array(RaceService.currentRoundNumber - 1);
        }
        return [];
    };
    RaceService.roundNumberHelper = function () {
        if (RaceService.currentRace && RaceService.currentRace.rounds.length) {
            return new Array(RaceService.currentRace.rounds.length);
        }
        return [];
    };
    RaceService.heatResultExistsInCurrentRound = function () {
        if (RaceService.currentRound)
            return RaceService.currentRound.heats.some(function (heat) {
                if (heat.heatResult)
                    return true;
                return false;
            });
        return false;
    };
    RaceService.findCurrentRace = function () {
        if (!RaceService.selectedCompetition || !RaceService.selectedClass) {
            return;
        }
        RaceService.races.forEach(function (race) {
            if (race.competitionUUID == RaceService.currentCompetitionUUID) {
                if (race.format == RaceService.selectedFormat) {
                    if (race.classs && race.classs.uuid == RaceService.selectedClass.uuid) {
                        RaceService.currentRace = race;
                    }
                }
            }
        });
        if (!RaceService.currentRace) {
            return;
        }
        RaceService.availableRoundNumbers.length = 0;
        for (var i = 0; i < RaceService.currentRace.rounds.length; i++) {
            RaceService.availableRoundNumbers.push(i + 1);
        }
        if (RaceService.availableRoundNumbers.length > 0) {
            RaceService.currentRoundNumber = 1;
            RaceService.roundSelected();
        }
        RaceService.reloadQualificationResults();
        RaceService.reloadPreviousRound();
    };
    RaceService.reloadQualificationResults = function () {
        RaceService.qualificationResultOfCurrentRace.length = 0;
        Array.prototype.push.apply(RaceService.qualificationResultOfCurrentRace, RaceService.getResultsFromQualification());
    };
    RaceService.reloadPreviousRound = function () {
        RaceService.previousRound = null;
        RaceService.currentRace.rounds.forEach(function (round) {
            if (round.roundNumber == RaceService.currentRound.roundNumber - 1) {
                RaceService.previousRound = round;
            }
        });
    };
    RaceService.roundSelected = function () {
        var found = false;
        RaceService.currentRace.rounds.forEach(function (round) {
            if (round.roundNumber == RaceService.currentRoundNumber) {
                RaceService.currentRound = round;
                found = true;
            }
        });
        if (!found) {
            RaceService.currentRound = RaceService.getNewRound(RaceService.currentRoundNumber);
        }
        RaceService.reloadQualificationResults();
        RaceService.reloadPreviousRound();
    };
    RaceService.saveRound = function () {
        RaceService.update(RaceService.currentRace);
        NotificationService.notify("Saved!");
    };
    RaceService.classChanged = function () {
        RaceService.findCurrentRace();
    };
    RaceService.formatChanged = function () {
        RaceService.findCurrentRace();
    };
    RaceService.competitionChanged = function () {
        if (RaceService.selectedCompetition) {
            RaceService.currentCompetitionUUID = RaceService.selectedCompetition.uuid;
            RaceService.selectedClass = (RaceService.selectedCompetition.classes && RaceService.selectedCompetition.classes.length > 0) ? RaceService.selectedCompetition.classes[0] : null;
            WindowConfigService.setCurrentCompetition(RaceService.selectedCompetition.uuid);
        }
        else {
            RaceService.currentCompetitionUUID = "";
            WindowConfigService.setCurrentCompetition("");
            WindowConfigService.setCurrentHeat("");
        }
        RaceService.findCurrentRace();
    };
    RaceService.heatsPerRoundChanged = function () {
        if (RaceService.currentRound.heats.length == RaceService.currentRound.amountOfHeats) {
            return;
        }
        if (RaceService.currentRound.heats.length > RaceService.currentRound.amountOfHeats) {
            RaceService.currentRound.heats.splice(RaceService.currentRound.amountOfHeats);
        }
        while (RaceService.currentRound.heats.length < RaceService.currentRound.amountOfHeats) {
            RaceService.currentRound.heats.push(new Heat({ heatNumber: RaceService.currentRound.heats.length + 1 }));
        }
    };
    RaceService.updateDefaultCompetitionValue = function () {
        if (CompetitionService.competitions.length > 0) {
            var youngestCompetition = CompetitionService.competitions[0];
            for (var idx in CompetitionService.competitions) {
                if (CompetitionService.competitions[idx].dateFrom > youngestCompetition.dateFrom) {
                    youngestCompetition = CompetitionService.competitions[idx];
                }
            }
            RaceService.selectedCompetition = youngestCompetition;
            RaceService.competitionChanged();
            RaceService.reloadAngular();
        }
    };
    RaceService.sortByPilotNr = function () {
        RaceService.pilotSelectionOrder = ['+pilotNumber'];
    };
    RaceService.sortByName = function () {
        RaceService.pilotSelectionOrder = ['+firstName', '+lastName'];
    };
    RaceService.pilotFilter = function (pilot, index, array) {
        if (!RaceService.currentRace || !RaceService.currentRound || !RaceService.currentRound.heats) {
            return false;
        }
        for (var idx in RaceService.currentRound.heats) {
            for (var pIdx in RaceService.currentRound.heats[idx].pilots) {
                if (RaceService.currentRace.format.toUpperCase() != "TRAINING" && RaceService.currentRound.heats[idx].pilots[pIdx].uuid == pilot.uuid) {
                    return false;
                }
            }
        }
        if (pilot.classs && RaceService.selectedClass && pilot.classs.uuid != RaceService.selectedClass.uuid) {
            if (RaceService.currentRace.format.toUpperCase() != "TRAINING") {
                return false;
            }
        }
        if (CompetitionService.nameFilter.text && ("" + pilot.pilotNumber).indexOf(CompetitionService.nameFilter.text) == -1
            && (pilot.firstName + " " + pilot.lastName).toUpperCase().indexOf(CompetitionService.nameFilter.text.toUpperCase()) == -1) {
            return false;
        }
        if (RaceService.currentRace.format.toUpperCase() == "QUALIFYING" && RaceService.currentRound.roundNumber > 1) {
            var result = RaceService.qualificationResultOfCurrentRace.filter(function (result) {
                return result.pilotUUID == pilot.uuid;
            });
            if (!result || result.length != 1) {
                return false;
            }
            if (result[0].lapTimes.length != RaceService.currentRound.roundNumber - 1) {
                return false;
            }
            if (result[0].rank > RaceService.currentRound.amountOfQualifiedPilots) {
                return false;
            }
        }
        if (RaceService.currentRace.format.toUpperCase() == "COMPETITION") {
            if (RaceService.currentRound.roundNumber == 1) {
                if (RaceService.qualificationResultOfCurrentRace.length == 0) {
                    //no qualification done, all pilots can participate
                    return true;
                }
                var result = RaceService.qualificationResultOfCurrentRace.filter(function (result) {
                    return result.pilotUUID == pilot.uuid;
                });
                if (!result || result.length != 1) {
                    return false;
                }
                if (result[0].rank > RaceService.currentRound.amountOfQualifiedPilots) {
                    return false;
                }
            }
            if (RaceService.previousRound && RaceService.currentRound.roundNumber > 1) {
                var entry = RaceService.previousRound.competitionResults.filter(function (entry) {
                    return entry.pilotUUID == pilot.uuid;
                });
                if (!entry || entry.length != 1) {
                    return false;
                }
                if (entry[0].rank > RaceService.currentRound.amountOfQualifiedPilots) {
                    return false;
                }
            }
        }
        return true;
    };
    RaceService.getResultsFromQualification = function () {
        var qualificationRace = null;
        for (var idx = 0; idx < RaceService.races.length; idx++) {
            if (RaceService.currentRace.competitionUUID == RaceService.races[idx].competitionUUID
                && RaceService.races[idx].format.toUpperCase() == "QUALIFYING"
                && RaceService.races[idx].classs
                && RaceService.races[idx].classs.name == RaceService.currentRace.classs.name) {
                return RaceService.races[idx].qualificationResults;
            }
        }
        ;
        if (!qualificationRace) {
            return [];
        }
    };
    RaceService.qualificationFilter = function (pilot, index, array) {
        if (!RaceService.currentRace || !RaceService.currentRound || !RaceService.currentRound.heats) {
            return false;
        }
        for (var idx in RaceService.currentRound.heats) {
            for (var pIdx in RaceService.currentRound.heats[idx].pilots) {
                if (RaceService.currentRound.heats[idx].pilots[pIdx].uuid == pilot.uuid) {
                    return false;
                }
            }
        }
        if (pilot.classs && RaceService.selectedClass && pilot.classs.uuid != RaceService.selectedClass.uuid) {
            return false;
        }
        if (CompetitionService.nameFilter.text && ("" + pilot.pilotNumber).indexOf(CompetitionService.nameFilter.text) == -1
            && (pilot.firstName + " " + pilot.lastName).toUpperCase().indexOf(CompetitionService.nameFilter.text.toUpperCase()) == -1) {
            return false;
        }
        return true;
    };
    RaceService.removePilotFromRaceByUUID = function (uuid) {
        if (!RaceService.currentRound) {
            return;
        }
        for (var idx in RaceService.currentRound.heats) {
            for (var pIdx in RaceService.currentRound.heats[idx].pilots) {
                if (RaceService.currentRound.heats[idx].pilots[pIdx].uuid == uuid) {
                    RaceService.currentRound.heats[idx].pilots.splice(pIdx, 1);
                }
                return;
            }
        }
    };
    RaceService.fillHeats = function () {
        CompetitionService.nameFilter.text = "";
        if (!RaceService.currentRace || !RaceService.currentRound || !RaceService.currentRound.heats || !RaceService.selectedCompetition) {
            return;
        }
        //dont mix up rounds with allready finished heats
        for (var idx in RaceService.currentRound.heats) {
            if (RaceService.currentRound.heats[idx].heatResult) {
                return;
            }
        }
        for (var idx in RaceService.currentRound.heats) {
            RaceService.currentRound.heats[idx].pilots.length = 0;
        }
        RaceService.addPilots();
    };
    RaceService.setPilotsTimingIndex = function (pilots) {
        for (var idx = 0; idx < pilots.length; idx++) {
            pilots[idx].manualTimingIndex = "" + (idx + 1);
        }
        ;
    };
    RaceService.clickPilot = function (heat, pilot) {
        RaceService.pilotToMove = pilot;
        RaceService.pilotToMoveOrigin = heat;
    };
    RaceService.cancelMovePilot = function () {
        RaceService.pilotToMove = null;
        RaceService.pilotToMoveOrigin = null;
    };
    RaceService.movePilot = function (heat) {
        if (RaceService.pilotToMoveOrigin) {
            RaceService.pilotToMoveOrigin.pilots.splice(RaceService.pilotToMoveOrigin.pilots.indexOf(RaceService.pilotToMove), 1);
            RaceService.setPilotsTimingIndex(RaceService.pilotToMoveOrigin.pilots);
        }
        if (heat) {
            var qualifiedPilot = new QualifiedPilot(RaceService.pilotToMove);
            if (RaceService.currentRace.format.toUpperCase() == "QUALIFYING") {
                RaceService.currentRace.qualificationResults.forEach(function (qualificationResult) {
                    if (qualificationResult.pilotUUID == qualifiedPilot.uuid) {
                        qualifiedPilot.lapTimeSum = qualificationResult.lapTimesSum;
                        qualifiedPilot.lapTimes.length = 0;
                        for (var ltIdx in qualificationResult.lapTimes) {
                            qualifiedPilot.lapTimes.push(qualificationResult.lapTimes[ltIdx]);
                        }
                        qualifiedPilot.rank = qualificationResult.rank;
                    }
                });
            }
            else if (RaceService.currentRace.format.toUpperCase() == "COMPETITION") {
                RaceService.currentRound.competitionResults.forEach(function (competitionResult) {
                    if (competitionResult.pilotUUID == qualifiedPilot.uuid) {
                        qualifiedPilot.lapTimeSum = competitionResult.totalTime;
                        qualifiedPilot.lapTimes.length = 0;
                        qualifiedPilot.rank = competitionResult.rank;
                    }
                });
            }
            heat.pilots.push(qualifiedPilot);
            RaceService.reAssignRaceBandsToCurrentRound();
            RaceService.setPilotsTimingIndex(heat.pilots);
        }
        RaceService.pilotToMove = null;
        RaceService.pilotToMoveOrigin = null;
    };
    RaceService.shuffle = function (o) {
        for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x)
            ;
        return o;
    };
    RaceService.isHeatFull = function (heat) {
        return heat.pilots.length >= RaceBandService.raceBands.length || (RaceService.pilotToMove && heat.pilots.some(function (p) {
            return RaceService.pilotToMove.uuid == p.uuid || RaceService.pilotToMove.deviceId == p.deviceId;
        }));
    };
    RaceService.reAssignRaceBandsToCurrentRound = function () {
        RaceService.currentRound.heats.forEach(function (heat) {
            for (var idx = 0; idx < heat.pilots.length; idx++) {
                if (RaceBandService.raceBands[idx]) {
                    heat.pilots[idx].assignedRaceBand = RaceBandService.raceBands[idx];
                }
            }
        });
    };
    RaceService.addPilots = function () {
        var pilots = RaceService.selectedCompetition.pilots.filter(RaceService.pilotFilter);
        var amountOfRaceBands = RaceBandService.raceBands.length;
        RaceService.shuffle(pilots);
        var pilot = null;
        if (RaceService.currentRace.format.toUpperCase() == "COMPETITION") {
            if (RaceService.currentRound.roundNumber == 1) {
                if (RaceService.qualificationResultOfCurrentRace && RaceService.qualificationResultOfCurrentRace.length > 0) {
                    for (var resultIndex in RaceService.qualificationResultOfCurrentRace) {
                        var qualifiedPilot = null;
                        pilots.forEach(function (p) {
                            if (p.uuid == RaceService.qualificationResultOfCurrentRace[resultIndex].pilotUUID) {
                                qualifiedPilot = new QualifiedPilot(p);
                                qualifiedPilot.lapTimeSum = RaceService.qualificationResultOfCurrentRace[resultIndex].lapTimesSum;
                                qualifiedPilot.lapTimes.length = 0;
                                qualifiedPilot.rank = RaceService.qualificationResultOfCurrentRace[resultIndex].rank;
                            }
                        });
                        if (!qualifiedPilot || RaceService.qualificationResultOfCurrentRace[resultIndex].disqualified) {
                            continue;
                        }
                        var heatIndex = (RaceService.qualificationResultOfCurrentRace[resultIndex].rank - 1) % RaceService.currentRound.heats.length;
                        var heat = RaceService.currentRound.heats[heatIndex];
                        if (heat.pilots && heat.pilots.length < amountOfRaceBands) {
                            heat.pilots.push(qualifiedPilot);
                        }
                    }
                }
                else {
                    for (var pilotIndex in pilots) {
                        pilot = pilots[pilotIndex];
                        var minAmountOfPilotsInHeats = 9999999;
                        RaceService.currentRound.heats.forEach(function (heat) {
                            if (heat.pilots.length < minAmountOfPilotsInHeats) {
                                minAmountOfPilotsInHeats = heat.pilots.length;
                            }
                        });
                        var freeHeats = RaceService.currentRound.heats.filter(function (heat) {
                            return heat.pilots.length == minAmountOfPilotsInHeats && !heat.pilots.some(function (p) {
                                return pilot.uuid == p.uuid || pilot.deviceId == p.deviceId;
                            });
                        });
                        for (var hIdx in freeHeats) {
                            var heat = freeHeats[hIdx];
                            if (heat.pilots && heat.pilots.length < amountOfRaceBands) {
                                heat.pilots.push(pilot);
                                break;
                            }
                        }
                    }
                }
            }
            else if (RaceService.currentRound.roundNumber > 1) {
                for (var resultIndex in RaceService.previousRound.competitionResults) {
                    var qualifiedPilot = null;
                    pilots.forEach(function (p) {
                        if (p.uuid == RaceService.previousRound.competitionResults[resultIndex].pilotUUID) {
                            qualifiedPilot = new QualifiedPilot(p);
                            qualifiedPilot.lapTimeSum = RaceService.previousRound.competitionResults[resultIndex].totalTime;
                            qualifiedPilot.amountOfLaps = RaceService.previousRound.competitionResults[resultIndex].amountOfLaps;
                            qualifiedPilot.rank = RaceService.previousRound.competitionResults[resultIndex].rank;
                        }
                    });
                    if (!qualifiedPilot || RaceService.previousRound.competitionResults[resultIndex].disqualified) {
                        continue;
                    }
                    var heatIndex = (RaceService.previousRound.competitionResults[resultIndex].rank - 1) % RaceService.currentRound.heats.length;
                    var heat = RaceService.currentRound.heats[heatIndex];
                    if (heat.pilots && heat.pilots.length < amountOfRaceBands) {
                        heat.pilots.push(qualifiedPilot);
                    }
                }
            }
        }
        else if (RaceService.currentRace.format.toUpperCase() == "QUALIFYING") {
            if (RaceService.currentRound.roundNumber == 1) {
                for (var pilotIndex in pilots) {
                    pilot = pilots[pilotIndex];
                    var minAmountOfPilotsInHeats = 9999999;
                    RaceService.currentRound.heats.forEach(function (heat) {
                        if (heat.pilots.length < minAmountOfPilotsInHeats) {
                            minAmountOfPilotsInHeats = heat.pilots.length;
                        }
                    });
                    var freeHeats = RaceService.currentRound.heats.filter(function (heat) {
                        return heat.pilots.length == minAmountOfPilotsInHeats && !heat.pilots.some(function (p) {
                            return pilot.uuid == p.uuid || pilot.deviceId == p.deviceId;
                        });
                    });
                    for (var hIdx in freeHeats) {
                        var heat = freeHeats[hIdx];
                        if (heat.pilots && heat.pilots.length < amountOfRaceBands) {
                            heat.pilots.push(pilot);
                            break;
                        }
                    }
                }
            }
            else if (RaceService.currentRound.roundNumber > 1) {
                for (var resultIndex in RaceService.qualificationResultOfCurrentRace) {
                    var qualifiedPilot = null;
                    pilots.forEach(function (p) {
                        if (p.uuid == RaceService.qualificationResultOfCurrentRace[resultIndex].pilotUUID) {
                            qualifiedPilot = new QualifiedPilot(p);
                            qualifiedPilot.lapTimeSum = RaceService.qualificationResultOfCurrentRace[resultIndex].lapTimesSum;
                            qualifiedPilot.lapTimes.length = 0;
                            for (var ltIdx in RaceService.qualificationResultOfCurrentRace[resultIndex].lapTimes) {
                                qualifiedPilot.lapTimes.push(RaceService.qualificationResultOfCurrentRace[resultIndex].lapTimes[ltIdx]);
                            }
                            qualifiedPilot.rank = RaceService.qualificationResultOfCurrentRace[resultIndex].rank;
                        }
                    });
                    if (!qualifiedPilot || RaceService.qualificationResultOfCurrentRace[resultIndex].disqualified) {
                        continue;
                    }
                    var heatIndex = (RaceService.qualificationResultOfCurrentRace[resultIndex].rank - 1) % RaceService.currentRound.heats.length;
                    var heat = RaceService.currentRound.heats[heatIndex];
                    if (heat.pilots && heat.pilots.length < amountOfRaceBands) {
                        heat.pilots.push(qualifiedPilot);
                    }
                }
            }
        }
        else if (RaceService.currentRace.format.toUpperCase() == "TRAINING") {
            for (var pilotIndex in pilots) {
                pilot = pilots[pilotIndex];
                var minAmountOfPilotsInHeats = 9999999;
                RaceService.currentRound.heats.forEach(function (heat) {
                    if (heat.pilots.length < minAmountOfPilotsInHeats) {
                        minAmountOfPilotsInHeats = heat.pilots.length;
                    }
                });
                var freeHeats = RaceService.currentRound.heats.filter(function (heat) {
                    return heat.pilots.length == minAmountOfPilotsInHeats && !heat.pilots.some(function (p) {
                        return pilot.uuid == p.uuid || pilot.deviceId == p.deviceId;
                    });
                });
                for (var hIdx in freeHeats) {
                    var heat = freeHeats[hIdx];
                    if (heat.pilots && heat.pilots.length < amountOfRaceBands) {
                        heat.pilots.push(pilot);
                        break;
                    }
                }
            }
        }
        RaceService.setPilotsTimingIndex(heat.pilots);
        RaceService.reAssignRaceBandsToCurrentRound();
    };
    RaceService.showRaceResult = function () {
        document.getElementById("raceResult").classList.remove("removed");
        document.getElementById("addPilotsList").classList.add("removed");
        document.getElementById("configureRace-container").classList.add("mini");
    };
    RaceService.hideRaceResult = function () {
        document.getElementById("addPilotsList").classList.remove("removed");
        document.getElementById("raceResult").classList.add("removed");
        document.getElementById("configureRace-container").classList.remove("mini");
    };
    RaceService.close = function () {
        if (RaceService.CURRENT_STATUS.raceStarted) {
            RaceService.setRaceStopable();
            RaceService.stopRace();
        }
        RaceService.CURRENT_STATUS.raceCloseable = false;
        RaceService.hideRaceResult();
        RaceSimulationService.stopSimulation();
    };
    RaceService.setRaceStopable = function () {
        setTimeout(function () {
            RaceService.durationTimer.setTimerStopable();
            RaceService.reloadAngular();
            console.log("STOP");
        }, RaceService.currentRound.overtime * 1000);
    };
    RaceService.stopRace = function () {
        RaceService.CURRENT_STATUS.raceStarted = false;
        RaceSimulationService.stopSimulation();
    };
    RaceService.resultClicked = function (result, heat) {
        RaceService.resultToEdit = result;
        EditLapsService.setLaps(heat.heatResult.laps.filter(function (lap) {
            return lap.pilotUUID == result.pilotUUID;
        }));
        RaceService.heatForPenalty = heat;
        console.dir(RaceService.resultToEdit);
        console.dir(RaceService.heatForPenalty.heatResult.results);
    };
    RaceService.savePenalty = function () {
        RaceResultService.calculateRaceResult(RaceService.heatForPenalty.heatResult.results, RaceService.currentRace, RaceService.heatForPenalty, RaceService.heatForPenalty.heatResult.laps);
        if (RaceService.currentRace.format.toUpperCase() == "QUALIFYING") {
            RaceService.calculateCurrentQualificationResults();
        }
        else if (RaceService.currentRace.format.toUpperCase() == "COMPETITION") {
            RaceService.calculateCurrentCompetitionResults();
        }
        RaceService.update(RaceService.currentRace);
        RaceService.cancelEditResult();
    };
    RaceService.cancelEditResult = function () {
        RaceService.resultToEdit = null;
        EditLapsService.setLaps([]);
        RaceService.heatForPenalty = null;
    };
    RaceService.disqualify = function () {
        RaceService.heatForPenalty.heatResult.laps.forEach(function (lap) {
            if (RaceService.resultToEdit.pilotUUID == lap.pilotUUID) {
                lap.disqualified = !lap.disqualified;
            }
        });
        RaceService.savePenalty();
        //TODO:  show disqualified on UI
    };
    RaceService.setRaceResult = function () {
        if (RaceService.raceResult && RaceService.CURRENT_RACE_LAPS && RaceService.CURRENT_RACE_LAPS.length > 0) {
            RaceService.currentRaceResult.results = RaceService.raceResult;
            RaceService.currentRaceResult.laps = RaceService.CURRENT_RACE_LAPS.filter(function (lap) {
                return +lap.time > 0;
            });
            RaceService.currentHeat.heatResult = RaceService.currentRaceResult;
            if (RaceService.currentRace.format.toUpperCase() == "QUALIFYING") {
                RaceService.calculateCurrentQualificationResults();
            }
            if (RaceService.currentRace.format.toUpperCase() == "COMPETITION") {
                RaceService.calculateCurrentCompetitionResults();
            }
            RaceService.update(RaceService.currentRace);
        }
        RaceService.reloadAngular();
    };
    RaceService.finish = function () {
        setTimeout(function () {
            TTSService.speakNow("Heat finished!");
        }, 5000);
        RaceService.stopRace();
        WindowConfigService.endRace();
        RaceService.reloadAngular();
        console.log("heat finished");
        //        RaceService.setRaceResult();
    };
    RaceService.calculateCurrentQualificationResults = function () {
        RaceService.currentRace.qualificationResults.length = 0;
        RaceService.currentRace.rounds.forEach(function (round) {
            round.heats.filter(function (h) {
                return h.heatResult != null;
            }).forEach(function (heat) {
                heat.heatResult.results.forEach(function (heatResultEntry) {
                    var found = false;
                    for (var idx in RaceService.currentRace.qualificationResults) {
                        var qualiResultEntry = RaceService.currentRace.qualificationResults[idx];
                        if (qualiResultEntry.pilotUUID == heatResultEntry.pilotUUID) {
                            found = true;
                            qualiResultEntry.lapTimes.push(heatResultEntry.bestRoundTime);
                            qualiResultEntry.lapTimesSum += +heatResultEntry.bestRoundTime;
                        }
                    }
                    if (!found) {
                        var result = new RoundResultEntry({
                            pilotUUID: heatResultEntry.pilotUUID,
                            pilotNumber: heatResultEntry.pilotNumber,
                            pilotName: heatResultEntry.pilotName,
                            lapTimes: [heatResultEntry.bestRoundTime],
                            lapTimesSum: heatResultEntry.bestRoundTime,
                            transponderId: heatResultEntry.deviceId,
                            disqualified: heatResultEntry.disqualified
                        });
                        RaceService.currentRace.qualificationResults.push(result);
                    }
                });
            });
        });
        var rank = 1;
        for (var round = RaceService.currentRace.rounds.length; round > 0; round--) {
            var filteredResults = RaceService.currentRace.qualificationResults.filter(function (result) {
                return result.lapTimes.length == round && !result.disqualified;
            });
            filteredResults.sort(function (a, b) {
                return +a.lapTimesSum - +b.lapTimesSum;
            });
            for (var rIdx in filteredResults) {
                filteredResults[rIdx].rank = rank;
                rank++;
            }
        }
        RaceService.currentRace.qualificationResults.sort(function (a, b) {
            return +a.rank - +b.rank;
        });
    };
    RaceService.calculateCurrentCompetitionResults = function () {
        RaceService.currentRound.competitionResults.length = 0;
        RaceService.currentRound.heats.filter(function (h) {
            return h.heatResult != null;
        }).forEach(function (heat) {
            heat.heatResult.results.forEach(function (heatResultEntry) {
                if (!heatResultEntry.disqualified) {
                    RaceService.currentRound.competitionResults.push(JSON.parse(JSON.stringify(heatResultEntry)));
                }
            });
        });
        RaceService.currentRound.competitionResults.sort(function (a, b) {
            return +a.rank - +b.rank;
        });
        var rank = 1;
        for (var idx in RaceService.currentRound.competitionResults) {
            RaceService.currentRound.competitionResults[idx].rank = rank;
            rank++;
        }
    };
    RaceService.getRaceStatus = function () {
        return RaceService.CURRENT_STATUS;
    };
    RaceService.readyToStartHeat = function (simulation) {
        if (!RaceService.currentRound.countdown || +RaceService.currentRound.countdown < 5) {
            NotificationService.notify("Please set a valid countdown value above 5 seconds!");
            return false;
        }
        if ((!RaceService.currentHeat.pilots || RaceService.currentHeat.pilots.length < 1) && RaceService.currentRace.format.toUpperCase() != 'TRAINING') {
            NotificationService.notify("Please add pilots to your heat!");
            return false;
        }
        if (RaceService.currentRound.roundNumber > 1) {
            if (!RaceService.currentRound.amountOfQualifiedPilots || +RaceService.currentRound.amountOfQualifiedPilots < 1) {
                NotificationService.notify("Please select a valid amount of qualified pilots per round!");
                return false;
            }
        }
        if (!RaceService.currentRound.blockingTime || +RaceService.currentRound.blockingTime < 1) {
            NotificationService.notify("Please set a valid blocking time!");
            return false;
        }
        if (RaceService.currentRace.type.toUpperCase() == "TIME") {
            if (!RaceService.currentRound.duration || +RaceService.currentRound.duration < 1) {
                NotificationService.notify("Please set a valid race duration!");
                return false;
            }
        }
        if (RaceService.currentRace.type.toUpperCase() == "LAPS") {
            //            if (RaceService.currentRound.overTime == null || +RaceService.currentRound.overTime < 0) {
            //                NotificationService.notify("Please set a overtime!");
            //                return false;
            //            }
            if (!RaceService.currentRound.amountOfLaps || +RaceService.currentRound.amountOfLaps < 1) {
                NotificationService.notify("Please set a number of laps!");
                return false;
            }
        }
        if (RaceService.getRaceStatus().raceStarted || RaceService.getRaceStatus().raceCloseable) {
            return false;
        }
        RaceService.currentHeat.pilots.forEach(function (pilot) {
            if (!pilot.deviceId || pilot.deviceId.length < 1) {
                NotificationService.notify("Please make sure all pilots have transponder IDs!");
                return false;
            }
        });
        return true;
    };
    RaceService.startHeat = function (heat, simulation) {
        RaceService.currentHeat = heat;
        WindowConfigService.setCurrentHeat(RaceService.currentHeat.uuid);
        RaceService.finishedPilotsInLapHeat.length = 0;
        if (RaceService.CURRENT_STATUS.startInProgress || !RaceService.readyToStartHeat(simulation)) {
            return;
        }
        RaceService.CURRENT_STATUS.startInProgress = true;
        RaceService.currentRound.timestamp = new Date();
        RaceService.currentRound.countdown = Math.floor(RaceService.currentRound.countdown);
        document.getElementsByClassName("startHeat" + heat.uuid)[0].innerHTML = "" + RaceService.currentRound.countdown;
        RaceService.setPilotsTimingIndex(RaceService.currentHeat.pilots);
        heat.pilots.forEach(function (p) {
            console.log(p.firstName + " " + p.manualTimingIndex);
        });
        RaceService.heatCountdownInterval = setInterval(function () {
            var countdownValue = +document.getElementsByClassName("startHeat" + heat.uuid)[0].innerHTML - 1;
            if (countdownValue < 1) {
                clearInterval(RaceService.heatCountdownInterval);
                countdownValue = "GO";
            }
            else {
            }
            document.getElementsByClassName("startHeat" + heat.uuid)[0].classList.add("show");
            document.getElementsByClassName("startHeat" + heat.uuid)[0].innerHTML = countdownValue;
            setTimeout(function () {
                document.getElementsByClassName("startHeat" + heat.uuid)[0].classList.remove("show");
            }, 800);
        }, 1000);
        RaceService.currentHeat.exactStartTime = new Date().getTime() + (RaceService.currentRound.countdown * 1000);
        RaceService.saveRound();
        DatabaseService.replaceContent(DatabaseService.store_liveResults, [], function (e) { });
        RaceService.countdownTimer = new Timer().startTimer(RaceService.currentRound.countdown * 1000, function () {
            RaceService.CURRENT_STATUS.startInProgress = false;
            clearInterval(RaceService.heatCountdownInterval);
            RaceService.CURRENT_RACE_LAPS.length = 0;
            RaceService.raceResult = [];
            RaceService.currentRaceResult = new RaceResult({});
            if (RaceService.currentRace.type.toUpperCase() == "LAPS") {
                RaceService.currentRound.duration = 999999;
            }
            RaceService.durationTimer = new Timer().startTimer(RaceService.currentRound.duration * 1000, RaceService.finish, true, RaceService.reloadAngular);
            if (!simulation) {
                SerialConnectionService.resetTrackingDevice();
            }
            RaceService.CURRENT_STATUS.maxRoundsReached = false;
            RaceService.CURRENT_STATUS.raceStarted = true;
            RaceService.CURRENT_STATUS.raceCloseable = true;
            if (RaceService.currentRace.format.toUpperCase() == "COMPETITION") {
                RaceService.resultOrder = RaceService.orderByAmountOfRounds;
            }
            else {
                RaceService.resultOrder = RaceService.orderByBestRound;
            }
            RaceService.showRaceResult();
            RaceService.reloadAngular();
            if (simulation) {
                RaceSimulationService.simulateHeat(heat, RaceService.currentRound.duration);
            }
        }, false, null);
    };
    RaceService.getNewRaceAndSetCurrent = function () {
        RaceService.currentRound = RaceService.getNewRound(1);
        return new Race({
            rounds: [],
            classs: RaceService.selectedClass,
            format: RaceService.selectedFormat,
            competitionUUID: RaceService.selectedCompetition.uuid
        });
    };
    RaceService.getNewRace = function () {
        return new Race({
            rounds: [],
            classs: RaceService.selectedClass,
            format: RaceService.selectedFormat,
            competitionUUID: RaceService.selectedCompetition.uuid
        });
    };
    RaceService.getNewRound = function (roundNumber) {
        return new Round({
            countdown: 5,
            duration: 180,
            blockingTime: 5,
            roundNumber: roundNumber,
            amountOfHeats: 1,
            lapDistance: 0,
            overtime: 30,
            timestamp: new Date(),
            amountOfQualifiedPilots: 1,
            heats: [new Heat({ heatNumber: 1 })],
            "type": RaceService.raceTypes[0]
        });
    };
    RaceService.isReady = function () {
        return SerialConnectionService.isReady() && RaceService.currentRace && RaceService.currentRace.type && RaceService.currentRace.format;
    };
    RaceService.downloadQualificationResult = function () {
        var spans = document.getElementById("qualificationResultTable").getElementsByTagName("span");
        var csv = "";
        csv += "Event:;" + RaceService.selectedCompetition.description + "\n";
        csv += "Format:;" + RaceService.currentRace.format + "\n";
        csv += "Class:;" + RaceService.currentRace.classs.name + "\n";
        csv += "Type:;" + RaceService.currentRace.type + "\n";
        if (RaceService.currentRace.type.toUpperCase() == "TIME") {
            csv += "Race Duration:;" + RaceService.currentRound.duration + "\n";
        }
        if (RaceService.currentRace.type.toUpperCase() == "LAPS") {
            csv += "Amount Of Laps:;" + RaceService.currentRound.amountOfLaps + "\n";
        }
        if (RaceService.currentRound.lapDistance > 0) {
            csv += "Lap Distance:;" + RaceService.currentRound.lapDistance + "\n";
        }
        if (RaceService.currentRound.description) {
            csv += "Description:;" + RaceService.currentRound.description + "\n";
        }
        csv += "\n";
        for (var idx in spans) {
            if (typeof spans[idx].innerHTML == "undefined") {
                break;
            }
            if (spans[idx].innerHTML.indexOf("[") > -1) {
                csv += "\n";
            }
            csv += spans[idx].innerText + ";";
        }
        var blobdata = new Blob([csv], { type: 'text/csv' });
        var filename = "qualification_result_(" + new Date().toJSON() + ").csv";
        filename = filename.replace(" ", "");
        var link = document.createElement("a");
        link.setAttribute("href", window.URL.createObjectURL(blobdata));
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        NotificationService.notify(NotificationService.fileDownloadText);
    };
    RaceService.download = function () {
        var spans = document.getElementById("raceResult").getElementsByTagName("span");
        var csv = "";
        csv += "Event:;" + RaceService.selectedCompetition.description + "\n";
        csv += "Format:;" + RaceService.currentRace.format + "\n";
        csv += "Class:;" + RaceService.currentRace.classs.name + "\n";
        csv += "Type:;" + RaceService.currentRace.type + "\n";
        csv += "Round:;" + RaceService.currentRound.roundNumber + "\n";
        csv += "Heat:;" + RaceService.currentHeat.heatNumber + "/" + RaceService.currentRound.amountOfHeats + "\n\n";
        if (RaceService.currentRace.type.toUpperCase() == "TIME") {
            csv += "Race Duration:;" + RaceService.currentRound.duration + "\n";
        }
        if (RaceService.currentRace.type.toUpperCase() == "LAPS") {
            csv += "Amount Of Laps:;" + RaceService.currentRound.amountOfLaps + "\n";
        }
        if (RaceService.currentRound.lapDistance > 0) {
            csv += "Lap Distance:;" + RaceService.currentRound.lapDistance + "\n";
        }
        if (RaceService.currentRound.description) {
            csv += "Description:;" + RaceService.currentRound.description + "\n";
        }
        csv += "\n";
        for (var idx in spans) {
            if (typeof spans[idx].innerHTML == "undefined") {
                break;
            }
            csv += spans[idx].innerHTML;
            if ((+idx + 1) % 7 == 0) {
                csv += "\n";
            }
            else {
                csv += ";";
            }
        }
        var blobdata = new Blob([csv], { type: 'text/csv' });
        var filename = "race_result_(" + new Date().toJSON() + ").csv";
        filename = filename.replace(" ", "");
        var link = document.createElement("a");
        link.setAttribute("href", window.URL.createObjectURL(blobdata));
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        NotificationService.notify(NotificationService.fileDownloadText);
    };
    RaceService.devicePassed = function (info, manualTiming) {
        //<01>@<09>204<09>XXXXXXX<09>SECS.MSS<13><10>
        if (RaceService.CURRENT_STATUS.readDevice && SerialConnectionService.isReady() && !manualTiming) {
            if (info[2]) {
                SoundService.playBeep();
                RaceService.pilotToScan.deviceId = info[2];
                PilotService.scanTimer.value = 0;
                RaceService.CURRENT_STATUS.readDevice = false;
                PilotService.update(RaceService.pilotToScan);
                RaceService.reloadAngular();
            }
        }
        else if (RaceService.CURRENT_STATUS.raceStarted) {
            if (info[0].indexOf("%") != -1 && info[2].indexOf("0") != -1 && info[3].indexOf("0") != -1) {
                //reset: 1, 37, 9, HW_ID, 9, 48, 9, 48, 13, 10
                //pass: 1, 64, 9, HW_ID, 9, TRANSPONDER_ID, 9, SECS.MSS, 13, 10
                return; //just the device reset response
            }
            SoundService.playBeep();
            var pilot = null;
            if (manualTiming) {
                pilot = RaceService.getCompetingPilotToManualTimingIndex(info[2]);
            }
            else {
                pilot = RaceService.getCompetingPilotToDeviceId(info[2]);
            }
            if (pilot != null) {
                RaceService.generateLap(pilot, info[3]);
            }
            else {
            }
        }
        else if (!manualTiming && !SerialConnectionService.isReady() && info[0].indexOf("%") != -1 && info[2].indexOf("0") != -1 && info[3].indexOf("0") != -1 && info.length == 4) {
            SoundService.playBeep();
            SerialConnectionService.DEVICE = SerialConnectionService.DEVICE_TO_VERIFY;
            RaceService.CURRENT_STATUS.deviceNotReady = false;
            NotificationService.notify("USB device connected.");
        }
    };
    RaceService.generateLap = function (pilot, timestamp) {
        if (!pilot || RaceService.CURRENT_STATUS.raceStarted == false) {
            return;
        }
        var laps = RaceService.CURRENT_RACE_LAPS.filter(function (lap) {
            return lap.pilotUUID == pilot.uuid;
        });
        if (RaceService.currentRace.type.toUpperCase() == "LAPS") {
            if (RaceService.finishedPilotsInLapHeat.indexOf(pilot) != -1) {
                //Type: Laps ... a pilot allready finished line
                return;
            }
            if (RaceService.CURRENT_STATUS.maxRoundsReached) {
                RaceService.finishedPilotsInLapHeat.push(pilot);
            }
        }
        var lastEndTime = 0.0;
        laps.forEach(function (lap) {
            if (+lap.endTime > lastEndTime) {
                lastEndTime = +lap.endTime;
            }
        });
        //RaceService check needs to be done before next if( lastEndTime = 0.0 for competition ) because otherwise first round can be messed up!
        if (laps.length > 0 && (+timestamp) < (lastEndTime + (+RaceService.currentRound.blockingTime))) {
            NotificationService.notify("blocked round: blocking time!");
            return;
        }
        //needs to be done after blocking time check, see comment for blocking time check!
        if (laps.length == 1 && RaceService.currentRace.format.toUpperCase() === "COMPETITION") {
            lastEndTime = 0.0;
        }
        var time = (laps.length == 0) ? 0. : Math.floor(1000. * (+timestamp - lastEndTime)) / 1000.;
        var lap = new Lap({
            raceUUID: RaceService.currentRace.uuid,
            pilotUUID: pilot.uuid,
            pilotName: "[" + pilot.pilotNumber + "] " + pilot.firstName + " " + pilot.lastName,
            lapNumber: laps.length,
            startTime: lastEndTime,
            endTime: timestamp,
            time: time,
            totalTime: time,
            startTimestamp: new Date().getTime()
        });
        RaceService.CURRENT_RACE_LAPS.push(lap);
        if (RaceService.currentRace.type.toUpperCase() == "LAPS") {
            if (laps.length >= RaceService.currentRound.amountOfLaps && !RaceService.CURRENT_STATUS.maxRoundsReached) {
                RaceService.CURRENT_STATUS.maxRoundsReached = true;
                RaceService.finishedPilotsInLapHeat.push(pilot);
            }
            if (RaceService.CURRENT_STATUS.maxRoundsReached) {
                RaceService.setRaceStopable();
            }
        }
        RaceResultService.calculateRaceResult(RaceService.raceResult, RaceService.currentRace, RaceService.currentHeat, RaceService.CURRENT_RACE_LAPS);
        RaceService.setRaceResult();
        DatabaseService.replaceContent(DatabaseService.store_liveResults, RaceService.raceResult, function (e) { });
        if (lap.time > 0) {
            TTSService.pilotPassedGate(pilot.firstName + " " + pilot.lastName, laps.length, lap.time);
        }
    };
    RaceService.mockPilotPassing = function (pilot, time) {
        if (RaceService.CURRENT_STATUS.raceStarted) {
            RaceService.generateLap(pilot, time);
        }
    };
    RaceService.mockTransponderPassing = function (deviceId, time) {
        if (RaceService.CURRENT_STATUS.raceStarted) {
            //<01>@<09>204<09>XXXXXXX<09>SECS.MSS<13><10>
            //info[0].indexOf("%") != -1 && info[1].indexOf("20") != -1 && info[2].indexOf("0") != -1 && info[3].indexOf("0")
            RaceService.devicePassed(["%", "204", "" + deviceId, "" + time], false);
        }
    };
    RaceService.mockRace = function () {
        for (var i = 0; i < 10; i++) {
            RaceService.currentHeat.pilots.forEach(function (p) {
                if (Math.random() < 0.5) {
                    RaceService.generateLap(p, "" + (10 * i + (1 - Math.random())));
                }
            });
        }
    };
    RaceService.getCompetingPilotToDeviceId = function (deviceId) {
        for (var idx in RaceService.currentHeat.pilots) {
            if (RaceService.currentHeat.pilots[idx].deviceId == deviceId) {
                return RaceService.currentHeat.pilots[idx];
            }
        }
        if (RaceService.currentRace.format.toUpperCase() == "TRAINING") {
            var pilot = new Pilot({
                uuid: "MOCK_" + deviceId,
                firstName: "Pilot",
                lastName: deviceId,
                deviceId: deviceId,
                pilotNumber: 0
            });
            RaceService.currentHeat.pilots.push(pilot);
            return pilot;
        }
        return null;
    };
    RaceService.getCompetingPilotToManualTimingIndex = function (index) {
        for (var idx in RaceService.currentHeat.pilots) {
            if (RaceService.currentHeat.pilots[idx].manualTimingIndex == index) {
                return RaceService.currentHeat.pilots[idx];
            }
        }
        if (RaceService.currentRace.format.toUpperCase() == "TRAINING") {
            var pilot = new Pilot({
                uuid: "MOCK_" + index,
                firstName: "Pilot",
                lastName: index,
                deviceId: index,
                manualTimingIndex: index,
                pilotNumber: 0
            });
            RaceService.currentHeat.pilots.push(pilot);
            return pilot;
        }
        return null;
    };
    RaceService.update = function (race) {
        DatabaseService.save(DatabaseService.store_races, race, function (x) {
            if (RaceService.races.indexOf(race) == -1) {
                RaceService.races.push(race);
            }
        }, function (e) {
            console.log("ex", e);
        });
    };
    RaceService.delete = function (race, callback) {
        try {
            DatabaseService.delete(DatabaseService.store_races, race, function () {
                RaceService.races.splice(RaceService.races.indexOf(race), 1);
                callback();
                RaceService.reloadAngular();
                NotificationService.notify("Race deleted!");
            }, function () {
            });
        }
        catch (ex) {
        }
    };
    RaceService.deleteHeat = function (raceUUID, heatUUID, callback) {
        try {
            RaceService.races.forEach(function (race) {
                if (race.uuid == raceUUID) {
                    race.rounds.forEach(function (round) {
                        round.heats.forEach(function (heat) {
                            if (heat.uuid == heatUUID) {
                                heat.heatResult = null;
                                RaceService.update(race);
                                callback();
                                return;
                            }
                        });
                    });
                }
            });
        }
        catch (ex) {
            return;
        }
    };
    RaceService.setRaces = function (races) {
        RaceService.races.length = 0;
        Array.prototype.push.apply(RaceService.races, races);
        RaceService.findCurrentRace();
        RaceService.reloadAngular();
    };
    RaceService.reloadAngular = function () {
        if (!angular.element(document.getElementById('races')).scope().$$phase) {
            angular.element(document.getElementById('races')).scope().$apply();
        }
        else {
            console.log("reload angular failed!!!");
            setTimeout(RaceService.reloadAngular, 200);
        }
    };
    RaceService.pilotToScan = null;
    RaceService.CURRENT_STATUS = {
        startInProgress: false,
        deviceNotReady: true,
        raceStarted: false,
        readDevice: false,
        raceCloseable: false,
        maxRoundsReached: false,
        showTotalQualificationResult: false
    };
    RaceService.CURRENT_RACE_LAPS = [];
    RaceService.races = [];
    RaceService.newCompetition = new Competition({});
    RaceService.selectedCompetition = null;
    RaceService.raceTypes = ["Time", "Laps"];
    RaceService.raceFormats = ["Training", "Qualifying", "Competition"];
    RaceService.orderByBestRound = ["+bestRoundTimeComputed()"];
    RaceService.orderByAmountOfRounds = ['-amountOfLaps', '+totalTimeComputed()'];
    RaceService.resultOrder = ["-amountOfLaps"];
    RaceService.raceResult = [];
    RaceService.raceDurationInterval = null;
    RaceService.heatCountdownInterval = null;
    RaceService.pilotSelectionOrder = ['+firstName', '+lastName'];
    RaceService.availableRoundNumbers = [1];
    RaceService.currentRoundNumber = 1;
    RaceService.selectedFormat = RaceService.raceFormats[0];
    RaceService.currentRace = null;
    RaceService.currentRound = null;
    RaceService.previousRound = null;
    RaceService.currentHeat = null;
    RaceService.currentCompetitionUUID = "";
    RaceService.qualificationResultOfCurrentRace = [];
    RaceService.pilotToMove = null;
    RaceService.pilotToMoveOrigin = null;
    RaceService.heatToEdit = null;
    RaceService.finishedPilotsInLapHeat = [];
    RaceService.resultToEdit = null;
    RaceService.heatForPenalty = null;
    RaceService.currentRaceResult = null;
    return RaceService;
}());
/// <reference path="../_reference.ts"/>
var TTSService = (function () {
    function TTSService() {
    }
    TTSService.speak = function (text) {
        if (!TTSService.ttsEnabled.value) {
            chrome.tts.stop();
            return;
        }
        chrome.tts.speak(text, { rate: 0.85, gender: TTSService.gender, 'lang': TTSService.language, 'enqueue': true, voiceName: TTSService.voiceName });
    };
    TTSService.speakStartHeatCountdown = function (text) {
        if (!TTSService.ttsEnabled.value) {
            chrome.tts.stop();
            return;
        }
        chrome.tts.stop();
        chrome.tts.speak(text, { gender: TTSService.gender, 'lang': TTSService.language, 'enqueue': true, voiceName: TTSService.voiceName });
    };
    TTSService.speakNow = function (text) {
        if (!TTSService.ttsEnabled.value) {
            chrome.tts.stop();
            return;
        }
        chrome.tts.stop();
        chrome.tts.speak(text, { gender: TTSService.gender, 'lang': TTSService.language, 'enqueue': true, voiceName: TTSService.voiceName });
    };
    TTSService.pilotPassedGate = function (pilotName, lapNumber, lapTime) {
        TTSService.speak(pilotName + ", lap" + lapNumber + " with " + lapTime + " seconds");
    };
    TTSService.gender = "female";
    TTSService.voiceName = "";
    TTSService.ttsEnabled = { value: true };
    TTSService.language = "en";
    return TTSService;
}());
/// <reference path="../_reference.ts"/>
var ClassService = (function () {
    function ClassService() {
    }
    ClassService.init = function (callback) {
        ClassService.newClass = new Classs({});
        DatabaseService.readAll(DatabaseService.store_classes, function (classes) {
            ClassService.setClasses(classes);
            if (callback)
                callback();
        });
    };
    ClassService.getFirstClass = function () {
        if (ClassService.classes && ClassService.classes.length > 0) {
            return ClassService.classes[0];
        }
        return null;
    };
    ClassService.getClassByUUID = function (uuid) {
        for (var idx in ClassService.classes) {
            if (ClassService.classes[idx].uuid == uuid) {
                return ClassService.classes[idx];
            }
        }
        return null;
    };
    ClassService.delete = function (classs) {
        DatabaseService.delete(DatabaseService.store_classes, classs, function (e) {
            NotificationService.notify("Class deleted!");
            for (var idx in ClassService.classes) {
                if (ClassService.classes[idx].uuid == classs.uuid) {
                    if (RaceService.selectedClass && RaceService.selectedClass.uuid == classs.uuid) {
                        RaceService.selectedClass = null;
                    }
                    if (PilotService.selectedClass && PilotService.selectedClass.uuid == classs.uuid) {
                        PilotService.selectedClass = null;
                    }
                    ClassService.classes.splice(idx, 1);
                    ClassService.reloadAngular();
                    break;
                }
            }
        }, function () { });
    };
    ClassService.classUpdated = function (classs) {
        if (classs.name.length > 0) {
            DatabaseService.save(DatabaseService.store_classes, classs, function (e) {
                NotificationService.notify("Class updated!");
                PilotService.pilots.forEach(function (pilot) {
                    if (pilot.classs && pilot.classs.uuid == classs.uuid) {
                        pilot.classs = classs;
                        PilotService.update(pilot);
                    }
                });
                RaceService.races.forEach(function (race) {
                    if (race.classs.uuid == classs.uuid) {
                        race.classs = classs;
                        RaceService.update(race);
                    }
                });
                CompetitionService.competitions.forEach(function (competition) {
                    competition.classes.forEach(function (competitionClasss) {
                        if (competitionClasss.uuid == competitionClasss.uuid) {
                            competitionClasss = classs;
                            CompetitionService.update(competition);
                        }
                    });
                });
            }, function () { });
        }
    };
    ClassService.classCreated = function () {
        if (ClassService.newClass.name && ClassService.newClass.name.length > 0) {
            DatabaseService.save(DatabaseService.store_classes, ClassService.newClass, function (e) {
                ClassService.classes.push(new Classs(ClassService.newClass));
                ClassService.newClass.name = "";
                ClassService.newClass.uuid = UUIDService.next();
                NotificationService.notify("Class updated!");
            }, function () { });
        }
        else {
            NotificationService.notify("Please enter a valid value!");
        }
    };
    ClassService.setClasses = function (classes) {
        for (var classNewIdx in classes) {
            var found = false;
            for (var classOldIdx in ClassService.classes) {
                if (ClassService.classes[classOldIdx].uuid == classes[classNewIdx].uuid) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                ClassService.classes.push(new Classs(classes[classNewIdx]));
            }
        }
        if (ClassService.classes.length == 0) {
            DatabaseFillingService.fillDefaultClasses(ClassService.init);
        }
    };
    ClassService.reloadAngular = function () {
        if (!angular.element(document.getElementById('classes')).scope().$$phase) {
            angular.element(document.getElementById('classes')).scope().$apply();
        }
        else {
            console.log("reload angular failed!!!");
            setTimeout(ClassService.reloadAngular, 200);
        }
    };
    ClassService.classes = [];
    ClassService.newClass = null;
    return ClassService;
}());
/// <reference path="../_reference.ts"/>
var DatabaseFillingService = (function () {
    function DatabaseFillingService() {
    }
    DatabaseFillingService.fillDefaultRaceBands = function (callback) {
        DatabaseService.save(DatabaseService.store_raceBands, new RaceBand({
            value: "Race Band 1"
        }), function () { }, function () { });
        DatabaseService.save(DatabaseService.store_raceBands, new RaceBand({
            value: "Race Band 2"
        }), function () { }, function () { });
        DatabaseService.save(DatabaseService.store_raceBands, new RaceBand({
            value: "Race Band 3"
        }), function () { }, function () { });
        DatabaseService.save(DatabaseService.store_raceBands, new RaceBand({
            value: "Race Band 4"
        }), function () { callback(); }, function () { });
    };
    DatabaseFillingService.fillDefaultClasses = function (callback) {
        DatabaseService.save(DatabaseService.store_classes, new Classs({
            name: "MINI 250"
        }), function () { }, function () { });
        DatabaseService.save(DatabaseService.store_classes, new Classs({
            name: "Super MINI 330"
        }), function () { }, function () { });
        DatabaseService.save(DatabaseService.store_classes, new Classs({
            name: "STANDARD 600"
        }), function () { callback(); }, function () { });
    };
    DatabaseFillingService.fillDefaultCompetitions = function (callback) {
        if (ClassService.classes && ClassService.classes.length > 0 && PilotService.pilots && PilotService.pilots.length > 1) {
            var competition = new Competition({
                "description": "My Sample Competition",
                "dateFrom": "2015-12-24T07:00:00.000Z",
                "dateTo": "2015-12-25T17:00:00.000Z",
                "location": "Linz, Austria",
                "pilots": [],
                "competitionConfigs": []
            });
            var classs = ClassService.classes[0];
            competition.competitionConfigs.push(new CompetitionConfig({ classs: classs }));
            competition.classes.push(classs);
            var pilotCopy = new Pilot(PilotService.pilots[0]);
            pilotCopy.classs = classs;
            competition.pilots.push(pilotCopy);
            var pilotCopy = new Pilot(PilotService.pilots[1]);
            pilotCopy.classs = classs;
            competition.pilots.push(pilotCopy);
            var race1 = new Race({
                rounds: [RaceService.getNewRound(1)],
                classs: classs,
                'type': RaceService.raceTypes[0],
                format: RaceService.raceFormats[0],
                competitionUUID: competition.uuid
            });
            var race2 = new Race({
                rounds: [RaceService.getNewRound(1)],
                classs: classs,
                'type': RaceService.raceTypes[0],
                format: RaceService.raceFormats[1],
                competitionUUID: competition.uuid
            });
            var race3 = new Race({
                rounds: [RaceService.getNewRound(1)],
                classs: classs,
                'type': RaceService.raceTypes[0],
                format: RaceService.raceFormats[2],
                competitionUUID: competition.uuid
            });
            DatabaseService.save(DatabaseService.store_races, race3, function () {
                DatabaseService.save(DatabaseService.store_competitions, competition, function () {
                    DatabaseService.save(DatabaseService.store_races, race1, function () {
                        DatabaseService.save(DatabaseService.store_races, race2, function () {
                            callback();
                        }, function () { });
                    }, function () { });
                }, function () { });
            }, function () { });
        }
    };
    DatabaseFillingService.fillDefaultPilots = function (callback) {
        DatabaseService.save(DatabaseService.store_pilots, new Pilot({
            firstName: "Pilot",
            lastName: "01",
            alias: "sample1",
            country: "Austria",
            deviceId: "0000000",
            pilotNumber: "1"
        }), function () { }, function () { });
        DatabaseService.save(DatabaseService.store_pilots, new Pilot({
            firstName: "Pilot",
            lastName: "02",
            alias: "sample2",
            country: "Austria",
            deviceId: "0000001",
            pilotNumber: "2"
        }), function () { callback(); }, function () { });
    };
    DatabaseFillingService.fillDefaultUser = function (callback) {
        DatabaseService.save(DatabaseService.store_user, new User({
            name: "",
            passwordHash: ""
        }), function () { callback(); }, function () { });
    };
    return DatabaseFillingService;
}());
/// <reference path="../_reference.ts"/>
var NotificationService = (function () {
    function NotificationService() {
    }
    NotificationService.notify = function (notification) {
        try {
            NotificationService.notification.text = notification;
            NotificationService.showNotificationBox();
        }
        catch (e) {
        }
    };
    NotificationService.showNotificationBox = function () {
        document.getElementById("notificationBox").classList.remove("removed");
        if (!angular.element(document.getElementById('notificationBox')).scope().$$phase) {
            angular.element(document.getElementById('notificationBox')).scope().$apply();
        }
        else {
            setTimeout(NotificationService.showNotificationBox, 200);
        }
        setTimeout(function () {
            NotificationService.hideConfirmBox();
        }, 5000);
    };
    NotificationService.hideConfirmBox = function () {
        NotificationService.notification.text = "";
        document.getElementById("notificationBox").classList.add("removed");
    };
    NotificationService.notification = { text: "" };
    NotificationService.fileDownloadText = "The data has been loaded into your default Downloads-Folder!";
    return NotificationService;
}());
/// <reference path="../_reference.ts"/>
var SerialConnectionService = (function () {
    function SerialConnectionService() {
    }
    SerialConnectionService.init = function () {
        if (SERIAL_ENABLED) {
            SerialConnectionService.RECIEVER_SEARCH_INTERVAL = setInterval(SerialConnectionService.lookForDevices, 2000);
            chrome.serial.onReceive.addListener(SerialConnectionService.onReceive);
            chrome.serial.onReceiveError.addListener(function (info) {
                console.error("error: ", info);
                SerialConnectionService.DEVICE = null;
                SerialConnectionService.CONNECTION_ID = null;
                RaceService.CURRENT_STATUS.deviceNotReady = true;
                SerialConnectionService.DEVICES.length = null;
                NotificationService.notify("ERROR: USB connection interrupted, please re-connect and retry your race!!");
                angular.element(document.getElementById('usb')).scope().$apply();
            });
        }
    };
    SerialConnectionService.mockOnReceive = function (dataString) {
        SerialConnectionService.onReceive({
            data: SerialConnectionService.str2ab(dataString)
        });
    };
    SerialConnectionService.onReceive = function (info) {
        //<01>@<09>204<09>XXXXXXX<09>SECS.MSS<13><10>
        var msg = SerialConnectionService.ab2str(info.data);
        SerialConnectionService.SCAN_STRING += msg;
        var currentIndex = SerialConnectionService.MESSAGES.length - 1;
        for (var i = 0, strLen = msg.length; i < strLen; i++) {
            if (msg.charCodeAt(i) == 0) {
                continue;
            }
            if (msg.charCodeAt(i) == 1) {
                currentIndex++;
                SerialConnectionService.MESSAGES[currentIndex] = "";
            }
            else if (currentIndex > -1) {
                SerialConnectionService.MESSAGES[currentIndex] += msg[i];
                if (SerialConnectionService.MESSAGES[currentIndex].indexOf(String.fromCharCode(13) + "" + String.fromCharCode(10)) != -1) {
                    RaceService.devicePassed(SerialConnectionService.MESSAGES[currentIndex].split(String.fromCharCode(9)), false);
                }
            }
        }
    };
    SerialConnectionService.lookForDevices = function () {
        if (!SerialConnectionService.isReady()) {
            chrome.serial.getDevices(SerialConnectionService.findReciverSerialDevice);
        }
    };
    SerialConnectionService.isReady = function () {
        if (!SERIAL_ENABLED) {
            return true;
        }
        else {
            return (SerialConnectionService.DEVICE && SerialConnectionService.CONNECTION_ID) ? true : false;
        }
        //return SerialConnectionService.CONNECTION_ID && SerialConnectionService.DEVICE;
    };
    SerialConnectionService.resetTrackingDevice = function () {
        if (SERIAL_ENABLED && SerialConnectionService.CONNECTION_ID) {
            SerialConnectionService.MESSAGES = [];
            SerialConnectionService.SCAN_STRING = "";
            chrome.serial.send(SerialConnectionService.CONNECTION_ID, SerialConnectionService.str2ab(SerialConnectionService.INIT_TIMER_STRING), function (sendInfo) {
                chrome.serial.flush(SerialConnectionService.CONNECTION_ID, function callback(result) {
                });
            });
        }
    };
    SerialConnectionService.connectToDevice = function () {
        if (SERIAL_ENABLED) {
            if (SERIAL_ENABLED) {
                chrome.serial.getConnections(function (connections) {
                    connections.forEach(function (con) {
                        chrome.serial.disconnect(con.connectionId, function (x) { });
                    });
                });
                setTimeout(function () {
                    chrome.serial.connect(SerialConnectionService.DEVICE_TO_VERIFY.path, {
                        bitrate: 9600,
                        bufferSize: 4096,
                        dataBits: "eight",
                        parityBit: "no",
                        stopBits: "one",
                        ctsFlowControl: false
                    }, function (info) {
                        SerialConnectionService.CONNECTION_ID = info.connectionId;
                        chrome.serial.setControlSignals(SerialConnectionService.CONNECTION_ID, { rts: false }, function (c) {
                            SerialConnectionService.resetTrackingDevice();
                        });
                    });
                }, 1500);
            }
        }
    };
    SerialConnectionService.selectDevice = function (device) {
        if (device == SerialConnectionService.DEVICE) {
            chrome.serial.disconnect(SerialConnectionService.CONNECTION_ID, function (data) {
                SerialConnectionService.DEVICE = null;
                SerialConnectionService.CONNECTION_ID = null;
                SerialConnectionService.DEVICES.length = null;
                SerialConnectionService.lookForDevices();
                NotificationService.notify("disconnected from USB device!");
            });
        }
        else {
            SerialConnectionService.DEVICE_TO_VERIFY = device;
            SerialConnectionService.connectToDevice();
        }
    };
    SerialConnectionService.findReciverSerialDevice = function (devices) {
        if (SERIAL_ENABLED) {
            if (devices.length == 0) {
                SerialConnectionService.DEVICES.length = 0;
                angular.element(document.getElementById('usb')).scope().$apply();
            }
            else {
                for (var idx2 in SerialConnectionService.DEVICES) {
                    var contained = false;
                    for (var idx in devices) {
                        if (JSON.stringify(devices[idx]) == JSON.stringify(SerialConnectionService.DEVICES[idx2])) {
                            contained = true;
                        }
                    }
                    if (!contained) {
                        SerialConnectionService.DEVICES.splice(idx2, 1);
                        angular.element(document.getElementById('usb')).scope().$apply();
                    }
                }
                for (var idx in devices) {
                    var contained = false;
                    for (var idx2 in SerialConnectionService.DEVICES) {
                        if (JSON.stringify(devices[idx]) == JSON.stringify(SerialConnectionService.DEVICES[idx2])) {
                            contained = true;
                        }
                    }
                    if (!contained) {
                        SerialConnectionService.DEVICES.push(devices[idx]);
                        angular.element(document.getElementById('usb')).scope().$apply();
                    }
                }
            }
        }
    };
    SerialConnectionService.ab2str = function (buf) {
        return String.fromCharCode.apply(null, new Uint8Array(buf));
    };
    SerialConnectionService.str2ab = function (str) {
        var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
        var bufView = new Uint8Array(buf);
        for (var i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    };
    SerialConnectionService.INIT_TIMER_STRING = String.fromCharCode(1) + String.fromCharCode(37) + String.fromCharCode(13) + String.fromCharCode(10);
    SerialConnectionService.DEVICE = null;
    SerialConnectionService.CONNECTION_ID = null;
    SerialConnectionService.RECIEVER_SEARCH_INTERVAL = null;
    SerialConnectionService.RECIEVER_SEARCH_CONTROL_INTERVAL = null;
    SerialConnectionService.DEVICES = [];
    SerialConnectionService.SCAN_STRING = "";
    SerialConnectionService.MESSAGES = [];
    return SerialConnectionService;
}());
/// <reference path="../_reference.ts"/>
var UserService = (function () {
    function UserService() {
    }
    UserService.register = function () {
        UserService.user.registered = true;
        UserService.saveCurrentUser();
        CompetitionService.init(null);
        RaceService.init(null);
        //TODO: are race bands and classes and pilots available after initializaton of database ?????
        //TODO: is obfuscation possible ????
        document.getElementById("welcome").classList.add("removed");
    };
    UserService.init = function (callback) {
        DatabaseService.readAll(DatabaseService.store_user, function (user) {
            UserService.setUser(user);
            if (callback)
                callback();
        });
    };
    UserService.saveCurrentUser = function () {
        DatabaseService.save(DatabaseService.store_user, UserService.user, function (e) {
            CloudSyncService.tryToSync();
        }, function (e) {
        });
    };
    UserService.setUser = function (users) {
        UserService.user = (users && users.length == 1) ? users[0] : null;
        if (!UserService.user) {
            DatabaseFillingService.fillDefaultUser(UserService.init);
        }
    };
    UserService.user = null;
    return UserService;
}());
/// <reference path="../_reference.ts"/>
var CloudSyncService = (function () {
    function CloudSyncService() {
    }
    CloudSyncService.init = function () {
        CloudSyncService.syncInterval = setInterval(CloudSyncService.tryToSync, CloudSyncService.syncIntervalTime);
        CloudSyncService.status.online = navigator.onLine;
        window.addEventListener('online', CloudSyncService.notifyOnline);
        window.addEventListener('offline', CloudSyncService.notifyOffline);
    };
    CloudSyncService.notifyOnline = function () {
        CloudSyncService.status.online = true;
        CloudSyncService.reloadAngular();
    };
    CloudSyncService.notifyOffline = function () {
        CloudSyncService.status.online = false;
        CloudSyncService.reloadAngular();
    };
    CloudSyncService.accountTransferInit = function () {
        ConfirmationService.pleaseConfirm(CloudSyncService.confirmAccountTransferInit, function () { });
    };
    CloudSyncService.confirmAccountTransferInit = function () {
        AjaxService.send(CloudSyncService.getPathWithUser(AjaxService.path_createAccountTransfer), null, function (result) {
            if (result.status == 'SUCCESS') {
                DatabaseService.replaceContent(DatabaseService.store_competitions, [], function () {
                    DatabaseService.replaceContent(DatabaseService.store_races, [], function () {
                        DatabaseService.replaceContent(DatabaseService.store_pilots, [], function () {
                            DatabaseService.replaceContent(DatabaseService.store_classes, [], function () {
                                DatabaseService.replaceContent(DatabaseService.store_raceBands, [], function () {
                                    DatabaseService.replaceContent(DatabaseService.store_user, [], function () {
                                        CloudSyncService.status.blockScreen = true;
                                        CloudSyncService.status.message = "Request completed, all your local data has been deleted and is available to be transfered! Please move to the other computer and restore your data!";
                                        CloudSyncService.reloadAngular();
                                    });
                                });
                            });
                        });
                    });
                });
            }
        });
    };
    CloudSyncService.restoreAccount = function () {
        if (!CloudSyncService.verificationCode || CloudSyncService.verificationCode.length < 10) {
            NotificationService.notify("Please enter a valid Verification Code!");
            return;
        }
        ConfirmationService.pleaseConfirm(CloudSyncService.confirmRestoreAccount, function () { });
    };
    CloudSyncService.readyToTransferAccount = function () {
        DatabaseService.allColumnsSynced(DatabaseService.store_competitions, function (allSynced) {
            if (allSynced) {
                DatabaseService.allColumnsSynced(DatabaseService.store_races, function (allSynced) {
                    if (allSynced) {
                        DatabaseService.allColumnsSynced(DatabaseService.store_pilots, function (allSynced) {
                            if (allSynced) {
                                DatabaseService.allColumnsSynced(DatabaseService.store_classes, function (allSynced) {
                                    if (allSynced) {
                                        DatabaseService.allColumnsSynced(DatabaseService.store_raceBands, function (allSynced) {
                                            if (allSynced) {
                                                DatabaseService.allColumnsSynced(DatabaseService.store_user, function (allSynced) {
                                                    if (allSynced) {
                                                        CloudSyncService.status.transferPossible = true;
                                                        CloudSyncService.reloadAngular();
                                                    }
                                                    else {
                                                        CloudSyncService.status.transferPossible = false;
                                                        CloudSyncService.reloadAngular();
                                                    }
                                                });
                                            }
                                            else {
                                                CloudSyncService.status.transferPossible = false;
                                                CloudSyncService.reloadAngular();
                                            }
                                        });
                                    }
                                    else {
                                        CloudSyncService.status.transferPossible = false;
                                        CloudSyncService.reloadAngular();
                                    }
                                });
                            }
                            else {
                                CloudSyncService.status.transferPossible = false;
                                CloudSyncService.reloadAngular();
                            }
                        });
                    }
                    else {
                        CloudSyncService.status.transferPossible = false;
                        CloudSyncService.reloadAngular();
                    }
                });
            }
            else {
                CloudSyncService.status.transferPossible = false;
                CloudSyncService.reloadAngular();
            }
        });
    };
    CloudSyncService.confirmRestoreAccount = function () {
        AjaxService.send(CloudSyncService.getPathWithUser(AjaxService.path_transferAccount) + "/" + CloudSyncService.verificationCode.trim(), null, function (result) {
            if (result.status != "ERROR") {
                DatabaseService.replaceContent(DatabaseService.store_user, result.users, function () {
                    DatabaseService.replaceContent(DatabaseService.store_classes, result.classes, function () {
                        DatabaseService.replaceContent(DatabaseService.store_raceBands, result.raceBands, function () {
                            DatabaseService.replaceContent(DatabaseService.store_pilots, result.pilots, function () {
                                DatabaseService.replaceContent(DatabaseService.store_competitions, result.competitions, function () {
                                    DatabaseService.replaceContent(DatabaseService.store_races, result.races, function () {
                                        CloudSyncService.status.blockScreen = true;
                                        CloudSyncService.status.message = "Account restoration completed, all your data has been re-created! Please restart the FPV Race Tracker!";
                                        CloudSyncService.reloadAngular();
                                    });
                                });
                            });
                        });
                    });
                });
            }
        });
    };
    CloudSyncService.tryToSync = function () {
        //TODO: not logged in ??? what to do ???
        if (navigator.onLine) {
            try {
                CloudSyncService.doSync();
            }
            catch (ex) {
                console.log("sync error", ex);
            }
        }
        else {
        }
    };
    CloudSyncService.resetAllSyncForDeveloper = function () {
        DatabaseService.resetAllSyncRecords(DatabaseService.store_pilots);
        DatabaseService.resetAllSyncRecords(DatabaseService.store_competitions);
        DatabaseService.resetAllSyncRecords(DatabaseService.store_races);
        DatabaseService.resetAllSyncRecords(DatabaseService.store_raceBands);
        DatabaseService.resetAllSyncRecords(DatabaseService.store_classes);
        DatabaseService.resetAllSyncRecords(DatabaseService.store_user);
    };
    CloudSyncService.doSync = function () {
        DatabaseService.readAllUpdatesForSync(DatabaseService.store_user, CloudSyncService.processUserToSync);
    };
    CloudSyncService.resetSynced = function (array, store) {
        array.forEach(function (element) {
            try {
                element.synced = null;
                DatabaseService.saveSync(store, element, function (e) { }, function (e) { });
            }
            catch (ex) { }
        });
    };
    CloudSyncService.processPilotsToSync = function (array) {
        if (!array || array.length < 1 || !UserService.user) {
            DatabaseService.readAllUpdatesForSync(DatabaseService.store_competitions, CloudSyncService.processCompetitionsToSync);
            return;
        }
        var request = new PilotSyncRequest(UserService.user, array);
        AjaxService.send(CloudSyncService.getPathWithUser(AjaxService.path_syncPilots), request, function (result) {
            if (result && result.status != 'SUCCESS') {
                CloudSyncService.resetSynced(array, DatabaseService.store_pilots);
            }
            DatabaseService.readAllUpdatesForSync(DatabaseService.store_competitions, CloudSyncService.processCompetitionsToSync);
        });
    };
    CloudSyncService.processCompetitionsToSync = function (array) {
        if (!array || array.length < 1 || !UserService.user) {
            DatabaseService.readAllUpdatesForSync(DatabaseService.store_races, CloudSyncService.processRacesToSync);
            return;
        }
        var request = new CompetitionSyncRequest(UserService.user, array);
        AjaxService.send(CloudSyncService.getPathWithUser(AjaxService.path_syncCompetitions), request, function (result) {
            if (result && result.status != 'SUCCESS') {
                CloudSyncService.resetSynced(array, DatabaseService.store_competitions);
            }
            DatabaseService.readAllUpdatesForSync(DatabaseService.store_races, CloudSyncService.processRacesToSync);
        });
    };
    CloudSyncService.processRacesToSync = function (array) {
        if (!array || array.length < 1 || !UserService.user) {
            setTimeout(CloudSyncService.readyToTransferAccount, 1000);
            return;
        }
        var request = new RaceSyncRequest(UserService.user, array);
        AjaxService.send(CloudSyncService.getPathWithUser(AjaxService.path_syncRaces), request, function (result) {
            if (result && result.status != 'SUCCESS') {
                CloudSyncService.resetSynced(array, DatabaseService.store_races);
            }
            setTimeout(CloudSyncService.readyToTransferAccount, 1000);
        });
    };
    CloudSyncService.processRaceBandsToSync = function (array) {
        if (!array || array.length < 1 || !UserService.user) {
            DatabaseService.readAllUpdatesForSync(DatabaseService.store_pilots, CloudSyncService.processPilotsToSync);
            return;
        }
        var request = new RaceBandSyncRequest(UserService.user, array);
        AjaxService.send(CloudSyncService.getPathWithUser(AjaxService.path_syncRaceBands), request, function (result) {
            if (result && result.status != 'SUCCESS') {
                CloudSyncService.resetSynced(array, DatabaseService.store_raceBands);
            }
            DatabaseService.readAllUpdatesForSync(DatabaseService.store_pilots, CloudSyncService.processPilotsToSync);
        });
    };
    CloudSyncService.processClassesToSync = function (array) {
        if (!array || array.length < 1 || !UserService.user) {
            DatabaseService.readAllUpdatesForSync(DatabaseService.store_raceBands, CloudSyncService.processRaceBandsToSync);
            return;
        }
        var request = new ClassSyncRequest(UserService.user, array);
        AjaxService.send(CloudSyncService.getPathWithUser(AjaxService.path_syncClasses), request, function (result) {
            if (result && result.status != 'SUCCESS') {
                CloudSyncService.resetSynced(array, DatabaseService.store_classes);
            }
            DatabaseService.readAllUpdatesForSync(DatabaseService.store_raceBands, CloudSyncService.processRaceBandsToSync);
        });
    };
    CloudSyncService.processUserToSync = function (array) {
        if (!array || array.length < 1 || !UserService.user) {
            DatabaseService.readAllUpdatesForSync(DatabaseService.store_classes, CloudSyncService.processClassesToSync);
            return;
        }
        var request = new BaseSyncRequest(array[0]);
        AjaxService.send(CloudSyncService.getPathWithUser(AjaxService.path_syncUser), request, function (result) {
            if (result && result.status != 'SUCCESS') {
                CloudSyncService.resetSynced(array, DatabaseService.store_user);
            }
            DatabaseService.readAllUpdatesForSync(DatabaseService.store_classes, CloudSyncService.processClassesToSync);
        });
    };
    CloudSyncService.reloadAngular = function () {
        if (!angular.element(document.getElementById('cloud')).scope().$$phase) {
            angular.element(document.getElementById('cloud')).scope().$apply();
        }
        else {
            console.log("reload angular failed!!!");
            setTimeout(CloudSyncService.reloadAngular, 200);
        }
    };
    CloudSyncService.getPathWithUser = function (path) {
        return path + "/" + UserService.user.uuid;
    };
    CloudSyncService.syncInterval = null;
    CloudSyncService.syncIntervalTime = 10000;
    CloudSyncService.verificationCode = "";
    CloudSyncService.status = { online: false, transferPossible: false, message: "", blockScreen: false };
    return CloudSyncService;
}());
/// <reference path="../_reference.ts"/>
var DatabaseService = (function () {
    function DatabaseService() {
    }
    DatabaseService.init = function (onSuccess) {
        if ("indexedDB" in window) {
            DatabaseService.IDB_SUPPORTED = true;
        }
        else {
            NotificationService.notify("local storage not supported!!!!, please tell me!!");
        }
        if (DatabaseService.IDB_SUPPORTED) {
            var openRequest = indexedDB.open(DatabaseService.DB_NAME, DatabaseService.DB_VERSION);
            //this is not supported in minor chrome versions
            openRequest.onupgradeneeded = function (e) {
                DatabaseService.DB = e.target.result;
                if (!DatabaseService.DB.objectStoreNames.contains(DatabaseService.store_pilots)) {
                    DatabaseService.DB.createObjectStore(DatabaseService.store_pilots, { autoIncrement: true });
                }
                if (!DatabaseService.DB.objectStoreNames.contains(DatabaseService.store_competitions)) {
                    DatabaseService.DB.createObjectStore(DatabaseService.store_competitions, { autoIncrement: true });
                }
                if (!DatabaseService.DB.objectStoreNames.contains(DatabaseService.store_races)) {
                    var store = DatabaseService.DB.createObjectStore(DatabaseService.store_races, { autoIncrement: true });
                    store.createIndex("competitionUUID", "competitionUUID", { unique: false });
                }
                if (!DatabaseService.DB.objectStoreNames.contains(DatabaseService.store_liveResults)) {
                    DatabaseService.DB.createObjectStore(DatabaseService.store_liveResults, { autoIncrement: true });
                }
                if (!DatabaseService.DB.objectStoreNames.contains(DatabaseService.store_classes)) {
                    DatabaseService.DB.createObjectStore(DatabaseService.store_classes, { autoIncrement: true });
                }
                if (!DatabaseService.DB.objectStoreNames.contains(DatabaseService.store_raceBands)) {
                    DatabaseService.DB.createObjectStore(DatabaseService.store_raceBands, { autoIncrement: true });
                }
                if (!DatabaseService.DB.objectStoreNames.contains(DatabaseService.store_windowConfig)) {
                    DatabaseService.DB.createObjectStore(DatabaseService.store_windowConfig, { autoIncrement: true });
                }
                if (!DatabaseService.DB.objectStoreNames.contains(DatabaseService.store_user)) {
                    DatabaseService.DB.createObjectStore(DatabaseService.store_user, { autoIncrement: true });
                }
                if (DatabaseService.DB.version == 9) {
                    setTimeout(function () {
                        var transaction = DatabaseService.DB.transaction([DatabaseService.store_windowConfig], "readwrite");
                        var store = transaction.objectStore(DatabaseService.store_windowConfig);
                        var request = store.clear();
                    }, 3000);
                }
                if (DatabaseService.DB_VERSION == 14) {
                    console.log("reset");
                    setTimeout(CloudSyncService.resetAllSyncForDeveloper, 3000);
                }
                if (DatabaseService.DB_VERSION == 18) {
                    setTimeout(function () {
                        if (!UserService.user.calendarKey || UserService.user.calendarKey.length == 0) {
                            UserService.user.calendarKey = UUIDService.next();
                        }
                        UserService.saveCurrentUser();
                    }, 3000);
                }
            };
            openRequest.onsuccess = function (e) {
                DatabaseService.DB = e.target.result;
                onSuccess();
            };
            openRequest.onerror = function (e) {
                NotificationService.notify("Database initialization failed, please contact developer!");
                console.dir(e);
            };
        }
    };
    DatabaseService.readAll = function (dbName, callback) {
        var transaction = DatabaseService.DB.transaction([dbName], "readonly");
        var objectStore = transaction.objectStore(dbName);
        var cursor = objectStore.openCursor();
        var array = [];
        cursor.onsuccess = function (e) {
            var res = e.target.result;
            if (res) {
                if (!res.value.deleted) {
                    array.push(res.value);
                }
                res.continue();
            }
        };
        transaction.oncomplete = function (e) {
            callback(array);
        };
    };
    DatabaseService.resetAllSyncRecords = function (dbName) {
        var transaction = DatabaseService.DB.transaction([dbName], "readwrite");
        var objectStore = transaction.objectStore(dbName);
        var cursor = objectStore.openCursor();
        var array = [];
        cursor.onsuccess = function (e) {
            var res = e.target.result;
            if (res) {
                var obj = res.value;
                obj.saved = null;
                obj.synced = null;
                DatabaseService.save(dbName, obj, function () {
                }, function () {
                });
                res.continue();
            }
        };
    };
    DatabaseService.allColumnsSynced = function (dbName, callback) {
        var transaction = DatabaseService.DB.transaction([dbName], "readonly");
        var objectStore = transaction.objectStore(dbName);
        var cursor = objectStore.openCursor();
        var everythingSyced = true;
        cursor.onsuccess = function (e) {
            var res = e.target.result;
            if (res) {
                var obj = res.value;
                if (!obj.synced || obj.synced < obj.saved) {
                    everythingSyced = false;
                }
                res.continue();
            }
        };
        transaction.oncomplete = function (e) {
            callback(everythingSyced);
        };
    };
    DatabaseService.readAllUpdatesForSync = function (dbName, callback) {
        var transaction = DatabaseService.DB.transaction([dbName], "readonly");
        var objectStore = transaction.objectStore(dbName);
        var cursor = objectStore.openCursor();
        var array = [];
        var syncDate = new Date();
        cursor.onsuccess = function (e) {
            var res = e.target.result;
            if (res) {
                var obj = res.value;
                if (!obj.synced || obj.synced < obj.saved) {
                    array.push(obj);
                    obj.synced = syncDate;
                }
                res.continue();
            }
        };
        transaction.oncomplete = function (e) {
            array.forEach(function (obj) {
                DatabaseService.saveSync(dbName, obj, function () {
                }, function () {
                    console.error("SYNC SAVE TIMESTAMP ERROR");
                });
            });
            callback(array);
        };
    };
    DatabaseService.getStore = function (dbName) {
        return DatabaseService.DB.transaction([dbName], "readonly").objectStore(dbName);
    };
    DatabaseService.findByUUID = function (dbName, uuid, callback) {
        try {
            var transaction = DatabaseService.DB.transaction([dbName], "readonly");
            var objectStore = transaction.objectStore(dbName);
            var ob = objectStore.get(uuid);
            ob.onsuccess = function (e) {
                if (ob.result && ob.result.deleted) {
                    callback(null);
                }
                else {
                    callback(ob.result);
                }
            };
            ob.onerror = function (e) {
                callback(null);
            };
        }
        catch (ex) {
            console.log("ex", ex);
        }
    };
    DatabaseService.saveSync = function (dbName, object, success, error) {
        var transaction = DatabaseService.DB.transaction([dbName], "readwrite");
        var store = transaction.objectStore(dbName);
        var request = store.put(object, object.uuid);
        request.onsuccess = success;
        request.onerror = function () {
            object.saved = null;
            error();
        };
    };
    DatabaseService.save = function (dbName, object, success, error) {
        object.saved = new Date();
        var transaction = DatabaseService.DB.transaction([dbName], "readwrite");
        var store = transaction.objectStore(dbName);
        var request = store.put(object, object.uuid);
        request.onsuccess = success;
        request.onerror = function () {
            object.saved = null;
            error();
        };
    };
    DatabaseService.replaceContent = function (dbName, data, callback) {
        var mappedData = [];
        switch (dbName) {
            case DatabaseService.store_pilots:
                data.forEach(function (entry) {
                    mappedData.push(new Pilot(entry));
                });
                break;
            case DatabaseService.store_competitions:
                data.forEach(function (entry) {
                    mappedData.push(new Competition(entry));
                });
                break;
            case DatabaseService.store_races:
                data.forEach(function (entry) {
                    mappedData.push(new Race(entry));
                });
                break;
            case DatabaseService.store_raceBands:
                data.forEach(function (entry) {
                    mappedData.push(new RaceBand(entry));
                });
                break;
            case DatabaseService.store_classes:
                data.forEach(function (entry) {
                    mappedData.push(new Classs(entry));
                });
                break;
            case DatabaseService.store_user:
                data.forEach(function (entry) {
                    mappedData.push(new User(entry));
                });
                break;
            case DatabaseService.store_liveResults:
                data.forEach(function (entry) {
                    mappedData.push(new RaceResultEntry(entry));
                });
                break;
        }
        var transaction = DatabaseService.DB.transaction([dbName], "readwrite");
        var store = transaction.objectStore(dbName);
        var request = store.clear();
        request.onsuccess = function (e) {
            mappedData.forEach(function (entry) {
                DatabaseService.saveSync(dbName, entry, function (e) { }, function (e) { });
            });
        };
        request.onerror = function (e) {
        };
        transaction.oncomplete = function (e) { callback(); };
    };
    DatabaseService.delete = function (dbName, object, success, error) {
        object.deleted = true;
        DatabaseService.save(dbName, object, success, error);
        //        try {
        //            var transaction = DatabaseService.DB.transaction([dbName], "readwrite");
        //            var store = transaction.objectStore(dbName);
        //            var request = store.delete(object.uuid);
        //
        //            request.onsuccess = success;
        //            request.onerror = error;
        //        }
        //        catch (ex) {
        //        }
    };
    DatabaseService.DB_NAME = "FPV_RACE_TRACKER";
    DatabaseService.DB_VERSION = 18;
    DatabaseService.IDB_SUPPORTED = false;
    DatabaseService.store_pilots = "pilots";
    DatabaseService.store_competitions = "competitions";
    DatabaseService.store_races = "races";
    DatabaseService.store_liveResults = "liveResults";
    DatabaseService.store_raceBands = "racebands";
    DatabaseService.store_classes = "classes";
    DatabaseService.store_windowConfig = "windowConfig";
    DatabaseService.store_user = "user";
    return DatabaseService;
}());
/// <reference path="../_reference.ts"/>
var PilotService = (function () {
    function PilotService() {
    }
    PilotService.init = function (callback) {
        DatabaseService.readAll(DatabaseService.store_pilots, function (pilots) {
            PilotService.setPilots(pilots);
            if (callback)
                callback();
        });
    };
    PilotService.canPilotBeAssignedToRace = function () {
        if (!this.pilot || !this.pilot.uuid) {
            return false;
        }
        if (!this.pilot.firstName || this.pilot.firstName.length < 2) {
            return false;
        }
        if (!this.pilot.lastName || this.pilot.lastName.length < 2) {
            return false;
        }
        if (!this.pilot.country || this.pilot.country.length < 2) {
            return false;
        }
        if (!PilotService.pilot.pilotNumber || PilotService.pilot.pilotNumber < 1) {
            return false;
        }
        return true;
    };
    PilotService.save = function () {
        if (!this.isValid()) {
            return;
        }
        PilotService.update(this.pilot); //set create mode only in success callback, good for sanity checks
        if (PilotService.selectedCompetition && PilotService.canPilotBeAssignedToRace()) {
            if (PilotService.selectedClass) {
                CompetitionService.addPilot(PilotService.selectedCompetition, PilotService.pilot, PilotService.selectedClass);
                CompetitionService.update(PilotService.selectedCompetition);
            }
            else {
                NotificationService.notify("No class selected, pilot was not added to Race " + PilotService.selectedCompetition.description);
            }
        }
        document.getElementById("createPilot").classList.add("hidden");
        PilotService.selectedCompetition = null;
        this.setCreateMode();
    };
    PilotService.showCreate = function () {
        document.getElementById("createPilot").classList.remove("hidden");
        this.setCreateMode();
    };
    PilotService.hideCreate = function () {
        document.getElementById("createPilot").classList.add("hidden");
        this.setCreateMode();
    };
    PilotService.isValid = function () {
        if (!this.pilot || !this.pilot.uuid) {
            return false;
        }
        if (!this.pilot.firstName || this.pilot.firstName.length < 2) {
            NotificationService.notify("Please set a first name with 2 characters minimum!");
            return false;
        }
        if (!this.pilot.lastName || this.pilot.lastName.length < 2) {
            NotificationService.notify("Please set a last name with 2 characters minimum!");
            return false;
        }
        if (!this.pilot.country || this.pilot.country.length < 2) {
            NotificationService.notify("Please set a country name with 2 characters minimum!");
            return false;
        }
        var pilot = this.pilot;
        if (this.pilot.email && !PilotService.pilots.every(function (p) { return p.email != pilot.email || p.uuid == pilot.uuid; })) {
            NotificationService.notify("e-mail address allready taken!");
            return false;
        }
        return true;
    };
    PilotService.showUpdate = function (pilot) {
        if (this.pilot.uuid == pilot.uuid) {
            this.setCreateMode();
            document.getElementById("createPilot").classList.add("hidden");
            return;
        }
        this.pilot = pilot;
        this.mode.update = true;
        this.mode.create = false;
        this.selectedCompetition = null;
        this.selectedClass = null;
        document.getElementById("createPilotStatus").classList.add("activateUpdate");
        document.getElementById("createPilotStatus").classList.remove("activateCreate");
        document.getElementById("createPilot").classList.remove("hidden");
    };
    PilotService.setCreateMode = function () {
        document.getElementById("createPilotStatus").classList.add("activateCreate");
        document.getElementById("createPilotStatus").classList.remove("activateUpdate");
        this.mode.update = false;
        this.mode.create = true;
        this.selectedCompetition = null;
        this.selectedClass = null;
        this.pilot = new Pilot({
            classs: ClassService.getFirstClass(),
            pilotNumber: PilotService.getNextPilotNumber()
        });
    };
    PilotService.scanCountdown = function () {
        if (PilotService.scanTimer.value > 0) {
            PilotService.scanTimer.value--;
            PilotService.reloadAngular();
        }
        else {
            PilotService.scanTimer.value = 0;
            RaceService.CURRENT_STATUS.readDevice = false;
            clearInterval(PilotService.scanInterval);
        }
    };
    PilotService.scanPilot = function () {
        RaceService.pilotToScan = this.pilot;
        RaceService.CURRENT_STATUS.readDevice = true;
        PilotService.scanTimer.value = 10;
        PilotService.scanInterval = setInterval(PilotService.scanCountdown, 1000);
    };
    PilotService.pilotFilter = function (pilot, index, array) {
        if (!CompetitionService.nameFilter.text
            || ("" + pilot.pilotNumber).indexOf(CompetitionService.nameFilter.text) != -1
            || (pilot.firstName + " " + pilot.lastName).toUpperCase().indexOf(CompetitionService.nameFilter.text.toUpperCase()) != -1) {
            return true;
        }
        return false;
    };
    PilotService.getNextPilotNumber = function () {
        var smallestFreePilotNumber = 1;
        var found = true;
        while (found) {
            found = false;
            for (var idx in PilotService.pilots) {
                if (PilotService.pilots[idx].pilotNumber == smallestFreePilotNumber) {
                    found = true;
                    smallestFreePilotNumber++;
                    break;
                }
            }
        }
        return smallestFreePilotNumber;
    };
    PilotService.download = function () {
        var csv = "";
        csv += "Date:;" + (new Date()) + "\n\n";
        csv += "First Name; Last Name; Alias; Phone; Country; email; Club; Transponder ID; Race Number; Class\n";
        for (var idx in PilotService.pilots) {
            if (PilotService.pilots[idx].firstName) {
                csv += PilotService.pilots[idx].firstName + ";";
            }
            else {
                csv += ";";
            }
            if (PilotService.pilots[idx].lastName) {
                csv += PilotService.pilots[idx].lastName + ";";
            }
            else {
                csv += ";";
            }
            if (PilotService.pilots[idx].alias) {
                csv += PilotService.pilots[idx].alias + ";";
            }
            else {
                csv += ";";
            }
            if (PilotService.pilots[idx].phone) {
                csv += PilotService.pilots[idx].phone + ";";
            }
            else {
                csv += ";";
            }
            if (PilotService.pilots[idx].country) {
                csv += PilotService.pilots[idx].country + ";";
            }
            else {
                csv += ";";
            }
            if (PilotService.pilots[idx].email) {
                csv += PilotService.pilots[idx].email + ";";
            }
            else {
                csv += ";";
            }
            if (PilotService.pilots[idx].club) {
                csv += PilotService.pilots[idx].club + ";";
            }
            else {
                csv += ";";
            }
            if (PilotService.pilots[idx].deviceId) {
                csv += PilotService.pilots[idx].deviceId + ";";
            }
            else {
                csv += ";";
            }
            if (PilotService.pilots[idx].pilotNumber) {
                csv += PilotService.pilots[idx].pilotNumber + ";";
            }
            else {
                csv += ";";
            }
            csv += "\n";
        }
        var blobdata = new Blob([csv], { type: 'text/csv' });
        var filename = "pilots_export_(" + new Date().toJSON() + ").csv";
        filename = filename.replace(" ", "");
        var link = document.createElement("a");
        link.setAttribute("href", window.URL.createObjectURL(blobdata));
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        NotificationService.notify(NotificationService.fileDownloadText);
    };
    PilotService.update = function (pilot) {
        if (pilot.firstName && pilot.lastName) {
            DatabaseService.save(DatabaseService.store_pilots, pilot, function (e) {
                if (PilotService.pilots.every(function (p) {
                    if (p.uuid == pilot.uuid) {
                        p = pilot;
                        return false;
                    }
                    return true;
                })) {
                    PilotService.pilots.push(new Pilot(pilot));
                }
                for (var eidx in CompetitionService.competitions) {
                    var competition = CompetitionService.competitions[eidx];
                    var changed = false;
                    console.log("pilots", competition.pilots);
                    for (var pidx in competition.pilots) {
                        if (pilot.uuid == competition.pilots[pidx].uuid) {
                            //this needs to be done because classs is only available in pilot copies of competition pilots array
                            var oldClasss = competition.pilots[pidx].classs;
                            console.log("oldClass", oldClasss);
                            competition.pilots[pidx] = new Pilot(pilot);
                            competition.pilots[pidx].classs = oldClasss;
                            changed = true;
                        }
                    }
                    if (changed) {
                        CompetitionService.update(competition);
                    }
                }
                RaceService.races.forEach(function (race) {
                    race.rounds.forEach(function (round) {
                        round.heats.forEach(function (heat) {
                            if (!heat.heatResult) {
                                for (var idx = 0; idx < heat.pilots.length; idx++) {
                                    if (heat.pilots[idx].uuid == pilot.uuid) {
                                        //this needs to be done because raceband is only available in pilot copies of heat pilots array
                                        var oldRaceBand = heat.pilots[idx].assignedRaceBand;
                                        //this needs to be done because classs is only available in pilot copies of competition pilots array
                                        var oldClass = heat.pilots[idx].classs;
                                        heat.pilots[idx] = new Pilot(pilot);
                                        heat.pilots[idx].assignedRaceBand = oldRaceBand;
                                        heat.pilots[idx].classs = oldClasss;
                                        RaceService.update(race);
                                    }
                                }
                            }
                        });
                    });
                });
                PilotService.reloadAngular();
                NotificationService.notify("Pilot saved!");
            }, function (e) {
                NotificationService.notify("Pilot error!");
            }); //replace null with callback
        }
    };
    PilotService.deletePilot = function () {
        ConfirmationService.pleaseConfirm(function () {
            DatabaseService.delete(DatabaseService.store_pilots, PilotService.pilot, function () {
                if (PilotService.pilots.indexOf(PilotService.pilot) == -1) {
                    return;
                }
                PilotService.pilots.splice(PilotService.pilots.indexOf(PilotService.pilot), 1);
                document.getElementById("createPilotStatus").classList.add("activateCreate");
                document.getElementById("createPilotStatus").classList.remove("activateUpdate");
                for (var eidx in CompetitionService.competitions) {
                    var competition = CompetitionService.competitions[eidx];
                    for (var pidx = 0, max = competition.pilots.length; pidx < max; pidx++) {
                        if (PilotService.pilot.uuid == competition.pilots[pidx].uuid) {
                            competition.pilots.splice(pidx, 1);
                            max = CompetitionService.selectedCompetition.pilots.length;
                            pidx--;
                            CompetitionService.update(competition);
                        }
                    }
                }
                RaceService.races.forEach(function (race) {
                    race.rounds.forEach(function (round) {
                        round.heats.forEach(function (heat) {
                            if (!heat.heatResult) {
                                for (var idx = 0; idx < heat.pilots.length; idx++) {
                                    if (heat.pilots[idx].uuid == PilotService.pilot.uuid) {
                                        heat.pilots.splice(idx, 1);
                                        RaceService.update(race);
                                        break;
                                    }
                                }
                            }
                        });
                    });
                });
                PilotService.setCreateMode();
                PilotService.reloadAngular();
                NotificationService.notify("Pilot deleted");
            }, function () {
                NotificationService.notify("Pilot delete error!");
            });
            document.getElementById("createPilot").classList.add("hidden");
        }, function () { });
    };
    PilotService.setPilots = function (pilots) {
        for (var pilotNewIdx in pilots) {
            var found = false;
            for (var pilotOldIdx in PilotService.pilots) {
                if (PilotService.pilots[pilotOldIdx].uuid == pilots[pilotNewIdx].uuid) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                PilotService.pilots.push(new Pilot(pilots[pilotNewIdx]));
            }
        }
        if (PilotService.pilots.length == 0) {
            DatabaseFillingService.fillDefaultPilots(PilotService.init);
        }
        PilotService.reloadAngular();
    };
    PilotService.reloadAngular = function () {
        angular.element(document.getElementById('pilots')).scope().$apply();
    };
    PilotService.pilots = [];
    PilotService.selectedCompetition = null;
    PilotService.scanTimer = { value: 0 };
    PilotService.scanInterval = null;
    PilotService.pilot = new Pilot({});
    PilotService.mode = { update: false, create: false };
    PilotService.countries = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua & Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia & Herzegovina", "Botswana", "Brazil", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Cape Verde", "Cayman Islands", "Chad", "Chile", "China", "Colombia", "Congo", "Cook Islands", "Costa Rica", "Cote D Ivoire", "Croatia", "Cruise Ship", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Estonia", "Ethiopia", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Polynesia", "French West Indies", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Kyrgyz Republic", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Mauritania", "Mauritius", "Mexico", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Namibia", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Rwanda", "Saint Pierre & Miquelon", "Samoa", "San Marino", "Satellite", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka", "St Kitts & Nevis", "St Lucia", "St Vincent", "St. Lucia", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor L'Este", "Togo", "Tonga", "Trinidad & Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks & Caicos", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "Uruguay", "USA", "Uzbekistan", "Venezuela", "Vietnam", "Virgin Islands (US)", "Yemen", "Zambia", "Zimbabwe"];
    PilotService.selectedClass = null;
    return PilotService;
}());
/// <reference path="../_reference.ts"/>
var SoundService = (function () {
    function SoundService() {
    }
    SoundService.init = function () {
        SoundService.startAudio = new Audio();
        SoundService.startAudio.src = "sounds/start.mp3";
        SoundService.beepAudio = new Audio();
        SoundService.beepAudio.src = "sounds/beep.mp3";
    };
    SoundService.playStart = function () {
        //play this sound 4 sec before race starts!
        SoundService.startAudio.play();
    };
    SoundService.playBeep = function () {
        //play this sound 4 sec before race starts!
        SoundService.beepAudio.play();
    };
    return SoundService;
}());
/// <reference path="../_reference.ts"/>
var CompetitionService = (function () {
    function CompetitionService() {
    }
    CompetitionService.init = function (callback) {
        DatabaseService.readAll(DatabaseService.store_competitions, function (competitions) {
            try {
                CompetitionService.setCompetitions(competitions);
            }
            catch (e) {
                console.log("e", e);
            }
            if (callback)
                callback();
        });
    };
    CompetitionService.buildEventLink = function () {
        if (CompetitionService.selectedCompetition && CompetitionService.selectedCompetition.onlineResultKey && CompetitionService.selectedCompetition.onlineRegistrationKey) {
            return CompetitionService.eventLink_1_resultKey
                + CompetitionService.selectedCompetition.onlineResultKey
                + CompetitionService.eventLink_2_place
                + (CompetitionService.selectedCompetition.location ? CompetitionService.selectedCompetition.location : "null")
                + CompetitionService.eventLink_3_RegistrationKey
                + CompetitionService.selectedCompetition.onlineRegistrationKey;
        }
    };
    CompetitionService.buildPrivateCalendarLink = function () {
        if (UserService.user && UserService.user.calendarKey) {
            return CompetitionService.calendarLink + UserService.user.calendarKey;
        }
        return CompetitionService.calendarLink + "all";
    };
    CompetitionService.buildPublicCalendarLink = function () {
        return CompetitionService.calendarLink + "all";
    };
    CompetitionService.buildPrivateCalendarIFrame = function () {
        if (UserService.user && UserService.user.calendarKey) {
            return "<iframe width='600' height='740' src='" + CompetitionService.calendarLink + UserService.user.calendarKey + "'></iframe>";
        }
        return "<iframe width='600' height='740' src='" + CompetitionService.calendarLink + "all" + "'></iframe>";
    };
    CompetitionService.buildPublicCalendarIFrame = function () {
        return "<iframe width='600' height='740' src='" + CompetitionService.calendarLink + "all" + "'></iframe>";
    };
    CompetitionService.buildOnlineEventIFrame = function () {
        if (CompetitionService.selectedCompetition && CompetitionService.selectedCompetition.onlineResultKey && CompetitionService.selectedCompetition.onlineRegistrationKey) {
            return "<iframe width='900' height='1052' src='" + CompetitionService.eventIFrame_1_resultKey
                + CompetitionService.selectedCompetition.onlineResultKey
                + CompetitionService.eventLink_2_place
                + (CompetitionService.selectedCompetition.location ? CompetitionService.selectedCompetition.location : "null")
                + CompetitionService.eventLink_3_RegistrationKey
                + CompetitionService.selectedCompetition.onlineRegistrationKey
                + "all" + "'></iframe>";
        }
    };
    CompetitionService.toggleEventSettings = function () {
        if (typeof CompetitionService.selectedCompetition.onlineResultPossible == "undefined" || typeof CompetitionService.selectedCompetition.onlineResultKey == "undefined" || !CompetitionService.selectedCompetition.onlineResultKey || typeof CompetitionService.selectedCompetition.onlineRegistrationPossible == "undefined" || typeof CompetitionService.selectedCompetition.onlineRegistrationKey == "undefined" || !CompetitionService.selectedCompetition.onlineRegistrationKey) {
            if (typeof CompetitionService.selectedCompetition.onlineRegistrationPossible == "undefined") {
                CompetitionService.selectedCompetition.onlineRegistrationPossible = true;
            }
            if (typeof CompetitionService.selectedCompetition.onlineRegistrationKey == "undefined" || !CompetitionService.selectedCompetition.onlineRegistrationKey) {
                CompetitionService.selectedCompetition.onlineRegistrationKey = UUIDService.next();
            }
            if (typeof CompetitionService.selectedCompetition.onlineResultPossible == "undefined") {
                CompetitionService.selectedCompetition.onlineResultPossible = true;
            }
            if (typeof CompetitionService.selectedCompetition.onlineEventPossible == "undefined") {
                CompetitionService.selectedCompetition.onlineResultPossible = false;
            }
            if (typeof CompetitionService.selectedCompetition.onlineResultKey == "undefined" || !CompetitionService.selectedCompetition.onlineResultKey) {
                CompetitionService.selectedCompetition.onlineResultKey = UUIDService.next();
            }
            CompetitionService.update(CompetitionService.selectedCompetition);
        }
        CompetitionService.config.viewOnlineRegistration = !CompetitionService.config.viewOnlineRegistration;
    };
    CompetitionService.createNewCompetition = function () {
        CompetitionService.selectedCompetition = new Competition({ description: "My Competition" });
        CompetitionService.autoSelectClassToEditRaceConfig();
    };
    CompetitionService.classForPilotFilter = function (config, index, array) {
        if (CompetitionService.selectedCompetition &&
            CompetitionService.pilotToAdd &&
            CompetitionService.selectedCompetition.competitionConfigs &&
            CompetitionService.selectedCompetition.competitionConfigs.length > 0) {
            var available = true;
            CompetitionService.selectedCompetition.pilots.forEach(function (pilot) {
                if (pilot.uuid == CompetitionService.pilotToAdd.uuid && config.classs.uuid == pilot.classs.uuid) {
                    available = false;
                }
            });
            return available;
        }
        return false;
    };
    CompetitionService.pilotFilter = function (pilot, index, array) {
        if (CompetitionService.selectedCompetition) {
            if (!CompetitionService.nameFilter.text
                || ("" + pilot.pilotNumber).indexOf(CompetitionService.nameFilter.text) != -1
                || (pilot.firstName + " " + pilot.lastName).toUpperCase().indexOf(CompetitionService.nameFilter.text.toUpperCase()) != -1) {
                return true;
            }
        }
        return false;
    };
    CompetitionService.competitionSelected = function () {
        if (CompetitionService.selectedCompetition && CompetitionService.selectedCompetition.classes.length == 0) {
            CompetitionService.currentCompetitionConfig = null;
            CompetitionService.selectedClassForRaceConfig = null;
        }
        CompetitionService.autoSelectClassToEditRaceConfig();
    };
    CompetitionService.autoSelectClassToEditRaceConfig = function () {
        if (CompetitionService.selectedCompetition && CompetitionService.selectedCompetition.classes && CompetitionService.selectedCompetition.classes.length > 0) {
            CompetitionService.selectClassToEditRaceConfig(CompetitionService.selectedCompetition.classes[0]);
        }
    };
    CompetitionService.sortByPilotNr = function () {
        CompetitionService.pilotSelectionOrder = ['+pilotNumber'];
    };
    CompetitionService.sortByName = function () {
        CompetitionService.pilotSelectionOrder = ['+firstName', '+lastName'];
    };
    CompetitionService.getNewRace = function (classs, format) {
        return new Race({
            rounds: [],
            classs: classs,
            format: format,
            competitionUUID: CompetitionService.selectedCompetition.uuid
        });
    };
    CompetitionService.getNewRound = function (roundNumber) {
        return new Round({
            countdown: 5,
            duration: 180,
            blockingTime: 5,
            roundNumber: roundNumber,
            amountOfHeats: 1,
            lapDistance: 0,
            timestamp: new Date(),
            amountOfQualifiedPilots: 1,
            heats: [new Heat({ heatNumber: 1 })]
        });
    };
    CompetitionService.save = function () {
        CompetitionService.update(CompetitionService.selectedCompetition);
        var races = RaceService.races.filter(function (race) {
            return race.competitionUUID == CompetitionService.selectedCompetition.uuid;
        });
        CompetitionService.selectedCompetition.competitionConfigs.forEach(function (config) {
            //TODO: for all 3 functions below...
            // * race has allready a result, but we change format
            // * race has allready a result but we delete the round
            // * ...
            var raceTraining = races.filter(function (race) {
                return race.format.toUpperCase() == "TRAINING" && race.classs.uuid == config.classs.uuid;
            }).pop();
            if (!raceTraining) {
                raceTraining = CompetitionService.getNewRace(config.classs, "Training");
            }
            raceTraining.type = config.typeTraining;
            while (raceTraining.rounds.length < config.roundsTraining) {
                raceTraining.rounds.push(RaceService.getNewRound(raceTraining.rounds.length + 1));
            }
            while (raceTraining.rounds.length > config.roundsTraining) {
                var found = false;
                raceTraining.rounds.forEach(function (round) {
                    round.heats.forEach(function (heat) {
                        if (heat.heatResult && heat.heatResult.results && heat.heatResult.results.length > 0) {
                            found = true;
                        }
                    });
                });
                if (found) {
                    break;
                }
                raceTraining.rounds.pop();
            }
            RaceService.update(raceTraining);
            var raceQualifying = races.filter(function (race) {
                return race.format.toUpperCase() == "QUALIFYING" && race.classs.uuid == config.classs.uuid;
            }).pop();
            if (!raceQualifying) {
                raceQualifying = CompetitionService.getNewRace(config.classs, "Qualifying");
            }
            raceQualifying.type = config.typeQualifying;
            while (raceQualifying.rounds.length < config.roundsQualifying) {
                raceQualifying.rounds.push(RaceService.getNewRound(raceQualifying.rounds.length + 1));
            }
            while (raceQualifying.rounds.length > config.roundsQualifying) {
                var found = false;
                raceQualifying.rounds.forEach(function (round) {
                    round.heats.forEach(function (heat) {
                        if (heat.heatResult && heat.heatResult.results && heat.heatResult.results.length > 0) {
                            found = true;
                        }
                    });
                });
                if (found) {
                    break;
                }
                raceQualifying.rounds.pop();
            }
            RaceService.update(raceQualifying);
            var raceCompetition = races.filter(function (race) {
                return race.format.toUpperCase() == "COMPETITION" && race.classs.uuid == config.classs.uuid;
            }).pop();
            if (!raceCompetition) {
                raceCompetition = CompetitionService.getNewRace(config.classs, "Competition");
            }
            raceCompetition.type = config.typeCompetition;
            while (raceCompetition.rounds.length < config.roundsCompetition) {
                raceCompetition.rounds.push(RaceService.getNewRound(raceCompetition.rounds.length + 1));
            }
            while (raceCompetition.rounds.length > config.roundsCompetition) {
                var found = false;
                //TODO: dont loop all, just check the last
                raceCompetition.rounds.forEach(function (round) {
                    round.heats.forEach(function (heat) {
                        if (heat.heatResult && heat.heatResult.results && heat.heatResult.results.length > 0) {
                            found = true;
                        }
                    });
                });
                if (found) {
                    break;
                }
                raceCompetition.rounds.pop();
            }
            RaceService.update(raceCompetition);
        });
    };
    CompetitionService.selectClassToEditRaceConfig = function (classs) {
        CompetitionService.selectedClassForRaceConfig = classs;
        CompetitionService.selectedCompetition.competitionConfigs.forEach(function (config) {
            if (config.classs.uuid == classs.uuid) {
                CompetitionService.currentCompetitionConfig = config;
            }
        });
    };
    CompetitionService.customContains = function (competition, pilot) {
        var pilotIdx = -1;
        if (!competition || !competition.pilots || competition.pilots.length < 1) {
            return pilotIdx;
        }
        for (var idx in competition.pilots) {
            if (competition.pilots[idx].uuid == pilot.uuid && competition.pilots[idx].classs.uuid == pilot.classs.uuid) {
                pilotIdx = idx;
            }
        }
        ;
        return pilotIdx;
    };
    CompetitionService.removeAllPilotsWithClass = function (classs) {
        for (var idx = 0, max = CompetitionService.selectedCompetition.pilots.length; idx < max; idx++) {
            var pilot = CompetitionService.selectedCompetition.pilots[idx];
            if (pilot.classs.uuid == classs.uuid) {
                CompetitionService.selectedCompetition.pilots.splice(idx, 1);
                max = CompetitionService.selectedCompetition.pilots.length;
                idx--;
            }
        }
    };
    CompetitionService.addClass = function (competition, classs) {
        var idx = CompetitionService.classAssigned(competition, classs);
        if (idx > -1) {
            for (var idx2 in competition.competitionConfigs) {
                if (competition.competitionConfigs[idx2].classs.uuid == classs.uuid) {
                    competition.competitionConfigs.splice(idx2, 1);
                    CompetitionService.removeAllPilotsWithClass(classs);
                    break;
                }
            }
            ;
            competition.classes.splice(idx, 1);
        }
        else {
            competition.competitionConfigs.push(new CompetitionConfig({ classs: classs }));
            competition.classes.push(classs);
        }
        CompetitionService.autoSelectClassToEditRaceConfig();
    };
    CompetitionService.typeCompetitionChanged = function () {
        //TODO: dont allow values <  races with heat results inside (done but not perfectly, because if one result exists, no delete is possible at all)
        CompetitionService.raceConfigChanged();
    };
    CompetitionService.roundsCompetitionChanged = function () {
        CompetitionService.raceConfigChanged();
    };
    CompetitionService.typeQualifyingChanged = function () {
        CompetitionService.raceConfigChanged();
    };
    CompetitionService.roundsQualifyingChanged = function () {
        CompetitionService.raceConfigChanged();
    };
    CompetitionService.typeTrainingChanged = function () {
        CompetitionService.raceConfigChanged();
    };
    CompetitionService.roundsTrainingChanged = function () {
        CompetitionService.raceConfigChanged();
    };
    CompetitionService.raceConfigChanged = function () {
        //        CompetitionService.update(CompetitionService.selectedCompetition);
    };
    CompetitionService.classAssigned = function (competition, classs) {
        var index = -1;
        if (!competition) {
            return index;
        }
        for (var idx = 0; idx < competition.classes.length; idx++) {
            if (competition.classes[idx].uuid == classs.uuid) {
                index = idx;
            }
        }
        return index;
    };
    CompetitionService.removePilot = function (competition, pilot) {
        var index = CompetitionService.customContains(competition, pilot);
        if (index != -1) {
            RaceService.removePilotFromRaceByUUID(pilot.uuid);
            competition.pilots.splice(index, 1);
            return;
        }
    };
    CompetitionService.selectClassForPilot = function (pilot) {
        CompetitionService.pilotToAdd = pilot;
    };
    CompetitionService.removeOnlineRegistrationPilot = function (pilot) {
        CompetitionService.config.disableRegButtons = true;
        AjaxService.send(AjaxService.path_removeRegistration + "/" + pilot.onlineRegistrationUUID + "/" + pilot.classs.uuid, null, function (success) {
            CompetitionService.onlinePilots.splice(CompetitionService.onlinePilots.indexOf(pilot), 1);
            CompetitionService.config.disableRegButtons = false;
            CompetitionService.reloadAngular();
        });
    };
    CompetitionService.addOnlineRegistrationPilot = function (registeredPilot) {
        CompetitionService.config.disableRegButtons = true;
        var localPilot = CompetitionService.pilotAllreadyExists(registeredPilot);
        var pilotAllreadyExists = localPilot ? true : false;
        console.log("allready assigned: " + pilotAllreadyExists, localPilot);
        if (!pilotAllreadyExists) {
            registeredPilot.pilotNumber = PilotService.getNextPilotNumber();
            PilotService.update(registeredPilot);
        }
        CompetitionService.addPilot(CompetitionService.selectedCompetition, (pilotAllreadyExists ? localPilot : registeredPilot), registeredPilot.classs);
        AjaxService.send(AjaxService.path_removeRegistration + "/" + registeredPilot.onlineRegistrationUUID + "/" + registeredPilot.classs.uuid, null, function (success) {
            CompetitionService.onlinePilots.splice(CompetitionService.onlinePilots.indexOf(registeredPilot), 1);
            CompetitionService.config.disableRegButtons = false;
            CompetitionService.reloadAngular();
        });
    };
    CompetitionService.pilotAllreadyExists = function (pilot) {
        var found = null;
        PilotService.pilots.forEach(function (p) {
            if (pilot && pilot.email && p && p.email && pilot.email.trim().toUpperCase() == p.email.trim().toUpperCase()) {
                found = p;
            }
        });
        return found;
    };
    CompetitionService.isClassAvailableInCompetition = function (c) {
        var found = false;
        CompetitionService.selectedCompetition.classes.forEach(function (classs) {
            if (classs.uuid == c.uuid) {
                found = true;
            }
        });
        return found;
    };
    CompetitionService.showOnlinePilots = function () {
        CompetitionService.config.disableRegButtons = false;
        CompetitionService.onlinePilots.length = 0;
        AjaxService.send(AjaxService.path_getOnlinePilots + "/" + CompetitionService.selectedCompetition.uuid, null, function (registrations) {
            registrations.forEach(function (registration) {
                new OnlineRegistration(registration).getPilotObjects().forEach(function (pilot) {
                    var p = new Pilot(pilot);
                    p.onlineRegistrationUUID = registration.uuid;
                    CompetitionService.onlinePilots.push(p);
                });
            });
            CompetitionService.config.viewOnlinePilots = true;
            CompetitionService.reloadAngular();
        });
    };
    CompetitionService.hideOnlinePilots = function () {
        CompetitionService.config.viewOnlinePilots = false;
    };
    CompetitionService.cancelAddPilot = function () {
        CompetitionService.pilotToAdd = null;
    };
    CompetitionService.addPilot = function (competition, pilot, classs) {
        if (!classs) {
            return;
        }
        if (!pilot.pilotNumber || pilot.pilotNumber < 1) {
            NotificationService.notify("Pilot Number missing!");
            return;
        }
        if (!competition.pilots.every(function (p) { return p.pilotNumber != pilot.pilotNumber || p.uuid == pilot.uuid; })) {
            NotificationService.notify("Pilot Number allready taken!");
            return;
        }
        if (pilot.classs && pilot.classs.uuid && competition.pilots.some(function (p) { return p.classs.uuid == classs.uuid && p.uuid == pilot.uuid; })) {
            return;
        }
        if (!competition.classes.some(function (competitionClass) { return competitionClass.uuid == classs.uuid; })) {
            NotificationService.notify("The chosen Class is not available in your Event!");
            return;
        }
        var pilotCopy = new Pilot(pilot);
        pilotCopy.classs = classs;
        competition.pilots.push(pilotCopy);
        CompetitionService.cancelAddPilot();
    };
    CompetitionService.update = function (competition) {
        if (!competition.description || competition.description.length < 1) {
            return;
        }
        DatabaseService.save(DatabaseService.store_competitions, competition, function (x) {
            if (CompetitionService.competitions.indexOf(competition) == -1) {
                CompetitionService.competitions.push(competition);
                CompetitionService.selectedCompetition = competition;
                CompetitionService.reloadAngular();
            }
        }, function (x) {
            NotificationService.notify("Event error!");
        });
        NotificationService.notify("Event saved!");
    };
    CompetitionService.delete = function (competition, callback) {
        DatabaseService.delete(DatabaseService.store_competitions, competition, function () {
            if (CompetitionService.competitions.indexOf(competition) == -1) {
                return;
            }
            CompetitionService.competitions.splice(CompetitionService.competitions.indexOf(competition), 1);
            callback();
            CompetitionService.reloadAngular();
            NotificationService.notify("Event deleted!");
        }, function () {
            NotificationService.notify("Event delete error!");
        });
    };
    CompetitionService.setCompetitions = function (competitions) {
        for (var competitionNewIdx in competitions) {
            var found = false;
            for (var competitionOldIdx in CompetitionService.competitions) {
                if (CompetitionService.competitions[competitionOldIdx].uuid == competitions[competitionNewIdx].uuid) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                CompetitionService.competitions.push(new Competition(competitions[competitionNewIdx]));
            }
        }
        if (CompetitionService.competitions.length > 0) {
            var youngestCompetition = CompetitionService.competitions[0];
            for (var idx in CompetitionService.competitions) {
                if (CompetitionService.competitions[idx].dateFrom > youngestCompetition.dateFrom) {
                    youngestCompetition = CompetitionService.competitions[idx];
                }
            }
            CompetitionService.selectedCompetition = youngestCompetition;
            if (youngestCompetition.classes && youngestCompetition.classes.length > 0) {
                CompetitionService.selectClassToEditRaceConfig(youngestCompetition.classes[0]);
            }
        }
        if (CompetitionService.competitions.length == 0) {
            DatabaseFillingService.fillDefaultCompetitions(function () {
                CompetitionService.init(null);
                RaceService.init(null);
            });
        }
        CompetitionService.reloadAngular();
        RaceService.updateDefaultCompetitionValue();
    };
    CompetitionService.reloadAngular = function () {
        angular.element(document.getElementById('events')).scope().$apply();
    };
    CompetitionService.competitions = [];
    CompetitionService.selectedCompetition = null;
    CompetitionService.nameFilter = { text: "" };
    CompetitionService.pilotSelectionOrder = ['+firstName', '+lastName'];
    CompetitionService.selectedClassForRaceConfig = null;
    CompetitionService.currentCompetitionConfig = null;
    CompetitionService.pilotToAdd = null;
    CompetitionService.config = { viewOnlineRegistration: false, viewOnlinePilots: false, disableRegButtons: false };
    CompetitionService.onlinePilots = [];
    //public static host: string = "http://localhost:8080";
    CompetitionService.host = "https://cloud.fpvracetracker.com";
    CompetitionService.registrationLink = CompetitionService.host + "/web/onlineRegistration.html?key=";
    CompetitionService.resultLink = CompetitionService.host + "/web/onlineResult.html?key=";
    CompetitionService.calendarLink = CompetitionService.host + "/web/onlineCalendar.html?key=";
    CompetitionService.eventLink_1_resultKey = CompetitionService.host + "/web/onlineEvent.html?showPilots=true&resultKey=";
    CompetitionService.eventIFrame_1_resultKey = CompetitionService.host + "/web/event.html?showPilots=true&resultKey=";
    CompetitionService.eventLink_2_place = "&place=";
    CompetitionService.eventLink_3_RegistrationKey = "&registrationKey=";
    CompetitionService.registrationIframeCode = "<iframe width='410' height='740' src='" + CompetitionService.registrationLink;
    CompetitionService.resultIframeCode = "<iframe width='680' height='520' src='" + CompetitionService.registrationLink;
    return CompetitionService;
}());
/// <reference path="../_reference.ts"/>
var EditLapsService = (function () {
    function EditLapsService() {
    }
    EditLapsService.setLaps = function (laps) {
        EditLapsService.laps.length = 0;
        Array.prototype.push.apply(EditLapsService.laps, laps);
    };
    EditLapsService.laps = [];
    EditLapsService.lapResultOrder = ['+lapNumber'];
    return EditLapsService;
}());
/// <reference path="../_reference.ts"/>
var RaceBandService = (function () {
    function RaceBandService() {
    }
    RaceBandService.init = function (callback) {
        RaceBandService.newRaceBand = new RaceBand({});
        DatabaseService.readAll(DatabaseService.store_raceBands, function (raceBands) {
            RaceBandService.setRaceBands(raceBands);
            if (callback)
                callback();
        });
    };
    RaceBandService.getRaceBandByIndex = function (index) {
        if (RaceBandService.raceBands.length > index) {
            return RaceBandService.raceBands[index].value;
        }
        return "";
    };
    RaceBandService.getRaceBandByUUID = function (uuid) {
        for (var idx in RaceBandService.raceBands) {
            if (RaceBandService.raceBands[idx].uuid == uuid) {
                return RaceBandService.raceBands[idx];
            }
        }
        return null;
    };
    RaceBandService.delete = function (raceBand) {
        DatabaseService.delete(DatabaseService.store_raceBands, raceBand, function (e) {
            NotificationService.notify("RaceBand deleted!");
            for (var idx in RaceBandService.raceBands) {
                if (RaceBandService.raceBands[idx].uuid == raceBand.uuid) {
                    RaceBandService.raceBands.splice(idx, 1);
                    break;
                }
            }
            PilotService.pilots.forEach(function (pilot) {
                if (pilot.assignedRaceBand && pilot.assignedRaceBand.uuid == raceBand.uuid) {
                    pilot.assignedRaceBand = null;
                    PilotService.update(pilot);
                }
            });
            RaceBandService.reloadAngular();
        }, function () { });
    };
    RaceBandService.raceBandUpdated = function (raceBand) {
        if (raceBand.value.length > 0) {
            DatabaseService.save(DatabaseService.store_raceBands, raceBand, function (e) {
                NotificationService.notify("RaceBand updated!");
                PilotService.pilots.forEach(function (pilot) {
                    if (pilot.assignedRaceBand && pilot.assignedRaceBand.uuid == raceBand.uuid) {
                        pilot.assignedRaceBand = raceBand;
                        PilotService.update(pilot);
                    }
                });
            }, function () { });
        }
    };
    RaceBandService.raceBandCreated = function () {
        if (RaceBandService.newRaceBand.value && RaceBandService.newRaceBand.value.length > 0) {
            DatabaseService.save(DatabaseService.store_raceBands, RaceBandService.newRaceBand, function (e) {
                RaceBandService.raceBands.push(new RaceBand(RaceBandService.newRaceBand));
                RaceBandService.newRaceBand.value = "";
                RaceBandService.newRaceBand.uuid = UUIDService.next();
                NotificationService.notify("RaceBand updated!");
            }, function () { });
        }
        else {
            NotificationService.notify("Please enter a valid value!");
        }
    };
    RaceBandService.setRaceBands = function (raceBands) {
        RaceBandService.raceBands.length = 0;
        Array.prototype.push.apply(RaceBandService.raceBands, raceBands);
        if (RaceBandService.raceBands.length == 0) {
            DatabaseFillingService.fillDefaultRaceBands(RaceBandService.init);
        }
        RaceBandService.reloadAngular();
    };
    RaceBandService.reloadAngular = function () {
        if (!angular.element(document.getElementById('raceBand')).scope().$$phase) {
            angular.element(document.getElementById('raceBand')).scope().$apply();
        }
        else {
            console.log("reload angular failed!!!");
            setTimeout(RaceBandService.reloadAngular, 200);
        }
    };
    RaceBandService.raceBands = [];
    RaceBandService.newRaceBand = null;
    return RaceBandService;
}());
/// <reference path="../_reference.ts"/>
var StatisticService = (function () {
    function StatisticService() {
    }
    StatisticService.init = function () {
        StatisticService.raceIdentificationObjects.length = 0;
        StatisticService.selectedRaceIdentificationObject = null;
        StatisticService.raceResult = null;
        StatisticService.selectedRace = null;
        StatisticService.selectedCompetition = null;
        StatisticService.reloadAngular();
    };
    StatisticService.raceFilter = function (race, index, array) {
        if (!StatisticService.selectedCompetition) {
            return false;
        }
        //TODO: maybe add further filters and replace dropdown with a list
        return true;
    };
    StatisticService.competitionSelected = function () {
        if (!StatisticService.selectedCompetition) {
            return [];
        }
        StatisticService.raceIdentificationObjects.length = 0;
        RaceService.races.forEach(function (race) {
            if (race.competitionUUID == StatisticService.selectedCompetition.uuid) {
                race.rounds.forEach(function (round) {
                    round.heats.forEach(function (heat) {
                        if (heat.heatResult && heat.heatResult.results.length > 0) {
                            StatisticService.raceIdentificationObjects.push(new RaceIdentificationObject({
                                format: race.format,
                                'class': race.classs ? race.classs.name : '',
                                round: round.roundNumber,
                                'type': race.type,
                                heat: heat.heatNumber,
                                description: round.description,
                                result: heat.heatResult,
                                heatUUID: heat.uuid,
                                raceUUID: race.uuid
                            }));
                        }
                    });
                });
            }
        });
    };
    StatisticService.raceSelected = function () {
        StatisticService.raceResult = StatisticService.selectedRaceIdentificationObject.result;
    };
    StatisticService.confirmDeleteCompetition = function () {
        for (var idx in RaceService.races) {
            if (RaceService.races[idx].competitionUUID == StatisticService.selectedCompetition.uuid) {
                RaceService.delete(RaceService.races[idx], StatisticService.reloadAngular);
            }
        }
        CompetitionService.delete(StatisticService.selectedCompetition, function () {
            StatisticService.selectedCompetition = null;
            StatisticService.raceResult = null;
            StatisticService.selectedRaceIdentificationObject = null;
            StatisticService.competitionSelected();
            StatisticService.reloadAngular();
        });
    };
    StatisticService.confirmDeleteHeat = function () {
        RaceService.deleteHeat(StatisticService.selectedRaceIdentificationObject.raceUUID, StatisticService.selectedRaceIdentificationObject.heatUUID, function () {
            StatisticService.raceResult = null;
            StatisticService.selectedRaceIdentificationObject = null;
            StatisticService.competitionSelected();
            StatisticService.reloadAngular();
        });
    };
    StatisticService.deleteCompetition = function () {
        ConfirmationService.pleaseConfirm(StatisticService.confirmDeleteCompetition, function () { });
    };
    StatisticService.deleteHeat = function () {
        ConfirmationService.pleaseConfirm(StatisticService.confirmDeleteHeat, function () { });
    };
    StatisticService.reloadAngular = function () {
        angular.element(document.getElementById('statistic')).scope().$apply();
    };
    StatisticService.download = function () {
        var spans = null;
        var cols = 0;
        var filename = "null";
        switch (StatisticService.statisticType) {
            case "P":
                spans = document.getElementById("raceResultStatisticsPilots").getElementsByTagName("span");
                cols = 7;
                filename = "race_history_pilots_(" + new Date().toJSON() + ").csv";
                break;
            case "L":
                spans = document.getElementById("raceResultStatisticsLaps").getElementsByTagName("span");
                cols = 3;
                filename = "race_history_laps_(" + new Date().toJSON() + ").csv";
                break;
        }
        var csv = "";
        csv += "Event:;" + StatisticService.selectedCompetition.description + "\n";
        csv += "Format:;" + StatisticService.selectedRaceIdentificationObject.format + "\n";
        csv += "Class:;" + StatisticService.selectedRaceIdentificationObject.class + "\n";
        csv += "Type:;" + StatisticService.selectedRaceIdentificationObject.type + "\n";
        csv += "Round:;" + StatisticService.selectedRaceIdentificationObject.round + "\n";
        csv += "Heat:;" + StatisticService.selectedRaceIdentificationObject.heat + "\n\n";
        if (StatisticService.selectedRaceIdentificationObject.description) {
            csv += "Description:;" + StatisticService.selectedRaceIdentificationObject.description + "\n";
        }
        csv += "\n";
        for (var idx in spans) {
            if (typeof spans[idx].innerHTML == "undefined") {
                break;
            }
            csv += spans[idx].innerHTML;
            if ((+idx + 1) % cols == 0) {
                csv += "\n";
            }
            else {
                csv += ";";
            }
        }
        var blobdata = new Blob([csv], { type: 'text/csv' });
        filename = filename.replace(" ", "");
        var link = document.createElement("a");
        link.setAttribute("href", window.URL.createObjectURL(blobdata));
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        NotificationService.notify(NotificationService.fileDownloadText);
    };
    StatisticService.selectedCompetition = null;
    StatisticService.selectedRace = null;
    StatisticService.lapResultOrder = ['+time', '+lapNumber'];
    StatisticService.selectionOrder = ['+format', '+class', '+type', '+round', '+heat'];
    StatisticService.raceResult = null;
    StatisticService.statisticType = "P";
    StatisticService.raceIdentificationObjects = [];
    StatisticService.selectedRaceIdentificationObject = null;
    return StatisticService;
}());
/// <reference path="../_reference.ts"/>
var WindowConfigService = (function () {
    function WindowConfigService() {
    }
    WindowConfigService.resetLiveView = function () {
        WindowConfigService.getWindowConfig(function (windowConfig) {
            if (windowConfig) {
                windowConfig.currentCompetitionUUID = "";
                windowConfig.currentHeatUUID = "";
                windowConfig.currentLivePilotUUID = "";
                windowConfig.showLiveResultList = true;
            }
            else {
                windowConfig = new WindowConfig({ currentLivePilotUUID: "", currentCompetitionUUID: "", currentHeatUUID: "", showLiveResultList: true });
            }
            WindowConfigService.update(windowConfig);
        });
    };
    WindowConfigService.endRace = function () {
        document.getElementById('noPilotSelectedForLiveRadioButton').checked = true;
        WindowConfigService.getWindowConfig(function (windowConfig) {
            if (windowConfig) {
                windowConfig.currentHeatUUID = "";
                windowConfig.currentLivePilotUUID = "";
            }
            else {
                windowConfig = new WindowConfig({ currentLivePilotUUID: "", currentHeatUUID: "" });
            }
            WindowConfigService.update(windowConfig);
        });
    };
    WindowConfigService.setCurrentCompetition = function (uuid) {
        WindowConfigService.getWindowConfig(function (windowConfig) {
            if (windowConfig) {
                windowConfig.currentCompetitionUUID = uuid;
            }
            else {
                windowConfig = new WindowConfig({ currentCompetitionUUID: uuid });
            }
            WindowConfigService.update(windowConfig);
        });
    };
    WindowConfigService.setLiveResultListView = function (flag) {
        WindowConfigService.getWindowConfig(function (windowConfig) {
            if (windowConfig) {
                console.log("retrieved", windowConfig);
                console.log("rflag", flag);
                windowConfig.showLiveResultList = flag;
            }
            else {
                windowConfig = new WindowConfig({ showLiveResultList: flag });
                console.log("create", windowConfig);
                console.log("cflag", flag);
            }
            WindowConfigService.update(windowConfig);
        });
    };
    WindowConfigService.setCurrentLivePilot = function (uuid) {
        WindowConfigService.getWindowConfig(function (windowConfig) {
            if (windowConfig) {
                windowConfig.currentLivePilotUUID = uuid;
            }
            else {
                windowConfig = new WindowConfig({ currentLivePilotUUID: uuid });
            }
            WindowConfigService.update(windowConfig);
        });
    };
    WindowConfigService.setCurrentHeat = function (uuid) {
        WindowConfigService.getWindowConfig(function (windowConfig) {
            if (windowConfig) {
                windowConfig.currentHeatUUID = uuid;
            }
            else {
                windowConfig = new WindowConfig({ currentHeatUUID: uuid });
            }
            WindowConfigService.update(windowConfig);
        });
    };
    WindowConfigService.createAndReturnWindowConfig = function () {
        var windowConfig = new WindowConfig({});
        WindowConfigService.update(windowConfig);
        return windowConfig;
    };
    WindowConfigService.getWindowConfig = function (callback) {
        DatabaseService.findByUUID(DatabaseService.store_windowConfig, "1", callback);
    };
    WindowConfigService.update = function (windowConfig) {
        if (windowConfig) {
            DatabaseService.save(DatabaseService.store_windowConfig, windowConfig, function (e) {
            }, function (e) {
                console.log("ex", e);
            });
        }
    };
    return WindowConfigService;
}());
/// <reference path="../_reference.ts"/>
var ConfirmationService = (function () {
    function ConfirmationService() {
    }
    ConfirmationService.pleaseConfirm = function (confirmCallback, cancelCallback) {
        ConfirmationService.confirmCallback = confirmCallback;
        ConfirmationService.cancelCallback = cancelCallback;
        ConfirmationService.showConfirmBox();
    };
    ConfirmationService.showConfirmBox = function () {
        document.getElementById("confirmBox").classList.remove("removed");
    };
    ConfirmationService.hideConfirmBox = function () {
        document.getElementById("confirmBox").classList.add("removed");
    };
    ConfirmationService.confirm = function () {
        ConfirmationService.confirmCallback();
        ConfirmationService.hideConfirmBox();
    };
    ConfirmationService.cancel = function () {
        ConfirmationService.cancelCallback();
        ConfirmationService.hideConfirmBox();
    };
    return ConfirmationService;
}());
/// <reference path="../_reference.ts"/>
'use strict';
var DisplayService = (function () {
    function DisplayService($rootScope) {
        var _this = this;
        this.$rootScope = $rootScope;
        this.loadScreens();
        setInterval(function () { return _this.loadScreens; }, 5000);
    }
    ;
    DisplayService.prototype.loadScreens = function () {
        var _this = this;
        chrome.system.display
            .getInfo(function (screenList) {
            _this.$rootScope.$broadcast('screens:updated', screenList);
        });
    };
    DisplayService.prototype.openScreen = function (left, top, fullscreen, windowID) {
        chrome.app.window.getAll().forEach(function (window) {
            if (window.id.indexOf(windowID) != -1) {
                window.close();
            }
        });
        var fileName = "";
        switch (windowID) {
            case DisplayService.SCREEN2_WINDOW_ID_PREFIX:
                fileName = "screen2.html";
                break;
            case DisplayService.LIVE_WINDOW_ID_PREFIX:
                fileName = "liveScreen.html";
                break;
        }
        chrome.app.window.create(fileName, {
            state: fullscreen ? 'fullscreen' : 'normal',
            id: windowID + (Math.floor(Math.random() * 1000000000)),
            outerBounds: {
                left: left,
                top: top,
                width: 1024,
                height: 768
            }
        });
    };
    DisplayService.SCREEN2_WINDOW_ID_PREFIX = "FPV_RT_SCREEN2_";
    DisplayService.LIVE_WINDOW_ID_PREFIX = "FPV_RT_LIVE_";
    DisplayService.$inject = [
        '$rootScope'
    ];
    return DisplayService;
}());
/// <reference path="../_reference.ts"/>
var RaceResultService = (function () {
    function RaceResultService() {
    }
    RaceResultService.calculateRaceResult = function (raceResult, race, heat, laps) {
        var maxAmountOfLaps = 0;
        raceResult.length = 0;
        heat.pilots.forEach(function (pilot) {
            var disqualified = false;
            var lapsForPilot = laps.filter(function (lap) {
                return lap.pilotUUID == pilot.uuid;
            });
            if (lapsForPilot.length > maxAmountOfLaps) {
                maxAmountOfLaps = lapsForPilot.length;
            }
            if (lapsForPilot && lapsForPilot.length >= 1) {
                disqualified = lapsForPilot[0].disqualified;
                raceResult.push(new RaceResultEntry({
                    amountOfLaps: lapsForPilot.length - 1,
                    pilotUUID: pilot.uuid,
                    pilotNumber: pilot.pilotNumber,
                    pilotName: pilot.firstName + " " + pilot.lastName,
                    manualTimingIndex: pilot.manualTimingIndex,
                    deviceId: pilot.deviceId,
                    raceUUID: race.uuid,
                    lastPassing: lapsForPilot[lapsForPilot.length - 1].startTimestamp,
                    totalTime: RaceResultService.calculateTotalRoundTime(lapsForPilot),
                    lastRoundTime: RaceResultService.round(lapsForPilot[lapsForPilot.length - 1].time + (+lapsForPilot[lapsForPilot.length - 1].penalty)),
                    averageRoundTime: RaceResultService.calculateAverageRoundTime(lapsForPilot),
                    bestRoundTime: RaceResultService.calculateBestRoundTime(lapsForPilot),
                    disqualified: disqualified
                }));
            }
        });
        switch (race.format.toUpperCase()) {
            case "COMPETITION":
                var rank = 1;
                for (var lapsNumber = maxAmountOfLaps; lapsNumber > 0; lapsNumber--) {
                    var filteredResults = raceResult.filter(function (result) {
                        return result.amountOfLaps == lapsNumber && !result.disqualified;
                    });
                    filteredResults.sort(function (a, b) {
                        return +a.totalTimeComputed() - +b.totalTimeComputed();
                    });
                    for (var rIdx in filteredResults) {
                        filteredResults[rIdx].rank = rank;
                        rank++;
                    }
                }
                raceResult.sort(function (a, b) {
                    return +a.rank - +b.rank;
                });
                break;
            case "TRAINING":
            case "QUALIFYING":
                var filteredResults = raceResult.filter(function (result) {
                    return !result.disqualified;
                });
                filteredResults.sort(function (a, b) {
                    return +a.bestRoundTimeComputed() - +b.bestRoundTimeComputed();
                });
                var rank = 1;
                for (var rIdx in filteredResults) {
                    filteredResults[rIdx].rank = rank;
                    rank++;
                }
                break;
        }
        RaceService.reloadAngular();
    };
    RaceResultService.round = function (value) {
        return Math.floor(1000 * value) / 1000.;
    };
    RaceResultService.calculateAverageRoundTime = function (laps) {
        if (laps.length < 2) {
            return 0;
        }
        var sum = 0.;
        laps.forEach(function (lap) {
            sum += lap.time + (+lap.penalty);
        });
        return RaceResultService.round(sum / (laps.length - 1)); //initial passing is a "round" too
    };
    RaceResultService.calculateTotalRoundTime = function (laps) {
        var sum = 0.;
        laps.forEach(function (lap) {
            sum += lap.time + (+lap.penalty);
        });
        return RaceResultService.round(sum);
    };
    RaceResultService.calculateBestRoundTime = function (laps) {
        if (laps.length < 2) {
            return 0;
        }
        var best = laps[1].time + (+laps[1].penalty);
        laps.forEach(function (lap) {
            if (lap.time + (+lap.penalty) < best && lap.time > 0.1) {
                best = lap.time + (+lap.penalty);
            }
            ;
        });
        return RaceResultService.round(best);
    };
    return RaceResultService;
}());
/// <reference path="../_reference.ts"/>
var SubMenuService = (function () {
    function SubMenuService() {
    }
    SubMenuService.init = function () {
        document.getElementById("subMenuUsb").onclick = SubMenuService.usb;
        document.getElementById("subMenuRaceBand").onclick = SubMenuService.raceBand;
        document.getElementById("subMenuClasses").onclick = SubMenuService.classes;
        document.getElementById("subMenuScreen2").onclick = SubMenuService.screen2;
        document.getElementById("subMenuTTS").onclick = SubMenuService.tts;
        document.getElementById("subMenuCloud").onclick = SubMenuService.cloud;
        document.getElementById("subMenuLiveScreen").onclick = SubMenuService.liveScreen;
    };
    SubMenuService.showElementById = function (id) {
        document.getElementById(id).classList.add('visible');
    };
    SubMenuService.hideAllContent = function () {
        document.getElementById('usb').classList.remove('visible');
        document.getElementById('raceBand').classList.remove('visible');
        document.getElementById('classes').classList.remove('visible');
        document.getElementById('screen2').classList.remove('visible');
        document.getElementById('tts').classList.remove('visible');
        document.getElementById('cloud').classList.remove('visible');
        document.getElementById('liveScreen').classList.remove('visible');
    };
    SubMenuService.hideSubMenu = function () {
        document.getElementById('subMenu').classList.remove('visible');
        document.getElementById('subMenuUsb').classList.remove('visible');
        document.getElementById('subMenuRaceBand').classList.remove('visible');
        document.getElementById('subMenuClasses').classList.remove('visible');
        document.getElementById('subMenuScreen2').classList.remove('visible');
        document.getElementById('subMenuTTS').classList.remove('visible');
        document.getElementById('subMenuCloud').classList.remove('visible');
        document.getElementById('liveScreen').classList.remove('visible');
    };
    SubMenuService.usb = function () {
        SubMenuService.hideAllContent();
        SubMenuService.showElementById("usb");
    };
    SubMenuService.raceBand = function () {
        SubMenuService.hideAllContent();
        SubMenuService.showElementById("raceBand");
    };
    SubMenuService.classes = function () {
        SubMenuService.hideAllContent();
        SubMenuService.showElementById("classes");
    };
    SubMenuService.screen2 = function () {
        SubMenuService.hideAllContent();
        SubMenuService.showElementById("screen2");
    };
    SubMenuService.tts = function () {
        SubMenuService.hideAllContent();
        SubMenuService.showElementById("tts");
    };
    SubMenuService.liveScreen = function () {
        SubMenuService.hideAllContent();
        SubMenuService.showElementById("liveScreen");
    };
    SubMenuService.cloud = function () {
        SubMenuService.hideAllContent();
        SubMenuService.showElementById("cloud");
        setTimeout(CloudSyncService.readyToTransferAccount, 500);
    };
    SubMenuService.showConfigurationSubMenu = function () {
        SubMenuService.setSubMenuSize(7);
        SubMenuService.showElementById("subMenuUsb");
        SubMenuService.showElementById("subMenuRaceBand");
        SubMenuService.showElementById("subMenuClasses");
        SubMenuService.showElementById("subMenuScreen2");
        SubMenuService.showElementById("subMenuTTS");
        SubMenuService.showElementById("subMenuCloud");
        SubMenuService.showElementById("subMenuLiveScreen");
        SubMenuService.showElementById("subMenu");
        SubMenuService.showElementById("usb");
    };
    SubMenuService.setSubMenuSize = function (size) {
        if (size > 0 && size <= 7) {
            document.getElementById("subMenu").className = '';
            document.getElementById("subMenu").classList.add("size" + size);
        }
    };
    return SubMenuService;
}());
/// <reference path="../_reference.ts"/>
'use strict';
var ManageScreen2Service = (function () {
    function ManageScreen2Service($rootScope) {
        var _this = this;
        this.$rootScope = $rootScope;
        this.loadScreens();
        setInterval(function () { return _this.loadScreens; }, 5000);
    }
    ;
    ManageScreen2Service.prototype.loadScreens = function () {
        var _this = this;
        chrome.system.display
            .getInfo(function (screenList) {
            _this.$rootScope.$broadcast('screens:updated', screenList);
        });
    };
    ManageScreen2Service.prototype.openScreen2 = function (left, top, fullscreen) {
        chrome.app.window.getAll().forEach(function (window) {
            if (window.id.indexOf(ManageScreen2Service.SCREEN2_WINDOW_ID_PREFIX) != -1) {
                window.close();
            }
        });
        chrome.app.window.create("screen2.html", {
            state: fullscreen ? 'fullscreen' : 'normal',
            id: ManageScreen2Service.SCREEN2_WINDOW_ID_PREFIX + (Math.floor(Math.random() * 1000000000)),
            outerBounds: {
                left: left,
                top: top,
                width: 1024,
                height: 768
            }
        });
    };
    ManageScreen2Service.SCREEN2_WINDOW_ID_PREFIX = "FPV_RT_SCREEN2_";
    ManageScreen2Service.$inject = [
        '$rootScope'
    ];
    return ManageScreen2Service;
}());
/// <reference path="../_reference.ts"/>
var RaceSimulationService = (function () {
    function RaceSimulationService() {
    }
    RaceSimulationService.stopSimulation = function () {
        RaceSimulationService.stop = true;
        clearInterval(RaceSimulationService.interval);
    };
    RaceSimulationService.simulateHeat = function (heat, raceLength) {
        RaceSimulationService.stop = false;
        RaceSimulationService.simulateAllDrivers(heat.pilots, 1000, 0);
        var timeFrom = 0;
        RaceSimulationService.interval = setInterval(function () {
            timeFrom += RaceSimulationService.intervalTime;
            RaceSimulationService.simulateAllDrivers(heat.pilots, RaceSimulationService.intervalTime - 5000, timeFrom);
        }, RaceSimulationService.intervalTime);
    };
    RaceSimulationService.simulateAllDrivers = function (pilots, maxTimeout, timeFrom) {
        var temp = timeFrom;
        pilots.forEach(function (p) {
            var randomTime = (Math.random() * maxTimeout) + temp;
            setTimeout(function () {
                if (!RaceSimulationService.stop) {
                    console.log("time: " + randomTime + " " + p.firstName + " " + p.lastName);
                    RaceService.generateLap(p, "" + (randomTime / 1000));
                }
            }, randomTime - temp);
        });
    };
    RaceSimulationService.intervalTime = 10000;
    RaceSimulationService.stop = false;
    return RaceSimulationService;
}());
/// <reference path="../_reference.ts"/>
function ClassController() {
    this.service = ClassService;
}
/// <reference path="../_reference.ts"/>
function ConfirmationController() {
    this.service = ConfirmationService;
}
/// <reference path="../_reference.ts"/>
function PilotController() {
    this.service = PilotService;
    this.competitionService = CompetitionService;
    this.raceBandService = RaceBandService;
    this.classService = ClassService;
}
/// <reference path="../_reference.ts"/>
function UsbController() {
    this.devices = SerialConnectionService.DEVICES;
    this.isReady = SerialConnectionService.isReady;
    this.selectDevice = function (device) {
        SerialConnectionService.selectDevice(device);
    };
}
/// <reference path="../_reference.ts"/>
'use strict';
var ManageLiveScreenController = (function () {
    function ManageLiveScreenController($scope, displayService) {
        var _this = this;
        this.$scope = $scope;
        this.displayService = displayService;
        $scope.screens = [];
        $scope.vm = this;
        $scope.raceService = RaceService;
        $scope.allPilotsCheckBoxEnabled = true;
        $scope.$on('screens:updated', function (event, data) {
            _this.updateScreens(event, data);
        });
    }
    ManageLiveScreenController.prototype.updateScreens = function (event, data) {
        this.$scope.screens = data;
        angular.element(document.getElementById('liveScreen')).scope().$apply();
    };
    ManageLiveScreenController.prototype.showLiveScreen = function (screen) {
        this.displayService.openScreen(screen.workArea.left, screen.workArea.top, true, DisplayService.LIVE_WINDOW_ID_PREFIX);
    };
    ManageLiveScreenController.prototype.allPilotsCheckBoxChanged = function () {
        WindowConfigService.setLiveResultListView(this.$scope.allPilotsCheckBoxEnabled);
    };
    ManageLiveScreenController.prototype.selectedPilotChanged = function (pilotUUID) {
        WindowConfigService.setCurrentLivePilot(pilotUUID);
    };
    ManageLiveScreenController.$inject = [
        '$scope',
        'DisplayService'
    ];
    return ManageLiveScreenController;
}());
/// <reference path="../_reference.ts"/>
function RaceBandController() {
    this.service = RaceBandService;
}
/// <reference path="../_reference.ts"/>
function StatisticController() {
    this.service = StatisticService;
    this.raceService = RaceService;
    this.competitionService = CompetitionService;
}
/// <reference path="../_reference.ts"/>
var UserController = (function () {
    function UserController() {
        this.service = UserService;
    }
    return UserController;
}());
/// <reference path="../_reference.ts"/>
function CompetitionController() {
    this.service = CompetitionService;
    this.pilotService = PilotService;
    this.raceService = RaceService;
    this.classService = ClassService;
    this.cloudSyncService = CloudSyncService;
    this.numbersOnly = /^\d+$/;
}
/// <reference path="../_reference.ts"/>
function NotificationController() {
    this.service = NotificationService;
}
/// <reference path="../_reference.ts"/>
function RaceController() {
    this.service = RaceService;
    this.competitionService = CompetitionService;
    this.classService = ClassService;
    this.raceBandService = RaceBandService;
    this.editLapsService = EditLapsService;
    this.numbersOnly = /^\d+$/;
}
/// <reference path="../_reference.ts"/>
function TTSController() {
    this.service = TTSService;
}
/// <reference path="../_reference.ts"/>
/// <reference path="../_reference.ts"/>
/// <reference path="_reference.ts"/>
/// <reference path='controller/ManageScreen2Controller.ts' /> 
'use strict';
// https://github.com/angular/angular.js/issues/11932
var app = angular.module('app', [], function ($provide) {
    // Prevent Angular from sniffing for the history API
    // since it's not supported in packaged apps.
    $provide.decorator('$window', function ($delegate) {
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
    .addEventListener("DOMContentLoaded", function () {
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
        .init(function () {
        DatabaseService.replaceContent(DatabaseService.store_liveResults, [], function (e) { });
        SerialConnectionService.init();
        MenuService.init();
        SubMenuService.init();
        UserService.init(function () {
            RaceBandService.init(function () {
                ClassService.init(function () {
                    PilotService.init(function () {
                        CompetitionService.init(function () {
                            RaceService.init(function () {
                                CloudSyncService.init();
                                WindowConfigService.resetLiveView();
                                ManualTimingService.init();
                            });
                        });
                    });
                });
            });
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
/// <reference path='model/requests/BaseSyncRequest.ts' />
/// <reference path='controller/ManageScreen2Controller.ts' /> 
/// <reference path='definition/jquery.d.ts' />
/// <reference path='definition/angular.d.ts' />
/// <reference path='definition/custom.d.ts' />
/// <reference path='initScreen2.ts' />
/// <reference path='initLiveScreen.ts' />
/// <reference path='service/UUIDService.ts' />
/// <reference path='model/BaseEntity.ts' />
/// <reference path='model/Classs.ts' />
/// <reference path='model/CompetitionConfig.ts' />
/// <reference path='model/Competition.ts' />
/// <reference path='model/OnlineRegistration.ts' />
/// <reference path='model/HeatListViewObject.ts' />
/// <reference path='model/HeatResultViewObject.ts' />
/// <reference path='model/Heat.ts' />
/// <reference path='model/Lap.ts' />
/// <reference path='model/Pilot.ts' />
/// <reference path='model/QualifiedPilot.ts' />
/// <reference path='model/RaceBand.ts' />
/// <reference path='model/RaceIdentificationObject.ts' />
/// <reference path='model/RaceResultEntry.ts' />
/// <reference path='model/RaceResult.ts' />
/// <reference path='model/Race.ts' />
/// <reference path='model/User.ts' />
/// <reference path='model/requests/ClassSyncRequest.ts' />
/// <reference path='model/requests/CompetitionSyncRequest.ts' />
/// <reference path='model/requests/PilotSyncRequest.ts' />
/// <reference path='model/requests/RaceBandSyncRequest.ts' />
/// <reference path='model/requests/RaceSyncRequest.ts' />
/// <reference path='model/RoundResultEntry.ts' />
/// <reference path='model/Round.ts' />
/// <reference path='model/Timer.ts' />
/// <reference path='model/UpcomingHeatViewObject.ts' />
/// <reference path='model/WindowConfig.ts' />
/// <reference path='service/AjaxService.ts' />
/// <reference path='service/MenuService.ts' />
/// <reference path='service/RaceService.ts' />
/// <reference path='service/TTSService.ts' />
/// <reference path='service/ClassService.ts' />
/// <reference path='service/DatabaseFillingService.ts' />
/// <reference path='service/NotificationService.ts' />
/// <reference path='service/SerialConnectionService.ts' />
/// <reference path='service/UserService.ts' />
/// <reference path='service/CloudSyncService.ts' />
/// <reference path='service/DatabaseService.ts' />
/// <reference path='service/PilotService.ts' />
/// <reference path='service/SoundService.ts' />
/// <reference path='service/CompetitionService.ts' />
/// <reference path='service/EditLapsService.ts' />
/// <reference path='service/RaceBandService.ts' />
/// <reference path='service/StatisticService.ts' />
/// <reference path='service/WindowConfigService.ts' />
/// <reference path='service/ConfirmationService.ts' />
/// <reference path='service/DisplayService.ts' />
/// <reference path='service/RaceResultService.ts' />
/// <reference path='service/SubMenuService.ts' />
/// <reference path='service/ManageScreen2Service.ts' />
/// <reference path='service/RaceSimulationService.ts' />
/// <reference path='controller/ClassController.ts' />
/// <reference path='controller/ConfirmationController.ts' />
/// <reference path='controller/PilotController.ts' />
/// <reference path='controller/UsbController.ts' />
/// <reference path='controller/CloudController.ts' />
/// <reference path='controller/ManageLiveScreenController.ts' />
/// <reference path='controller/RaceBandController.ts' />
/// <reference path='controller/StatisticController.ts' />
/// <reference path='controller/UserController.ts' />
/// <reference path='controller/CompetitionController.ts' />
/// <reference path='controller/NotificationController.ts' />
/// <reference path='controller/RaceController.ts' />
/// <reference path='controller/TTSController.ts' />
/// <reference path='interfaces/ILiveScreen.ts' />
/// <reference path='interfaces/IManageLiveScreenScope.ts' />
/// <reference path='interfaces/IResultScreen.ts' />
/// <reference path='interfaces/IManageScreen2Scope.ts' />
/// <reference path='initMainScreen.ts' /> 
/// <reference path="../_reference.ts"/>
var CloudController = (function () {
    function CloudController() {
        this.service = CloudSyncService;
        this.userService = UserService;
    }
    return CloudController;
}());
/// <reference path="../_reference.ts"/>
var ManualTimingService = (function () {
    function ManualTimingService() {
    }
    ManualTimingService.init = function () {
        document.addEventListener("keypress", ManualTimingService.keyInput, true);
    };
    ManualTimingService.keyInput = function (e) {
        if (e.keyCode >= "0".charCodeAt(0) && e.keyCode <= "9".charCodeAt(0) && RaceService.CURRENT_STATUS.raceStarted) {
            var key = +String.fromCharCode(e.keyCode);
            var fakeSerialMessage = ["%", "MANUAL", "" + key, "" + ((new Date().getTime() - RaceService.currentHeat.exactStartTime) / 1000)];
            console.log("TIME: ", fakeSerialMessage);
            RaceService.devicePassed(fakeSerialMessage, true);
        }
        return false;
    };
    return ManualTimingService;
}());
