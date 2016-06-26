class RaceIdentificationObject extends BaseEntity {
    public format: string;
    public class: string;
    public round: string;
    public type: string;
    public heat: string;
    public description: string;
    public result: RaceResult;
    public heatUUID: string;
    public raceUUID: string;

    constructor(json: any) {
        super(json);
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
}