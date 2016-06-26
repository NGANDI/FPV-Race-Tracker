class RaceResult extends BaseEntity {
    public results: RaceResultEntry[];
    public laps: Lap[];
    public timestamp: Date;

    constructor(json: any) {
        super(json);
        this.results = RaceResult.mapRaceResults(json.results);
        this.laps = RaceResult.mapLaps(json.laps);
        this.timestamp = json.timestamp ? new Date(json.timestamp) : null;
    }

    public static mapRaceResults(raceResults) {
        var raceResultObjects: RaceResultEntry[] = [];
        for (var idx in raceResults) {
            raceResultObjects.push(new RaceResultEntry(raceResults[idx]));
        }
        return raceResultObjects;
    }

    public static mapLaps(laps) {
        var lapObjects: Lap[] = [];
        for (var idx in laps) {
            lapObjects.push(new Lap(laps[idx]));
        }
        return lapObjects;
    }
}