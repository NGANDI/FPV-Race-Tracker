class HeatListViewObject extends BaseEntity {
    public heatNumber: number;
    public roundNumber: number;
    public roundDescription: string;
    public roundUUID: string;
    public raceUUID: string;
    public roundType: string;
    public raceClass: Classs;
    public raceFormat: string;

    constructor(json: any) {
        super(json);
        this.heatNumber = json.heatNumber;
        this.roundNumber = json.roundNumber;
        this.roundDescription = json.roundDescription;
        this.roundUUID = json.roundUUID;
        this.raceUUID = json.raceUUID;
        this.roundType = json.roundType;
        this.raceFormat = json.raceFormat;
        this.raceClass = json.raceClass;
    }
}