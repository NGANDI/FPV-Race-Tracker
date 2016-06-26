/// <reference path="../_reference.ts"/>
class CloudSyncService {

    public static syncInterval: any = null;
    public static syncIntervalTime: number = 10000;
    public static verificationCode: string = "";
    public static status = { online: false, transferPossible: false, message: "", blockScreen: false };

    public static init() {
        CloudSyncService.syncInterval = setInterval(CloudSyncService.tryToSync, CloudSyncService.syncIntervalTime);
        CloudSyncService.status.online = navigator.onLine;
        window.addEventListener('online', CloudSyncService.notifyOnline);
        window.addEventListener('offline', CloudSyncService.notifyOffline);
    }

    public static notifyOnline() {
        CloudSyncService.status.online = true;
        CloudSyncService.reloadAngular();
    }

    public static notifyOffline() {
        CloudSyncService.status.online = false;
        CloudSyncService.reloadAngular();
    }

    public static accountTransferInit() {
        ConfirmationService.pleaseConfirm(CloudSyncService.confirmAccountTransferInit, function() { });
    }

    public static confirmAccountTransferInit() {
        AjaxService.send(CloudSyncService.getPathWithUser(AjaxService.path_createAccountTransfer), null, function(result) {
            if (result.status == 'SUCCESS') {
                DatabaseService.replaceContent(DatabaseService.store_competitions, [], function() {
                    DatabaseService.replaceContent(DatabaseService.store_races, [], function() {
                        DatabaseService.replaceContent(DatabaseService.store_pilots, [], function() {
                            DatabaseService.replaceContent(DatabaseService.store_classes, [], function() {
                                DatabaseService.replaceContent(DatabaseService.store_raceBands, [], function() {
                                    DatabaseService.replaceContent(DatabaseService.store_user, [], function() {
                                        CloudSyncService.status.blockScreen = true;
                                        CloudSyncService.status.message = "Request completed, all your local data has been deleted and is available to be transfered! Please move to the other computer and restore your data!";
                                        CloudSyncService.reloadAngular();
                                    });
                                });
                            });
                        });
                    });
                });
            }
        });
    }

    public static restoreAccount() {
        if (!CloudSyncService.verificationCode || CloudSyncService.verificationCode.length < 10) {
            NotificationService.notify("Please enter a valid Verification Code!");
            return;
        }
        ConfirmationService.pleaseConfirm(CloudSyncService.confirmRestoreAccount, function() { });
    }

    public static readyToTransferAccount() {
        DatabaseService.allColumnsSynced(DatabaseService.store_competitions, function(allSynced) {
            if (allSynced) {
                DatabaseService.allColumnsSynced(DatabaseService.store_races, function(allSynced) {
                    if (allSynced) {
                        DatabaseService.allColumnsSynced(DatabaseService.store_pilots, function(allSynced) {
                            if (allSynced) {
                                DatabaseService.allColumnsSynced(DatabaseService.store_classes, function(allSynced) {
                                    if (allSynced) {
                                        DatabaseService.allColumnsSynced(DatabaseService.store_raceBands, function(allSynced) {
                                            if (allSynced) {
                                                DatabaseService.allColumnsSynced(DatabaseService.store_user, function(allSynced) {
                                                    if (allSynced) {
                                                        CloudSyncService.status.transferPossible = true;
                                                        CloudSyncService.reloadAngular();
                                                    } else {
                                                        CloudSyncService.status.transferPossible = false;
                                                        CloudSyncService.reloadAngular();
                                                    }
                                                });
                                            } else {
                                                CloudSyncService.status.transferPossible = false;
                                                CloudSyncService.reloadAngular();
                                            }
                                        });
                                    } else {
                                        CloudSyncService.status.transferPossible = false;
                                        CloudSyncService.reloadAngular();
                                    }
                                });
                            } else {
                                CloudSyncService.status.transferPossible = false;
                                CloudSyncService.reloadAngular();
                            }
                        });
                    } else {
                        CloudSyncService.status.transferPossible = false;
                        CloudSyncService.reloadAngular();
                    }
                });
            } else {
                CloudSyncService.status.transferPossible = false;
                CloudSyncService.reloadAngular();
            }
        });

    }

    public static confirmRestoreAccount() {
        AjaxService.send(CloudSyncService.getPathWithUser(AjaxService.path_transferAccount) + "/" + CloudSyncService.verificationCode.trim(), null, function(result) {
            if (result.status != "ERROR") {
                DatabaseService.replaceContent(DatabaseService.store_user, result.users, function() {
                    DatabaseService.replaceContent(DatabaseService.store_classes, result.classes, function() {
                        DatabaseService.replaceContent(DatabaseService.store_raceBands, result.raceBands, function() {
                            DatabaseService.replaceContent(DatabaseService.store_pilots, result.pilots, function() {
                                DatabaseService.replaceContent(DatabaseService.store_competitions, result.competitions, function() {
                                    DatabaseService.replaceContent(DatabaseService.store_races, result.races, function() {
                                        CloudSyncService.status.blockScreen = true;
                                        CloudSyncService.status.message = "Account restoration completed, all your data has been re-created! Please restart the FPV Race Tracker!";
                                        CloudSyncService.reloadAngular();
                                    });
                                });
                            });
                        });
                    });
                });
            }
        });
    }

    public static tryToSync() {
        //TODO: not logged in ??? what to do ???
        if (navigator.onLine) {
            try {
                CloudSyncService.doSync();
            }
            catch (ex) {
                console.log("sync error", ex);
            }
        }
        else {
        }
    }

