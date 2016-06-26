class Race extends BaseEntity {
    public competitionUUID: string;
    public format: string;
    public type: string;
    public classs: Classs;
    public rounds: Round[];
    public qualificationResults: RoundResultEntry[];

    constructor(json: any) {
        super(json);
        this.competitionUUID = json.competitionUUID;
        this.rounds = Race.mapRounds(json.rounds);
        this.type = json.type;
        this.format = json.format;
        this.classs = json.classs ? new Classs(json.classs) : null;
        this.qualificationResults = Race.mapQualificationResults(json.qualificationResults);
    }

    public static mapRounds(rounds) {
        var roundsObjects: Round[] = [];
        for (var idx in rounds) {
            roundsObjects.push(new Round(rounds[idx]));
        }
        return roundsObjects;
    }

    public static mapQualificationResults(qualificationResults) {
        var qualificationResultObjects: RoundResultEntry[] = [];
        for (var idx in qualificationResults) {
            qualificationResultObjects.push(new RoundResultEntry(qualificationResults[idx]));
        }
        return qualificationResultObjects;
    }
}

