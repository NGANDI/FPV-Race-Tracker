/// <reference path="../_reference.ts"/>
class DatabaseFillingService {

    public static fillDefaultRaceBands(callback) {
        DatabaseService.save(DatabaseService.store_raceBands, new RaceBand({
            value: "Race Band 1"
        }), function() { }, function() { });
        DatabaseService.save(DatabaseService.store_raceBands, new RaceBand({
            value: "Race Band 2"
        }), function() { }, function() { });
        DatabaseService.save(DatabaseService.store_raceBands, new RaceBand({
            value: "Race Band 3"
        }), function() { }, function() { });
        DatabaseService.save(DatabaseService.store_raceBands, new RaceBand({
            value: "Race Band 4"
        }), function() { callback(); }, function() { });
    }

    public static fillDefaultClasses(callback) {
        DatabaseService.save(DatabaseService.store_classes, new Classs({
            name: "MINI 250"
        }), function() { }, function() { });
        DatabaseService.save(DatabaseService.store_classes, new Classs({
            name: "Super MINI 330"
        }), function() { }, function() { });
        DatabaseService.save(DatabaseService.store_classes, new Classs({
            name: "STANDARD 600"
        }), function() { callback(); }, function() { });
    }


    public static fillDefaultCompetitions(callback) {
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
            DatabaseService.save(DatabaseService.store_races, race3, function() {
                DatabaseService.save(DatabaseService.store_competitions, competition, function() {
                    DatabaseService.save(DatabaseService.store_races, race1, function() {
                        DatabaseService.save(DatabaseService.store_races, race2, function() {
                            callback();
                        }, function() { });
                    }, function() { });
                }, function() { });
            }, function() { });
        }
    }


    public static fillDefaultPilots(callback) {
        DatabaseService.save(DatabaseService.store_pilots, new Pilot({
            firstName: "Pilot",
            lastName: "01",
            alias: "sample1",
            country: "Austria",
            deviceId: "0000000",
            pilotNumber: "1"
        }), function() { }, function() { });
        DatabaseService.save(DatabaseService.store_pilots, new Pilot({
            firstName: "Pilot",
            lastName: "02",
            alias: "sample2",
            country: "Austria",
            deviceId: "0000001",
            pilotNumber: "2"
        }), function() { callback(); }, function() { });
    }

    public static fillDefaultUser(callback) {
        DatabaseService.save(DatabaseService.store_user, new User({
            name: "",
            passwordHash: ""
        }), function() { callback(); }, function() { });
    }
}