    public static resetAllSyncForDeveloper() {
        DatabaseService.resetAllSyncRecords(DatabaseService.store_pilots);
        DatabaseService.resetAllSyncRecords(DatabaseService.store_competitions);
        DatabaseService.resetAllSyncRecords(DatabaseService.store_races);
        DatabaseService.resetAllSyncRecords(DatabaseService.store_raceBands);
        DatabaseService.resetAllSyncRecords(DatabaseService.store_classes);
        DatabaseService.resetAllSyncRecords(DatabaseService.store_user);
    }

    public static doSync() {
        DatabaseService.readAllUpdatesForSync(DatabaseService.store_user, CloudSyncService.processUserToSync);
    }

    public static resetSynced(array: BaseEntity[], store: string) {
        array.forEach((element) => {
            try {
                element.synced = null;
                DatabaseService.saveSync(store, element, function(e) { }, function(e) { });
            } catch (ex) { }
        });
    }

    public static processPilotsToSync(array: Pilot[]) {
        if (!array || array.length < 1 || !UserService.user) {
            DatabaseService.readAllUpdatesForSync(DatabaseService.store_competitions, CloudSyncService.processCompetitionsToSync);
            return;
        }
        var request = new PilotSyncRequest(UserService.user, array);
        AjaxService.send(CloudSyncService.getPathWithUser(AjaxService.path_syncPilots), request, function(result) {
            if (result && result.status != 'SUCCESS') {
                CloudSyncService.resetSynced(array, DatabaseService.store_pilots);
            }
            DatabaseService.readAllUpdatesForSync(DatabaseService.store_competitions, CloudSyncService.processCompetitionsToSync);
        });
    }

    public static processCompetitionsToSync(array: Competition[]) {
        if (!array || array.length < 1 || !UserService.user) {
            DatabaseService.readAllUpdatesForSync(DatabaseService.store_races, CloudSyncService.processRacesToSync);
            return;
        }
        var request = new CompetitionSyncRequest(UserService.user, array);
        AjaxService.send(CloudSyncService.getPathWithUser(AjaxService.path_syncCompetitions), request, function(result) {
            if (result && result.status != 'SUCCESS') {
                CloudSyncService.resetSynced(array, DatabaseService.store_competitions);
            }
            DatabaseService.readAllUpdatesForSync(DatabaseService.store_races, CloudSyncService.processRacesToSync);
        });
    }

    public static processRacesToSync(array: Race[]) {
        if (!array || array.length < 1 || !UserService.user) {
            setTimeout(CloudSyncService.readyToTransferAccount, 1000);
            return;
        }
        var request = new RaceSyncRequest(UserService.user, array);
        AjaxService.send(CloudSyncService.getPathWithUser(AjaxService.path_syncRaces), request, function(result) {
            if (result && result.status != 'SUCCESS') {
                CloudSyncService.resetSynced(array, DatabaseService.store_races);
            }
            setTimeout(CloudSyncService.readyToTransferAccount, 1000);
        });
    }

    public static processRaceBandsToSync(array: RaceBand[]) {
        if (!array || array.length < 1 || !UserService.user) {
            DatabaseService.readAllUpdatesForSync(DatabaseService.store_pilots, CloudSyncService.processPilotsToSync);
            return;
        }
        var request = new RaceBandSyncRequest(UserService.user, array);
        AjaxService.send(CloudSyncService.getPathWithUser(AjaxService.path_syncRaceBands), request, function(result) {
            if (result && result.status != 'SUCCESS') {
                CloudSyncService.resetSynced(array, DatabaseService.store_raceBands);
            }
            DatabaseService.readAllUpdatesForSync(DatabaseService.store_pilots, CloudSyncService.processPilotsToSync);
        });
    }

    public static processClassesToSync(array: Classs[]) {
        if (!array || array.length < 1 || !UserService.user) {
            DatabaseService.readAllUpdatesForSync(DatabaseService.store_raceBands, CloudSyncService.processRaceBandsToSync);
            return;
        }
        var request = new ClassSyncRequest(UserService.user, array);
        AjaxService.send(CloudSyncService.getPathWithUser(AjaxService.path_syncClasses), request, function(result) {
            if (result && result.status != 'SUCCESS') {
                CloudSyncService.resetSynced(array, DatabaseService.store_classes);
            }
            DatabaseService.readAllUpdatesForSync(DatabaseService.store_raceBands, CloudSyncService.processRaceBandsToSync);
        });
    }

    public static processUserToSync(array: User[]) {
        if (!array || array.length < 1 || !UserService.user) {
            DatabaseService.readAllUpdatesForSync(DatabaseService.store_classes, CloudSyncService.processClassesToSync);
            return;
        }
        var request = new BaseSyncRequest(array[0]);
        AjaxService.send(CloudSyncService.getPathWithUser(AjaxService.path_syncUser), request, function(result) {
            if (result && result.status != 'SUCCESS') {
                CloudSyncService.resetSynced(array, DatabaseService.store_user);
            }
            DatabaseService.readAllUpdatesForSync(DatabaseService.store_classes, CloudSyncService.processClassesToSync);
        });
    }



    public static reloadAngular() {
        if (!angular.element(document.getElementById('cloud')).scope().$$phase) {
            angular.element(document.getElementById('cloud')).scope().$apply();
        }
        else {
            console.log("reload angular failed!!!");
            setTimeout(CloudSyncService.reloadAngular, 200);
        }
    }

    public static getPathWithUser(path: string) {
        return path + "/" + UserService.user.uuid;
    }
}