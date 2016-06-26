class Heat extends BaseEntity {
    public heatNumber: number;
    public pilots: Pilot[];
    public heatResult: RaceResult;
    public exactStartTime: number;
    public startTime: Date;

    constructor(json: any) {
        super(json);
        this.pilots = Heat.mapPilots(json.pilots);
        this.heatNumber = json.heatNumber;
        this.heatResult = json.heatResult ? new RaceResult(json.heatResult) : null;
        this.exactStartTime = json.exactStartTime;
        this.startTime = json.startTime ? new Date(json.startTime) : null;
    }

    public static mapPilots(pilots) {
        var pilotObjects: Pilot[] = [];
        for (var idx in pilots) {
            pilotObjects.push(new Pilot(pilots[idx]));
        }
        return pilotObjects;
    }
}