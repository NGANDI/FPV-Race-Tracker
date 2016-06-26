var main;
(function (main) {
    'use strict';
    var LanguageName = (function () {
        function LanguageName() {
        }
        LanguageName.ENGLISH = "English";
        LanguageName.GERMAN = "Deutsch";
        LanguageName.CUSTOM = "Custom";
        return LanguageName;
    }());
    main.LanguageName = LanguageName;
    var DBStore = (function () {
        function DBStore() {
        }
        DBStore.LANGUAGE = "language";
        DBStore.PILOTS = "pilots";
        DBStore.CLUBS = "clubs";
        DBStore.MAINCONFIG = "main_config";
        DBStore.LOGS = "logs";
        DBStore.VENDORS = "vendors";
        DBStore.EVENTS = "events";
        return DBStore;
    }());
    main.DBStore = DBStore;
    var NotificationDuration = (function () {
        function NotificationDuration() {
        }
        NotificationDuration.SUCCESS = 4000;
        NotificationDuration.INFO = 4000;
        NotificationDuration.WARN = 7000;
        NotificationDuration.ERROR = 10000;
        return NotificationDuration;
    }());
    main.NotificationDuration = NotificationDuration;
    (function (NotificationType) {
        NotificationType[NotificationType["SUCCESS"] = 1] = "SUCCESS";
        NotificationType[NotificationType["INFO"] = 2] = "INFO";
        NotificationType[NotificationType["WARN"] = 3] = "WARN";
        NotificationType[NotificationType["ERROR"] = 4] = "ERROR";
    })(main.NotificationType || (main.NotificationType = {}));
    var NotificationType = main.NotificationType;
    (function (MenuButton) {
        MenuButton[MenuButton["EVENTS"] = 0] = "EVENTS";
        MenuButton[MenuButton["RACE"] = 1] = "RACE";
        MenuButton[MenuButton["ACCOUNT"] = 2] = "ACCOUNT";
        MenuButton[MenuButton["SETTINGS"] = 3] = "SETTINGS";
        MenuButton[MenuButton["PILOTS"] = 4] = "PILOTS";
        MenuButton[MenuButton["CLUBS"] = 5] = "CLUBS";
    })(main.MenuButton || (main.MenuButton = {}));
    var MenuButton = main.MenuButton;
    (function (SubMenuButton) {
        SubMenuButton[SubMenuButton["EVENTS_NEW"] = 0] = "EVENTS_NEW";
        SubMenuButton[SubMenuButton["EVENTS_PAST"] = 1] = "EVENTS_PAST";
        SubMenuButton[SubMenuButton["EVENTS_UPCOMING"] = 2] = "EVENTS_UPCOMING";
        SubMenuButton[SubMenuButton["PILOTS_NEW"] = 3] = "PILOTS_NEW";
        SubMenuButton[SubMenuButton["PILOTS_LIST"] = 4] = "PILOTS_LIST";
        SubMenuButton[SubMenuButton["PILOTS_EDIT"] = 5] = "PILOTS_EDIT";
        SubMenuButton[SubMenuButton["SETTINGS_LANGUAGE"] = 6] = "SETTINGS_LANGUAGE";
        SubMenuButton[SubMenuButton["CLUBS_NEW"] = 7] = "CLUBS_NEW";
        SubMenuButton[SubMenuButton["CLUBS_LIST"] = 8] = "CLUBS_LIST";
        SubMenuButton[SubMenuButton["CLUBS_EDIT"] = 9] = "CLUBS_EDIT";
    })(main.SubMenuButton || (main.SubMenuButton = {}));
    var SubMenuButton = main.SubMenuButton;
    (function (NewEventNavigationButtons) {
        NewEventNavigationButtons[NewEventNavigationButtons["EVENT"] = 0] = "EVENT";
        NewEventNavigationButtons[NewEventNavigationButtons["PILOTS"] = 1] = "PILOTS";
        NewEventNavigationButtons[NewEventNavigationButtons["RACE"] = 2] = "RACE";
        NewEventNavigationButtons[NewEventNavigationButtons["ROUNDS"] = 3] = "ROUNDS";
        NewEventNavigationButtons[NewEventNavigationButtons["HEATS"] = 4] = "HEATS";
    })(main.NewEventNavigationButtons || (main.NewEventNavigationButtons = {}));
    var NewEventNavigationButtons = main.NewEventNavigationButtons;
    (function (LogLevel) {
        LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
        LogLevel[LogLevel["WARN"] = 1] = "WARN";
        LogLevel[LogLevel["ERROR"] = 2] = "ERROR";
    })(main.LogLevel || (main.LogLevel = {}));
    var LogLevel = main.LogLevel;
})(main || (main = {}));
