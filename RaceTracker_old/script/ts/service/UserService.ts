/// <reference path="../_reference.ts"/>
class UserService {

    public static user: User = null;

    public static register() {
        UserService.user.registered = true;
        UserService.saveCurrentUser();
        CompetitionService.init(null);
        RaceService.init(null);
        //TODO: are race bands and classes and pilots available after initializaton of database ?????
        //TODO: is obfuscation possible ????
        document.getElementById("welcome").classList.add("removed");
    }

    public static init(callback) {
        DatabaseService.readAll(DatabaseService.store_user, function(user: User[]) {
            UserService.setUser(user);
            if (callback)
                callback();
        });
    }

    public static saveCurrentUser() {
        DatabaseService.save(DatabaseService.store_user, UserService.user, function(e) {
            CloudSyncService.tryToSync();
        }, function(e) {
        });
    }

    public static setUser(users: User[]) {
        UserService.user = (users && users.length == 1) ? users[0] : null;
        if (!UserService.user) {
            DatabaseFillingService.fillDefaultUser(UserService.init);
        }
    }
}