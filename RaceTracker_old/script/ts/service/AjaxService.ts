/// <reference path="../_reference.ts"/>
class AjaxService {

    public static port: string = "";
    //public static port: string = ":8080";
    public static host: string = "cloud.fpvracetracker.com";
    //public static host: string = "localhost";
    public static protocol: string = "https";
    //public static protocol: string = "http";

    public static path_syncPilots: string = "sync/pilots";
    public static path_syncCompetitions: string = "sync/competitions";
    public static path_syncRaces: string = "sync/races";
    public static path_syncRaceBands: string = "sync/raceBands";
    public static path_syncClasses: string = "sync/classes";
    public static path_syncUser: string = "sync/user";
    public static path_createAccountTransfer: string = "createAccountTransfer";
    public static path_transferAccount: string = "transferAccount";
    public static path_getOnlinePilots: string = "onlineRegister/registrations";
    public static path_removeRegistration: string = "onlineRegister/removeRegistration";

    public static send(path: string, request: any, callback) {
        var http = new XMLHttpRequest();
        var url = AjaxService.protocol + "://" + AjaxService.host + "" + AjaxService.port + "/" + path;
        var body = JSON.stringify(request);
        if (request) {
            http.open("POST", url, true);
        }
        else {
            http.open("GET", url, true);
        }
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        //        http.setRequestHeader("auth", request.auth);
        http.onreadystatechange = function() {
            if (http.readyState == 4 && http.status == 200) {
                callback(JSON.parse(http.responseText));
            } else if (http.readyState == 4
                && (http.status == 0 || http.status > 500)) {
                console.log("error: ", http);
                callback({
                    status: "ERROR"
                });
            }
        }
        http.send(body);
    }

}