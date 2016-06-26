class CompetitionConfig extends BaseEntity {
    public classs: Classs;
    public roundsTraining: number;
    public roundsQualifying: number;
    public roundsCompetition: number;
    public typeTraining: string;
    public typeQualifying: string;
    public typeCompetition: string;

    constructor(json: any) {
        super(json);
        this.classs = json.classs;
        this.roundsTraining = json.roundsTraining ? json.roundsTraining : 1;
        this.roundsQualifying = json.roundsQualifying ? json.roundsQualifying : 1;
        this.roundsCompetition = json.roundsCompetition ? json.roundsCompetition : 1;
        this.typeTraining = json.typeTraining ? json.typeTraining : 'Time';
        this.typeQualifying = json.typeQualifying ? json.typeQualifying : 'Time';
        this.typeCompetition = json.typeCompetition ? json.typeCompetition : 'Time';
    }
}