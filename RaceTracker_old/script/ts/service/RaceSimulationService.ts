/// <reference path="../_reference.ts"/>
class RaceSimulationService {

    private static intervalTime: number = 10000;
    private static interval: any;
    private static stop: boolean = false;

    public static stopSimulation() {
        RaceSimulationService.stop = true;
        clearInterval(RaceSimulationService.interval);
    }

    public static simulateHeat(heat: Heat, raceLength: number) {
        RaceSimulationService.stop = false;
        RaceSimulationService.simulateAllDrivers(heat.pilots, 1000, 0);
        var timeFrom = 0;
        RaceSimulationService.interval = setInterval(function() {
            timeFrom += RaceSimulationService.intervalTime;
            RaceSimulationService.simulateAllDrivers(heat.pilots, RaceSimulationService.intervalTime - 5000, timeFrom);
        }, RaceSimulationService.intervalTime);
    }

    public static simulateAllDrivers(pilots: Pilot[], maxTimeout: number, timeFrom: number) {
        var temp = timeFrom;
        pilots.forEach(function(p) {
            var randomTime = (Math.random() * maxTimeout) + temp;
            setTimeout(function() {
                if (!RaceSimulationService.stop) {
                    console.log("time: " + randomTime + " " + p.firstName + " " + p.lastName);
                    RaceService.generateLap(p, "" + (randomTime / 1000));
                }
            }, randomTime - temp);
        });
    }


}