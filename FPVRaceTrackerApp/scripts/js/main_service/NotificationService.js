var main;
(function (main) {
    'use strict';
    var NotificationService = (function () {
        function NotificationService(logService, $interval, languageService) {
            var _this = this;
            this.logService = logService;
            this.$interval = $interval;
            this.languageService = languageService;
            this.notifications = [];
            $interval(function () {
                _this.notifications = _this.notifications.filter(function (notification) {
                    if (notification.created + notification.displayTimeInMS < new Date().getTime()) {
                        return false;
                    }
                    return true;
                });
                _this.notifications.forEach(function (notification) {
                    if (notification.created + notification.displayTimeInMS - 1300 < new Date().getTime()) {
                        notification.fade = true;
                    }
                });
            }, 300, 0);
        }
        NotificationService.prototype.remove = function (notification) {
            var index = this.notifications.indexOf(notification);
            if (index > -1) {
                this.notifications.splice(index, 1);
            }
        };
        NotificationService.prototype.getNotificationProperty = function (notificationType, tag) {
            var text = "";
            try {
                text = this.languageService.selectedLanguage.json[notificationType][tag];
            }
            catch (e) {
            }
            if (!text) {
                this.logService.error("NotificationService", "could not retrieve notification property", " " + notificationType + ", " + tag);
                var errorText = this.languageService.selectedLanguage.json["notificationError"]["tagNotFound"];
                this.notifications.push(new main.Notification(errorText ? errorText : "ERROR!", main.NotificationType.ERROR, main.NotificationDuration.ERROR));
            }
            return text;
        };
        NotificationService.prototype.notifyInfo = function (tag) {
            var text = this.getNotificationProperty("notificationInfo", tag);
            if (text) {
                this.notifications.push(new main.Notification(text, main.NotificationType.INFO, main.NotificationDuration.INFO));
            }
        };
        NotificationService.prototype.notifySuccess = function (tag) {
            var text = this.getNotificationProperty("notificationSuccess", tag);
            if (text) {
                this.notifications.push(new main.Notification(text, main.NotificationType.SUCCESS, main.NotificationDuration.SUCCESS));
            }
        };
        NotificationService.prototype.notifyWarn = function (tag) {
            var text = this.getNotificationProperty("notificationWarn", tag);
            if (text) {
                this.notifications.push(new main.Notification(text, main.NotificationType.WARN, main.NotificationDuration.WARN));
            }
        };
        NotificationService.prototype.notifyError = function (tag) {
            var text = this.getNotificationProperty("notificationError", tag);
            if (text) {
                this.notifications.push(new main.Notification(text, main.NotificationType.ERROR, main.NotificationDuration.ERROR));
            }
        };
        NotificationService.$inject = [
            'logService',
            '$interval',
            'languageService'
        ];
        return NotificationService;
    }());
    main.NotificationService = NotificationService;
})(main || (main = {}));
