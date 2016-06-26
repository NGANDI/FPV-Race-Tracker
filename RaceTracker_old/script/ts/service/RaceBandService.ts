/// <reference path="../_reference.ts"/>
class RaceBandService {

    public static raceBands: RaceBand[] = [];
    public static newRaceBand: RaceBand = null;

    public static init(callback) {
        RaceBandService.newRaceBand = new RaceBand({});
        DatabaseService.readAll(DatabaseService.store_raceBands, function(raceBands: RaceBand[]) {
            RaceBandService.setRaceBands(raceBands);
            if (callback)
                callback();
        });
    }

    public static getRaceBandByIndex(index: number) {
        if (RaceBandService.raceBands.length > index) {
            return RaceBandService.raceBands[index].value;
        }
        return "";
    }

    public static getRaceBandByUUID(uuid: string) {
        for (var idx in RaceBandService.raceBands) {
            if (RaceBandService.raceBands[idx].uuid == uuid) {
                return RaceBandService.raceBands[idx];
            }
        }
        return null;
    }

    public static delete(raceBand) {
        DatabaseService.delete(DatabaseService.store_raceBands, raceBand, function(e) {
            NotificationService.notify("RaceBand deleted!");
            for (var idx in RaceBandService.raceBands) {
                if (RaceBandService.raceBands[idx].uuid == raceBand.uuid) {
                    RaceBandService.raceBands.splice(idx, 1);
                    break;
                }
            }
            PilotService.pilots.forEach((pilot) => {
                if (pilot.assignedRaceBand && pilot.assignedRaceBand.uuid == raceBand.uuid) {
                    pilot.assignedRaceBand = null;
                    PilotService.update(pilot);
                }
            });
            RaceBandService.reloadAngular();
        }, function() { });
    }

    public static raceBandUpdated(raceBand: RaceBand) {
        if (raceBand.value.length > 0) {
            DatabaseService.save(DatabaseService.store_raceBands, raceBand, function(e) {
                NotificationService.notify("RaceBand updated!");
                PilotService.pilots.forEach((pilot) => {
                    if (pilot.assignedRaceBand && pilot.assignedRaceBand.uuid == raceBand.uuid) {
                        pilot.assignedRaceBand = raceBand;
                        PilotService.update(pilot);
                    }
                });
            }, function() { });
        }
    }

    public static raceBandCreated() {
        if (RaceBandService.newRaceBand.value && RaceBandService.newRaceBand.value.length > 0) {
            DatabaseService.save(DatabaseService.store_raceBands, RaceBandService.newRaceBand, function(e) {
                RaceBandService.raceBands.push(new RaceBand(RaceBandService.newRaceBand));
                RaceBandService.newRaceBand.value = "";
                RaceBandService.newRaceBand.uuid = UUIDService.next();
                NotificationService.notify("RaceBand updated!");
            }, function() { });
        }
        else {
            NotificationService.notify("Please enter a valid value!");
        }
    }

    public static setRaceBands(raceBands: RaceBand[]) {
        RaceBandService.raceBands.length = 0;
        Array.prototype.push.apply(RaceBandService.raceBands, raceBands);
        if (RaceBandService.raceBands.length == 0) {
            DatabaseFillingService.fillDefaultRaceBands(RaceBandService.init);
        }
        RaceBandService.reloadAngular();
    }

    public static reloadAngular() {
        if (!angular.element(document.getElementById('raceBand')).scope().$$phase) {
            angular.element(document.getElementById('raceBand')).scope().$apply();
        }
        else {
            console.log("reload angular failed!!!");
            setTimeout(RaceBandService.reloadAngular, 200);
        }
    }
}