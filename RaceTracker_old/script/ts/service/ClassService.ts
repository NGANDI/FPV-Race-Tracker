/// <reference path="../_reference.ts"/>
class ClassService {

    public static classes: Classs[] = [];
    public static newClass: Classs = null;

    public static init(callback) {
        ClassService.newClass = new Classs({});
        DatabaseService.readAll(DatabaseService.store_classes, function(classes: Classs[]) {
            ClassService.setClasses(classes);
            if (callback)
                callback();
        });
    }

    public static getFirstClass() {
        if (ClassService.classes && ClassService.classes.length > 0) {
            return ClassService.classes[0];
        }
        return null;
    }

    public static getClassByUUID(uuid: string) {
        for (var idx in ClassService.classes) {
            if (ClassService.classes[idx].uuid == uuid) {
                return ClassService.classes[idx];
            }
        }
        return null;
    }
    public static delete(classs: Classs) {
        DatabaseService.delete(DatabaseService.store_classes, classs, function(e) {
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
        }, function() { });
    }
    public static classUpdated(classs: Classs) {
        if (classs.name.length > 0) {
            DatabaseService.save(DatabaseService.store_classes, classs, function(e) {
                NotificationService.notify("Class updated!");
                PilotService.pilots.forEach((pilot) => {
                    if (pilot.classs && pilot.classs.uuid == classs.uuid) {
                        pilot.classs = classs;
                        PilotService.update(pilot);
                    }
                });
                RaceService.races.forEach(function(race) {
                    if (race.classs.uuid == classs.uuid) {
                        race.classs = classs;
                        RaceService.update(race);
                    }
                });
                CompetitionService.competitions.forEach(function(competition) {
                    competition.classes.forEach((competitionClasss) => {
                        if (competitionClasss.uuid == competitionClasss.uuid) {
                            competitionClasss = classs;
                            CompetitionService.update(competition);
                        }
                    });
                });
            }, function() { });
        }
    }

    public static classCreated() {
        if (ClassService.newClass.name && ClassService.newClass.name.length > 0) {
            DatabaseService.save(DatabaseService.store_classes, ClassService.newClass, function(e) {
                ClassService.classes.push(new Classs(ClassService.newClass));
                ClassService.newClass.name = "";
                ClassService.newClass.uuid = UUIDService.next();
                NotificationService.notify("Class updated!");
            }, function() { });
        }
        else {
            NotificationService.notify("Please enter a valid value!");
        }
    }

    public static setClasses(classes: Classs[]) {
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
    }

    public static reloadAngular() {
        if (!angular.element(document.getElementById('classes')).scope().$$phase) {
            angular.element(document.getElementById('classes')).scope().$apply();
        }
        else {
            console.log("reload angular failed!!!");
            setTimeout(ClassService.reloadAngular, 200);
        }
    }

}

