interface IRaceResult extends ng.IScope {
    vm: ResultController;
    races: Race[];
    competition: Competition;
    selectedRace: Race;
    competitionResult: RaceResultEntry[];
    showError: boolean;
    showPilots: boolean;
    showOnlineRegistration: boolean;
    classPilotsList: ClassPilots[];
}
