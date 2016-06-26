/// <reference path="../ts/definition/jquery.d.ts" />
/// <reference path="../ts/definition/angular.d.ts" />
/// <reference path="../ts/definition/custom.d.ts" />
declare class BaseSyncRequest {
    user: User;
    constructor(user: User);
}
declare class ManageScreen2Controller {
    private $scope;
    private displayService;
    static $inject: string[];
    constructor($scope: IManageScreen2Scope, displayService: DisplayService);
    updateScreens(event: any, data: any): void;
    showScreen2(screen: any): void;
}
declare class UUIDService {
    static next(): string;
}
declare class BaseEntity {
    uuid: string;
    saved: Date;
    synced: Date;
    deleted: boolean;
    constructor(json: any);
}
declare class Classs extends BaseEntity {
    name: string;
    constructor(json: any);
}
declare class CompetitionConfig extends BaseEntity {
    classs: Classs;
    roundsTraining: number;
    roundsQualifying: number;
    roundsCompetition: number;
    typeTraining: string;
    typeQualifying: string;
    typeCompetition: string;
    constructor(json: any);
}
declare class Competition extends BaseEntity {
    description: string;
    location: string;
    dateFrom: Date;
    dateTo: Date;
    pilots: Pilot[];
    classes: Classs[];
    competitionConfigs: CompetitionConfig[];
    onlineRegistrationEnd: Date;
    onlineRegistrationPossible: boolean;
    onlineRegistrationKey: string;
    constructor(json: any);
    static mapCompetitionConfigs(configs: any): CompetitionConfig[];
    static mapClasses(classes: any): Classs[];
    static mapPilots(pilots: any): Pilot[];
}
declare class HeatListViewObject extends BaseEntity {
    heatNumber: number;
    roundNumber: number;
    roundDescription: string;
    roundUUID: string;
    raceUUID: string;
    roundType: string;
    raceClass: Classs;
    raceFormat: string;
    constructor(json: any);
}
declare class HeatResultViewObject extends BaseEntity {
    heatNumber: number;
    roundNumber: number;
    roundDescription: string;
    competitionDescription: string;
    roundType: string;
    raceClass: Classs;
    raceFormat: string;
    raceResultEntries: RaceResultEntry[];
    heatTimestamp: Date;
    constructor(json: any);
}
declare class Heat extends BaseEntity {
    heatNumber: number;
    pilots: Pilot[];
    heatResult: RaceResult;
    exactStartTime: number;
    startTime: Date;
    constructor(json: any);
    static mapPilots(pilots: any): Pilot[];
}
declare class Lap extends BaseEntity {
    raceUUID: string;
    pilotUUID: string;
    pilotName: string;
    lapNumber: number;
    startTime: number;
    endTime: number;
    time: number;
    penalty: number;
    totalTime: number;
    disqualified: boolean;
    startTimestamp: boolean;
    constructor(json: any);
}
declare class Pilot extends BaseEntity {
    firstName: string;
    lastName: string;
    alias: string;
    phone: string;
    country: string;
    email: string;
    club: string;
    deviceId: string;
    pilotNumber: number;
    assignedRaceBand: RaceBand;
    classs: Classs;
    onlineRegistrationUUID: String;
    constructor(json: any);
}
declare class QualifiedPilot extends Pilot {
    rank: number;
    amountOfLaps: number;
    lapTimes: number[];
    lapTimeSum: number;
    constructor(json: any);
}
declare class RaceBand extends BaseEntity {
    value: string;
    constructor(json: any);
}
declare class RaceIdentificationObject extends BaseEntity {
    format: string;
    class: string;
    round: string;
    type: string;
    heat: string;
    description: string;
    result: RaceResult;
    heatUUID: string;
    raceUUID: string;
    constructor(json: any);
}
declare class RaceResultEntry extends BaseEntity {
    raceUUID: string;
    round: number;
    heat: number;
    pilotUUID: string;
    pilotNumber: string;
    pilotName: string;
    rank: number;
    amountOfLaps: number;
    totalTime: number;
    lastRoundTime: number;
    bestRoundTime: number;
    averageRoundTime: number;
    deviceId: string;
    disqualified: boolean;
    lastPassing: number;
    constructor(json: any);
    saveOrderedRank(rank: any): void;
    bestRoundTimeComputed(): number;
    totalTimeComputed(): number;
    customEquals(other: RaceResultEntry): boolean;
}
declare class RaceResult extends BaseEntity {
    results: RaceResultEntry[];
    laps: Lap[];
    timestamp: Date;
    constructor(json: any);
    static mapRaceResults(raceResults: any): RaceResultEntry[];
    static mapLaps(laps: any): Lap[];
}
declare class Race extends BaseEntity {
    competitionUUID: string;
    format: string;
    type: string;
    classs: Classs;
    rounds: Round[];
    qualificationResults: RoundResultEntry[];
    constructor(json: any);
    static mapRounds(rounds: any): Round[];
    static mapQualificationResults(qualificationResults: any): RoundResultEntry[];
}
declare class User extends BaseEntity {
    name: string;
    email: string;
    registered: boolean;
    constructor(json: any);
}
declare class ClassSyncRequest extends BaseSyncRequest {
    data: Classs[];
    constructor(user: User, data: Classs[]);
}
declare class CompetitionSyncRequest extends BaseSyncRequest {
    data: Competition[];
    constructor(user: User, data: Competition[]);
}
declare class PilotSyncRequest extends BaseSyncRequest {
    data: Pilot[];
    constructor(user: User, data: Pilot[]);
}
declare class RaceBandSyncRequest extends BaseSyncRequest {
    data: RaceBand[];
    constructor(user: User, data: RaceBand[]);
}
declare class RaceSyncRequest extends BaseSyncRequest {
    data: Race[];
    constructor(user: User, data: Race[]);
}
declare class RoundResultEntry extends BaseEntity {
    pilotUUID: string;
    pilotNumber: string;
    pilotName: string;
    rank: number;
    lapTimes: number[];
    lapTimesSum: number;
    deviceId: string;
    disqualified: boolean;
    constructor(json: any);
}
declare class Round extends BaseEntity {
    roundNumber: number;
    amountOfHeats: number;
    description: string;
    blockingTime: number;
    countdown: number;
    duration: number;
    amountOfLaps: number;
    lapDistance: number;
    amountOfQualifiedPilots: number;
    heats: Heat[];
    timestamp: Date;
    competitionResults: RaceResultEntry[];
    constructor(json: any);
    static mapHeats(heats: any): Heat[];
    static mapCompetitionResults(competitionResults: any): RaceResultEntry[];
}
declare class Timer {
    private intervalTime;
    lastExecution: number;
    internalTimer: any;
    countdownValue: number;
    private initCountdownValue;
    finishCallback: any;
    updateCallback: any;
    private startPlayed;
    private lastSecond;
    private reloadCallback;
    private stop;
    constructor();
    startTimer(countdownValue: number, finishCallback: any, startPlayed: any, reloadCallback: any): Timer;
    setTimerStopable(): void;
    stopTimer(): void;
    private updateCountdown();
    private getCurrentMillis();
}
declare class UpcomingHeatViewObject extends BaseEntity {
    heatNumber: number;
    roundNumber: number;
    roundDescription: string;
    roundType: string;
    raceClass: Classs;
    raceFormat: string;
    pilots: Pilot;
    heatTimestamp: Date;
    constructor(json: any);
}
declare class WindowConfig extends BaseEntity {
    currentCompetitionUUID: string;
    liveScreenBackgroundColorCode: string;
    currentHeatUUID: string;
    currentLivePilotUUID: string;
    showLiveResultList: boolean;
    constructor(json: any);
}
declare class AjaxService {
    static port: string;
    static host: string;
    static protocol: string;
    static path_syncPilots: string;
    static path_syncCompetitions: string;
    static path_syncRaces: string;
    static path_syncRaceBands: string;
    static path_syncClasses: string;
    static path_syncUser: string;
    static path_createAccountTransfer: string;
    static path_transferAccount: string;
    static path_getOnlinePilots: string;
    static path_removeRegistration: string;
    static send(path: string, request: any, callback: any): void;
}
declare class MenuService {
    static init(): void;
    static showElementById(id: string): void;
    static hideAll(): void;
    static events(): void;
    static races(): void;
    static pilots(): void;
    static configuration(): void;
    static statistics(): void;
}
declare class RaceService {
    static pilotToScan: Pilot;
    static CURRENT_STATUS: {
        startInProgress: boolean;
        deviceNotReady: boolean;
        raceStarted: boolean;
        readDevice: boolean;
        raceCloseable: boolean;
        maxRoundsReached: boolean;
        showTotalQualificationResult: boolean;
    };
    static CURRENT_RACE_LAPS: Lap[];
    static races: Race[];
    static newCompetition: Competition;
    static selectedCompetition: Competition;
    static raceTypes: string[];
    static raceFormats: string[];
    static orderByBestRound: String[];
    static orderByAmountOfRounds: String[];
    static resultOrder: String[];
    static raceResult: RaceResultEntry[];
    static raceDurationInterval: any;
    static heatCountdownInterval: any;
    static pilotSelectionOrder: String[];
    static availableRoundNumbers: number[];
    static currentRoundNumber: number;
    static selectedClass: Classs;
    static selectedFormat: string;
    static countdownTimer: Timer;
    static durationTimer: Timer;
    static currentRace: Race;
    static currentRound: Round;
    static previousRound: Round;
    static currentHeat: Heat;
    static currentCompetitionUUID: string;
    static qualificationResultOfCurrentRace: RoundResultEntry[];
    static pilotToMove: Pilot;
    static pilotToMoveOrigin: Heat;
    static heatToEdit: Heat;
    static finishedPilotsInLapHeat: Pilot[];
    static resultToEdit: any;
    static heatForPenalty: Heat;
    static currentRaceResult: RaceResult;
    static getCurrentRace(): Race;
    static toggleShowTotalQualificationResult(): void;
    static downloadTimetable(): void;
    static init(callback: any): void;
    static toogleHeatMenu(heat: Heat): void;
    static getMostLapsInfo(): number;
    static allPreviousHeatsAreFinished(): boolean;
    static isEditableRound(): boolean;
    static restartHeat(): void;
    static simulateHeat(): void;
    static closeHeat(): void;
    static roundNumberHelperCurrent(): any[];
    static roundNumberHelper(): any[];
    static heatResultExistsInCurrentRound(): boolean;
    static findCurrentRace(): void;
    static reloadQualificationResults(): void;
    static reloadPreviousRound(): void;
    static roundSelected(): void;
    static saveRound(): void;
    static classChanged(): void;
    static formatChanged(): void;
    static competitionChanged(): void;
    static heatsPerRoundChanged(): void;
    static updateDefaultCompetitionValue(): void;
    static sortByPilotNr(): void;
    static sortByName(): void;
    static pilotFilter(pilot: Pilot, index: any, array: any): boolean;
    static getResultsFromQualification(): RoundResultEntry[];
    static qualificationFilter(pilot: Pilot, index: any, array: any): boolean;
    static removePilotFromRaceByUUID(uuid: string): void;
    static fillHeats(): void;
    static clickPilot(heat: Heat, pilot: Pilot): void;
    static cancelMovePilot(): void;
    static movePilot(heat: Heat): void;
    static shuffle(o: any): any;
    static isHeatFull(heat: Heat): boolean;
    static reAssignRaceBandsToCurrentRound(): void;
    static addPilots(): void;
    static showRaceResult(): void;
    static hideRaceResult(): void;
    static close(): void;
    static setRaceStopable(): void;
    static stopRace(): void;
    static resultClicked(result: any, heat: any): void;
    static savePenalty(): void;
    static cancelEditResult(): void;
    static disqualify(): void;
    static setRaceResult(): void;
    static finish(): void;
    static calculateCurrentQualificationResults(): void;
    static calculateCurrentCompetitionResults(): void;
    static getRaceStatus(): {
        startInProgress: boolean;
        deviceNotReady: boolean;
        raceStarted: boolean;
        readDevice: boolean;
        raceCloseable: boolean;
        maxRoundsReached: boolean;
        showTotalQualificationResult: boolean;
    };
    static readyToStartHeat(simulation: boolean): boolean;
    static startHeat(heat: Heat, simulation: boolean): void;
    static getNewRaceAndSetCurrent(): Race;
    static getNewRace(): Race;
    static getNewRound(roundNumber: number): Round;
    static isReady(): string;
    static download(): void;
    static devicePassed(info: any): void;
    static generateLap(pilot: Pilot, timestamp: string): void;
    static mockPilotPassing(pilot: any, time: any): void;
    static mockTransponderPassing(deviceId: any, time: any): void;
    static mockRace(): void;
    static getCompetingPilotToDeviceId(deviceId: string): Pilot;
    static update(race: Race): void;
    static delete(race: any, callback: any): void;
    static deleteHeat(raceUUID: any, heatUUID: any, callback: any): void;
    static setRaces(races: any): void;
    static reloadAngular(): void;
}
declare class TTSService {
    static gender: string;
    static voiceName: string;
    static ttsEnabled: {
        value: boolean;
    };
    static language: string;
    static speak(text: string): void;
    static speakStartHeatCountdown(text: string): void;
    static speakNow(text: string): void;
    static pilotPassedGate(pilotName: any, lapNumber: any, lapTime: any): void;
}
declare class ClassService {
    static classes: Classs[];
    static newClass: Classs;
    static init(callback: any): void;
    static getFirstClass(): Classs;
    static getClassByUUID(uuid: string): Classs;
    static delete(classs: Classs): void;
    static classUpdated(classs: Classs): void;
    static classCreated(): void;
    static setClasses(classes: Classs[]): void;
    static reloadAngular(): void;
}
declare class DatabaseFillingService {
    static fillDefaultRaceBands(callback: any): void;
    static fillDefaultClasses(callback: any): void;
    static fillDefaultCompetitions(callback: any): void;
    static fillDefaultPilots(callback: any): void;
    static fillDefaultUser(callback: any): void;
}
declare class NotificationService {
    static notification: {
        text: string;
    };
    static fileDownloadText: string;
    static notify(notification: string): void;
    static showNotificationBox(): void;
    static hideConfirmBox(): void;
}
declare class SerialConnectionService {
    static INIT_TIMER_STRING: string;
    static DEVICE: any;
    static CONNECTION_ID: any;
    static RECIEVER_SEARCH_INTERVAL: any;
    static RECIEVER_SEARCH_CONTROL_INTERVAL: any;
    static DEVICES: any[];
    static DEVICE_TO_VERIFY: any;
    static SCAN_STRING: string;
    static MESSAGES: string[];
    static init(): void;
    static mockOnReceive(dataString: string): void;
    static onReceive(info: any): void;
    static lookForDevices(): void;
    static isReady(): boolean;
    static resetTrackingDevice(): void;
    static connectToDevice(): void;
    static selectDevice(device: any): void;
    static findReciverSerialDevice(devices: any[]): void;
    static ab2str(buf: any): any;
    static str2ab(str: any): ArrayBuffer;
}
declare class UserService {
    static user: User;
    static register(): void;
    static init(callback: any): void;
    static saveCurrentUser(): void;
    static setUser(users: User[]): void;
}
declare class CloudSyncService {
    static syncInterval: any;
    static syncIntervalTime: number;
    static verificationCode: string;
    static status: {
        online: boolean;
        transferPossible: boolean;
        message: string;
        blockScreen: boolean;
    };
    static init(): void;
    static notifyOnline(): void;
    static notifyOffline(): void;
    static accountTransferInit(): void;
    static confirmAccountTransferInit(): void;
    static restoreAccount(): void;
    static readyToTransferAccount(): void;
    static confirmRestoreAccount(): void;
    static tryToSync(): void;
    static resetAllSyncForDeveloper(): void;
    static doSync(): void;
    static resetSynced(array: BaseEntity[], store: string): void;
    static processPilotsToSync(array: Pilot[]): void;
    static processCompetitionsToSync(array: Competition[]): void;
    static processRacesToSync(array: Race[]): void;
    static processRaceBandsToSync(array: RaceBand[]): void;
    static processClassesToSync(array: Classs[]): void;
    static processUserToSync(array: User[]): void;
    static reloadAngular(): void;
    static getPathWithUser(path: string): string;
}
declare class DatabaseService {
    static DB_NAME: string;
    static DB_VERSION: number;
    static IDB_SUPPORTED: boolean;
    static DB: any;
    static store_pilots: string;
    static store_competitions: string;
    static store_races: string;
    static store_liveResults: string;
    static store_raceBands: string;
    static store_classes: string;
    static store_windowConfig: string;
    static store_user: string;
    static init(onSuccess: any): void;
    static readAll(dbName: string, callback: any): void;
    static resetAllSyncRecords(dbName: string): void;
    static allColumnsSynced(dbName: string, callback: any): void;
    static readAllUpdatesForSync(dbName: string, callback: any): void;
    static getStore(dbName: string): any;
    static findByUUID(dbName: string, uuid: string, callback: any): void;
    static saveSync(dbName: string, object: BaseEntity, success: any, error: any): void;
    static save(dbName: string, object: BaseEntity, success: any, error: any): void;
    static replaceContent(dbName: string, data: BaseEntity[], callback: any): void;
    static delete(dbName: string, object: BaseEntity, success: any, error: any): void;
}
declare class PilotService {
    static pilots: Pilot[];
    static selectedCompetition: Competition;
    static scanTimer: any;
    static scanInterval: any;
    static pilot: Pilot;
    static mode: any;
    static countries: string[];
    static selectedClass: any;
    static init(callback: any): void;
    static canPilotBeAssignedToRace(): boolean;
    static save(): void;
    static showCreate(): void;
    static hideCreate(): void;
    static isValid(): boolean;
    static showUpdate(pilot: Pilot): void;
    static setCreateMode(): void;
    static scanCountdown(): void;
    static scanPilot(): void;
    static pilotFilter(pilot: any, index: any, array: any): boolean;
    static getNextPilotNumber(): number;
    static download(): void;
    static update(pilot: Pilot): void;
    static deletePilot(): void;
    static setPilots(pilots: Pilot[]): void;
    static reloadAngular(): void;
}
declare class SoundService {
    static startAudio: any;
    static beepAudio: any;
    static init(): void;
    static playStart(): void;
    static playBeep(): void;
}
declare class CompetitionService {
    static competitions: Competition[];
    static selectedCompetition: Competition;
    static nameFilter: any;
    static pilotSelectionOrder: string[];
    static selectedClassForRaceConfig: Classs;
    static currentCompetitionConfig: CompetitionConfig;
    static pilotToAdd: Pilot;
    static config: {
        viewOnlineRegistration: boolean;
        viewOnlinePilots: boolean;
        disableRegButtons: boolean;
    };
    static onlinePilots: Pilot[];
    static init(callback: any): void;
    static toggleEventSettings(): void;
    static createNewCompetition(): void;
    static classForPilotFilter(config: CompetitionConfig, index: number, array: any[]): boolean;
    static pilotFilter(pilot: Pilot, index: number, array: any[]): boolean;
    static competitionSelected(): void;
    static autoSelectClassToEditRaceConfig(): void;
    static sortByPilotNr(): void;
    static sortByName(): void;
    static getNewRace(classs: any, format: any): Race;
    static getNewRound(roundNumber: any): Round;
    static save(): void;
    static selectClassToEditRaceConfig(classs: Classs): void;
    static customContains(competition: Competition, pilot: Pilot): number;
    static removeAllPilotsWithClass(classs: Classs): void;
    static addClass(competition: Competition, classs: Classs): void;
    static typeCompetitionChanged(): void;
    static roundsCompetitionChanged(): void;
    static typeQualifyingChanged(): void;
    static roundsQualifyingChanged(): void;
    static typeTrainingChanged(): void;
    static roundsTrainingChanged(): void;
    static raceConfigChanged(): void;
    static classAssigned(competition: Competition, classs: Classs): number;
    static removePilot(competition: Competition, pilot: Pilot): void;
    static selectClassForPilot(pilot: Pilot): void;
    static removeOnlineRegistrationPilot(pilot: Pilot): void;
    static addOnlineRegistrationPilot(registeredPilot: Pilot): void;
    static pilotAllreadyExists(pilot: Pilot): any;
    static isClassAvailableInCompetition(c: Classs): boolean;
    static showOnlinePilots(): void;
    static hideOnlinePilots(): void;
    static cancelAddPilot(): void;
    static addPilot(competition: Competition, pilot: Pilot, classs: Classs): void;
    static update(competition: Competition): void;
    static delete(competition: Competition, callback: any): void;
    static setCompetitions(competitions: Competition[]): void;
    static reloadAngular(): void;
}
declare class EditLapsService {
    static laps: Lap[];
    static lapResultOrder: string[];
    static setLaps(laps: any): void;
}
declare class RaceBandService {
    static raceBands: RaceBand[];
    static newRaceBand: RaceBand;
    static init(callback: any): void;
    static getRaceBandByIndex(index: number): string;
    static getRaceBandByUUID(uuid: string): RaceBand;
    static delete(raceBand: any): void;
    static raceBandUpdated(raceBand: RaceBand): void;
    static raceBandCreated(): void;
    static setRaceBands(raceBands: RaceBand[]): void;
    static reloadAngular(): void;
}
declare class StatisticService {
    static selectedCompetition: Competition;
    static selectedRace: Race;
    static lapResultOrder: string[];
    static selectionOrder: string[];
    static raceResult: RaceResult;
    static statisticType: String;
    static raceIdentificationObjects: RaceIdentificationObject[];
    static selectedRaceIdentificationObject: RaceIdentificationObject;
    static init(): void;
    static raceFilter(race: RaceIdentificationObject, index: any, array: any): boolean;
    static competitionSelected(): any[];
    static raceSelected(): void;
    static confirmDeleteCompetition(): void;
    static confirmDeleteHeat(): void;
    static deleteCompetition(): void;
    static deleteHeat(): void;
    static reloadAngular(): void;
    static download(): void;
}
declare class WindowConfigService {
    static resetLiveView(): void;
    static endRace(): void;
    static setCurrentCompetition(uuid: string): void;
    static setLiveResultListView(flag: boolean): void;
    static setCurrentLivePilot(uuid: string): void;
    static setCurrentHeat(uuid: string): void;
    static createAndReturnWindowConfig(): WindowConfig;
    static getWindowConfig(callback: any): void;
    static update(windowConfig: any): void;
}
declare class ConfirmationService {
    static confirmCallback: any;
    static cancelCallback: any;
    static pleaseConfirm(confirmCallback: any, cancelCallback: any): void;
    static showConfirmBox(): void;
    static hideConfirmBox(): void;
    static confirm(): void;
    static cancel(): void;
}
declare class DisplayService {
    private $rootScope;
    static SCREEN2_WINDOW_ID_PREFIX: string;
    static LIVE_WINDOW_ID_PREFIX: string;
    static $inject: string[];
    constructor($rootScope: any);
    loadScreens(): void;
    openScreen(left: number, top: number, fullscreen: boolean, windowID: string): void;
}
declare class RaceResultService {
    static calculateRaceResult(raceResult: any, race: Race, heat: Heat, laps: Lap[]): void;
    static round(value: any): number;
    static calculateAverageRoundTime(laps: Lap[]): number;
    static calculateTotalRoundTime(laps: any): number;
    static calculateBestRoundTime(laps: any): number;
}
declare class SubMenuService {
    static init(): void;
    static showElementById(id: string): void;
    static hideAllContent(): void;
    static hideSubMenu(): void;
    static usb(): void;
    static raceBand(): void;
    static classes(): void;
    static screen2(): void;
    static tts(): void;
    static liveScreen(): void;
    static cloud(): void;
    static showConfigurationSubMenu(): void;
    static setSubMenuSize(size: number): void;
}
declare class ManageScreen2Service {
    private $rootScope;
    private static SCREEN2_WINDOW_ID_PREFIX;
    static $inject: string[];
    constructor($rootScope: any);
    loadScreens(): void;
    openScreen2(left: number, top: number, fullscreen: boolean): void;
}
declare function ClassController(): void;
declare function ConfirmationController(): void;
declare function PilotController(): void;
declare function UsbController(): void;
declare class CloudController {
    private service;
    private userService;
}
declare class ManageLiveScreenController {
    private $scope;
    private displayService;
    static $inject: string[];
    constructor($scope: IManageLiveScreenScope, displayService: DisplayService);
    updateScreens(event: any, data: any): void;
    showLiveScreen(screen: any): void;
    allPilotsCheckBoxChanged(): void;
    selectedPilotChanged(pilotUUID: string): void;
}
declare function RaceBandController(): void;
declare class UserController {
    private service;
}
declare function CompetitionController(): void;
declare function NotificationController(): void;
declare function RaceController(): void;
declare function TTSController(): void;
declare class LiveScreenController {
    private $scope;
    private $indexedDB;
    private $interval;
    private $timeout;
    private timerStart;
    private newPilot;
    static $inject: string[];
    constructor($scope: ILiveScreen, $indexedDB: any, $interval: any, $timeout: any);
}
declare var appScreenLive: ng.IModule;
interface ILiveScreen extends ng.IScope {
    vm: LiveScreenController;
    windowConfig: WindowConfig;
    raceResults: RaceResultEntry[];
    singleResult: RaceResultEntry;
    currentRace: Race;
    currentRound: Race;
    currentHeat: Heat;
    lapTimerValue: number;
    lapTimerInterval: any;
    showLapTime: boolean;
}
interface IManageLiveScreenScope extends ng.IScope {
    windowConfig: WindowConfig;
    screens: any[];
    raceService: RaceService;
    allPilotsCheckBoxEnabled: boolean;
    vm: ManageLiveScreenController;
    apply(): any;
}
declare class Screen2Controller {
    private $scope;
    private $indexedDB;
    private $interval;
    static $inject: string[];
    constructor($scope: IResultsScreen, $indexedDB: any, $interval: any);
    racesChanged(): void;
}
declare var appScreen2: ng.IModule;
interface IResultsScreen extends ng.IScope {
    windowConfig: WindowConfig;
    races: Race[];
    currentRace: Race;
    heatResults: HeatResultViewObject[];
    upcomingHeats: UpcomingHeatViewObject[];
    vm: Screen2Controller;
}
interface IManageScreen2Scope extends ng.IScope {
    windowConfig: WindowConfig;
    screens: any[];
    vm: ManageScreen2Controller;
    apply(): any;
}
declare var app: ng.IModule;
declare var time: string;
declare var LOGGING: boolean;
declare var SERIAL_ENABLED: boolean;
declare var changelogString: string;
declare function hideWelcome(): void;
declare function log(text: any, data: any): void;
declare function StatisticController(): void;
declare class OnlineRegistration extends BaseEntity {
    firstName: string;
    lastName: string;
    alias: string;
    phone: string;
    country: string;
    email: string;
    club: string;
    deviceId: string;
    pilotNumber: number;
    classes: Classs[];
    competition: Competition;
    constructor(json: any);
    getPilotObjects(): Pilot[];
}
declare class RaceSimulationService {
    private static intervalTime;
    private static interval;
    private static stop;
    static stopSimulation(): void;
    static simulateHeat(heat: Heat, raceLength: number): void;
    static simulateAllDrivers(pilots: Pilot[], maxTimeout: number, timeFrom: number): void;
}
