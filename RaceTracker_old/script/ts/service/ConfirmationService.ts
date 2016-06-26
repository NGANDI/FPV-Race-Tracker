/// <reference path="../_reference.ts"/>
class ConfirmationService {

    public static confirmCallback: any;
    public static cancelCallback: any;

    public static pleaseConfirm(confirmCallback, cancelCallback) {
        ConfirmationService.confirmCallback = confirmCallback;
        ConfirmationService.cancelCallback = cancelCallback;
        ConfirmationService.showConfirmBox();
    }

    public static showConfirmBox() {
        document.getElementById("confirmBox").classList.remove("removed");
    }
    public static hideConfirmBox() {
        document.getElementById("confirmBox").classList.add("removed");
    }

    public static confirm() {
        ConfirmationService.confirmCallback();
        ConfirmationService.hideConfirmBox();
    }

    public static cancel() {
        ConfirmationService.cancelCallback();
        ConfirmationService.hideConfirmBox();
    }
}
