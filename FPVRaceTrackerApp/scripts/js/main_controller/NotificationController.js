var main;
(function (main) {
    'use strict';
    var NotificationController = (function () {
        function NotificationController(logService, notificationService) {
            this.logService = logService;
            this.notificationService = notificationService;
        }
        NotificationController.prototype.remove = function (notification) {
            this.notificationService.remove(notification);
        };
        NotificationController.$inject = [
            'logService',
            'notificationService'
        ];
        return NotificationController;
    }());
    main.NotificationController = NotificationController;
})(main || (main = {}));
