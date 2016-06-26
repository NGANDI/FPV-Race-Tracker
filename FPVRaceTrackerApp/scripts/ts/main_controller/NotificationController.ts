/// <reference path='../main_all.ts' />

module main {
    'use strict';

    export class NotificationController {

        public static $inject = [
            'logService',
            'notificationService'
        ];

        constructor(
            private logService: LogService,
            private notificationService: NotificationService
        ) {
        }

        private remove(notification: Notification) {
            this.notificationService.remove(notification);
        }
    }
}