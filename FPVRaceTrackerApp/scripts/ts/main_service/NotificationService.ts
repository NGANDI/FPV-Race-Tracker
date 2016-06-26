/// <reference path='../main_all.ts' />

module main {
    'use strict';

    export class NotificationService {

        public notifications: Notification[];

        public static $inject = [
            'logService',
            '$interval',
            'languageService'
        ];

        constructor(
            private logService: LogService,
            private $interval: any,
            private languageService: LanguageService
        ) {
            this.notifications = [];

            $interval(() => {
                this.notifications = this.notifications.filter((notification: Notification) => {
                    if (notification.created + notification.displayTimeInMS < new Date().getTime()) {
                        return false;
                    }
                    return true;
                });
                this.notifications.forEach((notification: Notification) => {
                    if (notification.created + notification.displayTimeInMS - 1300 < new Date().getTime()) {
                        notification.fade = true;
                    }
                });
            }, 300, 0);
        }

        public remove(notification: Notification) {
            var index = this.notifications.indexOf(notification);
            if (index > -1) {
                this.notifications.splice(index, 1);
            }
        }

        private getNotificationProperty(notificationType: string, tag: string) {
            var text = "";
            try {
                text = this.languageService.selectedLanguage.json[notificationType][tag];
            }
            catch (e) {
            }
            if (!text) {
                this.logService.error("NotificationService", "could not retrieve notification property", " "+notificationType + ", " + tag);
                var errorText = this.languageService.selectedLanguage.json["notificationError"]["tagNotFound"];
                this.notifications.push(new Notification(errorText ? errorText : "ERROR!", NotificationType.ERROR, NotificationDuration.ERROR));
            }
            return text;
        }

        public notifyInfo(tag: string) {
            var text: string = this.getNotificationProperty("notificationInfo", tag);
            if (text) {
                this.notifications.push(new Notification(text, NotificationType.INFO, NotificationDuration.INFO));
            }
        }

        public notifySuccess(tag: string) {
            var text: string = this.getNotificationProperty("notificationSuccess", tag);
            if (text) {
                this.notifications.push(new Notification(text, NotificationType.SUCCESS, NotificationDuration.SUCCESS));
            }
        }

        public notifyWarn(tag: string) {
            var text: string = this.getNotificationProperty("notificationWarn", tag);
            if (text) {
                this.notifications.push(new Notification(text, NotificationType.WARN, NotificationDuration.WARN));
            }
        }

        public notifyError(tag: string) {
            var text: string = this.getNotificationProperty("notificationError", tag);
            if (text) {
                this.notifications.push(new Notification(text, NotificationType.ERROR, NotificationDuration.ERROR));
            }
        }

    }
}
