/// <reference path="../_reference.ts"/>
class NotificationService {

    public static notification = { text: "" };
    public static fileDownloadText = "The data has been loaded into your default Downloads-Folder!";

    public static notify(notification: string) {
        try {
            NotificationService.notification.text = notification;
            NotificationService.showNotificationBox();
        }
        catch (e) {
        }
    }

    public static showNotificationBox() {
        document.getElementById("notificationBox").classList.remove("removed");
        if (!angular.element(document.getElementById('notificationBox')).scope().$$phase) {
            angular.element(document.getElementById('notificationBox')).scope().$apply();
        }
        else {
            setTimeout(NotificationService.showNotificationBox, 200);
        }
        setTimeout(function() {
            NotificationService.hideConfirmBox();
        }, 5000);
    }
    public static hideConfirmBox() {
        NotificationService.notification.text = "";
        document.getElementById("notificationBox").classList.add("removed");
    }
}
