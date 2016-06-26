/// <reference path='../main_all.ts' />

module main {
    'use strict';

    export class LanguageName {
        static ENGLISH = "English";
        static GERMAN = "Deutsch";
        static CUSTOM = "Custom";
    }
    
    export class DBStore {
        static LANGUAGE = "language";
        static PILOTS = "pilots";
        static CLUBS = "clubs";
        static MAINCONFIG = "main_config";
        static LOGS = "logs";
        static VENDORS = "vendors";
        static EVENTS = "events";
    }
    
    export class NotificationDuration {
        static SUCCESS = 4000;
        static INFO = 4000;
        static WARN = 7000;
        static ERROR = 10000;
    }
    
    export enum NotificationType {
        SUCCESS = 1,
        INFO = 2,
        WARN = 3,
        ERROR = 4
    }

    export enum MenuButton {
        EVENTS,
        RACE,
        ACCOUNT,
        SETTINGS,
        PILOTS,
        CLUBS
    }

    export enum SubMenuButton {
        EVENTS_NEW,
        EVENTS_PAST,
        EVENTS_UPCOMING,
        PILOTS_NEW,
        PILOTS_LIST,
        PILOTS_EDIT,
        SETTINGS_LANGUAGE,
        CLUBS_NEW,
        CLUBS_LIST,
        CLUBS_EDIT,
    }

    export enum NewEventNavigationButtons {
        EVENT,
        PILOTS,
        RACE,
        ROUNDS,
        HEATS
    }

    export enum LogLevel {
        DEBUG,
        WARN,
        ERROR
    }
}