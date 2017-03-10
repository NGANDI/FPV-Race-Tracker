var main;
(function (main) {
    'use strict';
    var countryList = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua & Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia & Herzegovina", "Botswana", "Brazil", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Cape Verde", "Cayman Islands", "Chad", "Chile", "China", "Colombia", "Congo", "Cook Islands", "Costa Rica", "Cote D Ivoire", "Croatia", "Cruise Ship", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Estonia", "Ethiopia", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Polynesia", "French West Indies", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Kyrgyz Republic", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Mauritania", "Mauritius", "Mexico", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Namibia", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Rwanda", "Saint Pierre & Miquelon", "Samoa", "San Marino", "Satellite", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka", "St Kitts & Nevis", "St Lucia", "St Vincent", "St. Lucia", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor L'Este", "Togo", "Tonga", "Trinidad & Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks & Caicos", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "Uruguay", "USA", "Uzbekistan", "Venezuela", "Vietnam", "Virgin Islands (US)", "Yemen", "Zambia", "Zimbabwe"];
    var fpvracetracker_main = angular.module('main', ['indexedDB'])
        .config(['$logProvider', function ($logProvider) {
            $logProvider.debugEnabled(true);
        }])
        .constant('COUNTRIES', countryList)
        .config(function ($indexedDBProvider) {
        $indexedDBProvider
            .connection('fpv_race_tracker_1')
            .upgradeDatabase(1, function (event, db, tx) {
            var store;
            db.createObjectStore(main.DBStore.PILOTS, { keyPath: "idx", autoIncrement: true });
            db.createObjectStore(main.DBStore.LOGS, { keyPath: "idx", autoIncrement: true });
            store = db.createObjectStore(main.DBStore.LANGUAGE, { keyPath: "name" });
            store.add(new main.Language(main.LanguageName.CUSTOM, englishTranslation, true));
            store.add(new main.Language(main.LanguageName.ENGLISH, englishTranslation, false));
            store.add(new main.Language(main.LanguageName.GERMAN, germanTranslation, false));
            store.add(new main.Language(main.LanguageName.JAPANESE, japaneseTranslation, false));
            store = db.createObjectStore(main.DBStore.MAINCONFIG, { keyPath: "idx", autoIncrement: true });
            store.add(new main.MainConfig(main.LanguageName.ENGLISH, "Austria"));
            store = event.currentTarget.transaction.objectStore("language");
            store = db.createObjectStore(main.DBStore.CLUBS, { keyPath: "idx", autoIncrement: true });
            store = db.createObjectStore(main.DBStore.VENDORS, { keyPath: "idx", autoIncrement: true });
            store.add(new main.Vendor("I-LAPS"));
            store.add(new main.Vendor("OPEN LAP"));
            store.add(new main.Vendor("CUSTOM"));
            store.add(new main.Vendor("OTHER"));
            store = db.createObjectStore(main.DBStore.EVENTS, { keyPath: "idx", autoIncrement: true });
        });
    })
        .service('databaseService', main.DatabaseService)
        .service('logService', main.LogService)
        .service('mainConfigService', main.MainConfigService)
        .service('languageService', main.LanguageService)
        .service('notificationService', main.NotificationService)
        .service('vendorService', main.VendorService)
        .service('loginService', main.LoginService)
        .service('menuService', main.MenuService)
        .service('clubService', main.ClubService)
        .service('eventService', main.EventService)
        .service('pilotService', main.PilotService)
        .controller('languageController', main.LanguageController)
        .controller('notificationController', main.NotificationController)
        .controller('loginController', main.LoginController)
        .controller('menuController', main.MenuController)
        .controller('newEventController', main.NewEventController)
        .controller('newClubController', main.NewClubController)
        .controller('editClubController', main.EditClubController)
        .controller('clubListController', main.ClubListController)
        .controller('newPilotController', main.NewPilotController)
        .controller('editPilotController', main.EditPilotController)
        .controller('pilotListController', main.PilotListController)
        .directive('draggable', function ($document) {
        return function (scope, element, attr) {
            var startX = 0, startY = 0, x = 0, y = 0;
            element.css({
                position: 'relative',
                border: '1px solid red',
                backgroundColor: 'lightgrey',
                cursor: 'pointer',
                display: 'block',
                width: '65px'
            });
            element.on('mousedown', function (event) {
                event.preventDefault();
                startX = event.screenX - x;
                startY = event.screenY - y;
                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);
            });
            function mousemove(event) {
                y = event.screenY - startY;
                x = event.screenX - startX;
                element.css({
                    top: y + 'px',
                    left: x + 'px'
                });
            }
            function mouseup() {
                $document.off('mousemove', mousemove);
                $document.off('mouseup', mouseup);
            }
        };
    });
    var englishTranslation = {
        basic: {
            save: "SAVE",
            reset: "RESET",
            'delete': "DELETE",
            country: "COUNTRY",
            club: "CLUB",
            name: "NAME",
            search: "SEARCH"
        },
        menu: {
            events: "EVENTS",
            race: "RACE",
            account: "ACCOUNT",
            settings: "SETTINGS",
            pilots: "PILOTS",
            clubs: "CLUBS",
            version: "version"
        },
        subMenu: {
            eventsNew: "NEW EVENT",
            eventsUpcoming: "UPCOMING EVENTS",
            eventsPast: "PAST EVENTS",
            pilotsNew: "NEW PILOT",
            pilotsList: "PILOTS LIST",
            pilotsEdit: "EDIT PILOT",
            clubsNew: "NEW CLUB",
            clubsList: "CLUBS LIST",
            clubsEdit: "EDIT CLUB",
            settingsLanguage: "LANGUAGE"
        },
        event: {
            event: "EVENT",
            pilots: "PILOTS",
            race: "RACE",
            rounds: "ROUNDS",
            heats: "HEATS",
            createEvent: "CREATE EVENT:",
            name: "EVENT NAME",
            address: "ADDRESS",
            dateFrom: "DATE FROM",
            dateTo: "DATE TO",
            contactEmail: "CONTACT EMAIL",
            automaticMode: "AUTOMATIC MODE",
            classes: "CLASSES",
            nameError: "A valid event name must have at least one and a maximum of 100 characters.",
            addressError: "A valid address must have at least one and a maximum of 200 characters.",
            contactEmailError: "A valid email has a maximum of 100 characters and a format simmilar to name@domain.at."
        },
        pilot: {
            firstName: "FIRST NAME",
            lastName: "LAST NAME",
            email: "EMAIL",
            alias: "ALIAS",
            registrationNumber: "REGISTRATION NR.",
            pilotList: "PILOT LIST:",
            createPilot: "CREATE PILOT:",
            editPilot: "EDIT PILOT:",
            transponder: "TRANSPONDER:",
            firstNameError: "A valid first name must have at least one and a maximum of 30 characters.",
            lastNameError: "A valid last name must have at least one and a maximum of 30 characters.",
            aliasError: "A valid alias has a maximum of 30 characters.",
            emailError: "A valid email has a maximum of 100 characters and a format simmilar to name@domain.at.",
            registrationNumberError: "A valid registration number has a maximum of 30 characters.",
            transponderNumberError: "A valid transponder number has a maximum of 30 characters."
        },
        languageConfig: {
            selectLanguage: "SELECT YOUR LANGUAGE:",
            editLanguage: "EDIT LANGUAGE"
        },
        club: {
            createClub: "CREATE CLUB:",
            clubList: "CLUB LIST:",
            editClub: "EDIT CLUB:",
            nameError: "A valid club name must have at least one and a maximum of 30 characters."
        },
        notification: {
            success: "SUCCESS!",
            info: "INFO!",
            warn: "WARN!",
            error: "ERROR!"
        },
        notificationInfo: {},
        notificationSuccess: {
            saved: "saved",
            deleted: "deleted"
        },
        notificationWarn: {
            formNotValid: "Please validate all red marked data."
        },
        notificationError: {
            tagNotFound: "Translation not found!",
            oops: "Oops, something went wrong! contact info@fpvracetracker.com if you need help!"
        }
    };
    var germanTranslation = {
        basic: {
            save: "SPEICHERN",
            reset: "ZURÜCKSETZEN",
            'delete': "LÖSCHEN",
            country: "LAND",
            club: "CLUB",
            name: "NAME",
            search: "SUCHE"
        },
        menu: {
            events: "EVENTS",
            race: "RENNEN",
            account: "ACCOUNT",
            settings: "EINSTELLUNGEN",
            pilots: "PILOTEN",
            clubs: "VEREINE",
            version: "version"
        },
        subMenu: {
            eventsNew: "NEUES EVENT",
            eventsUpcoming: "ZUKÜNFTIGE EVENTS",
            eventsPast: "VERGANGENE EVENTS",
            pilotsNew: "NEUER PILOT",
            pilotsList: "PILOTEN LISTE",
            pilotsEdit: "PILOT EDITIEREN",
            clubsNew: "NEUER VEREIN",
            clubsList: "VEREIN LISTE",
            clubsEdit: "VEREIN EDITIEREN",
            settingsLanguage: "SPRACHE"
        },
        event: {
            event: "EVENT",
            pilots: "PILOTEN",
            race: "RENNEN",
            rounds: "RUNDEN",
            heats: "HEATS",
            createEvent: "EVENT ERSTELLEN:",
            name: "EVENT NAME",
            address: "ADDRESSE",
            dateFrom: "DATUM VON",
            dateTo: "DATUM BIS",
            contactEmail: "KONTAKT EMAIL",
            automaticMode: "AUTOMATISCHER MODUS",
            classes: "KLASSEN",
            nameError: "Ein Eventname muss aus mindesten einem und maximal 100 Zeichen bestehen.",
            addressError: "Eine Adresse muss aus mindesten einem und maximal 200 Zeichen bestehen.",
            contactEmailError: "Eine korrekte e-Mail besteht aus maximal 100 Zeichen und hat ein Format ähnlich zu name@domain.at."
        },
        pilot: {
            firstName: "VORNAME",
            lastName: "NACHNAME",
            email: "EMAIL",
            alias: "ALIAS",
            registrationNumber: "REGISTRIERUNGS NR.",
            pilotList: "PILOTEN LISTE:",
            createPilot: "PILOT ERSTELLEN:",
            editPilot: "PILOT EDITIEREN:",
            transponder: "TRANSPONDER:",
            firstNameError: "Ein Vorname muss aus mindesten einem und maximal 30 Zeichen bestehen.",
            lastNameError: "Ein Nachname muss aus mindesten einem und maximal 30 Zeichen bestehen.",
            aliasError: "Ein Alias darf aus maximal 30 Zeichen bestehen.",
            emailError: "Eine korrekte e-Mail besteht aus maximal 100 Zeichen und hat ein Format ähnlich zu name@domain.at.",
            registrationNumberError: "Eine Registrierungsnummer darf aus maximal 30 Zeichen bestehen.",
            transponderNumberError: "Eine Transpondernummer darf aus maximal 30 Zeichen bestehen."
        },
        languageConfig: {
            selectLanguage: "WÄHLEN SIE IHRE SPRACHE:",
            editLanguage: "SPRACHE EDITIEREN"
        },
        club: {
            createClub: "VEREIN ERSTELLEN:",
            clubList: "VEREINS-LISTE:",
            editClub: "VEREIN EDITIEREN:",
            nameError: "Ein Clubname muss aus mindesten einem und maximal 30 Zeichen bestehen."
        },
        notification: {
            success: "ERFOLG!",
            info: "INFO!",
            warn: "WARNUNG!",
            error: "ERROR!"
        },
        notificationInfo: {},
        notificationSuccess: {
            saved: "gespeichert",
            deleted: "gelöscht"
        },
        notificationWarn: {
            formNotValid: "Bitte überprüfen Sie alle rot markierten Eingaben."
        },
        notificationError: {
            tagNotFound: "Übersetzung nicht gefunden!",
            oops: "Oops, da ist etwas schief gelaufen! Kontaktieren Sie info@fpvracetracker.com wenn Sie Hilfe benötigen!"
        }
    };
    var japaneseTranslation = {
        basic: {
            save: "保存",
            reset: "リセット",
            'delete': "削除",
            country: "国",
            club: "クラブ",
            name: "名前",
            search: "検索"
        },
        menu: {
            events: "イベント",
            race: "レース",
            account: "アカウント",
            settings: "設定",
            pilots: "パイロット",
            clubs: "クラブ",
            version: "バージョン"
        },
        subMenu: {
            eventsNew: "新規イベント",
            eventsUpcoming: "今後のイベント",
            eventsPast: "過去のイベント",
            pilotsNew: "新規パイロット",
            pilotsList: "パイロット一覧",
            pilotsEdit: "パイロット編集",
            clubsNew: "新規クラブ",
            clubsList: "クラブ一覧",
            clubsEdit: "クラブ編集",
            settingsLanguage: "言語"
        },
        event: {
            event: "イベント",
            pilots: "パイロット",
            race: "レース",
            rounds: "ラウンド",
            heats: "ヒート",
            createEvent: "イベントの作成:",
            name: "イベント名",
            address: "場所",
            dateFrom: "開始日",
            dateTo: "終了日",
            contactEmail: "連絡先メールアドレス",
            automaticMode: "自動モード",
            classes: "クラス",
            nameError: "イベント名は、1〜100文字で入力してください。",
            addressError: "場所は、1〜200文字で入力してください。",
            contactEmailError: "連絡先メールアドレスは、100文字以内でname@domain.atのような形式で入力してください。"
        },
        pilot: {
            firstName: "名",
            lastName: "姓",
            email: "メールアドレス",
            alias: "エイリアス",
            registrationNumber: "登録No.",
            pilotList: "パイロット一覧:",
            createPilot: "パイロット追加:",
            editPilot: "パイロット編集:",
            transponder: "トランスポンダ:",
            firstNameError: "名は、1〜30文字で入力してください。",
            lastNameError: "姓は、1〜30文字で入力してください。",
            aliasError: "エイリアスは、1〜30文字で入力してください。",
            emailError: "メールアドレスは、100文字以内でname@domain.atのような形式で入力してください。",
            registrationNumberError: "登録No.は、1〜30文字で入力してください。",
            transponderNumberError: "トランスポンダは、1〜30文字で入力してください。"
        },
        languageConfig: {
            selectLanguage: "言語:",
            editLanguage: "言語の編集"
        },
        club: {
            createClub: "クラブ追加:",
            clubList: "クラブ一覧:",
            editClub: "クラブ編集:",
            nameError: "クラブ名は、1〜30文字で入力してください。"
        },
        notification: {
            success: "成功",
            info: "情報",
            warn: "警告",
            error: "エラー"
        },
        notificationInfo: {},
        notificationSuccess: {
            saved: "保存",
            deleted: "削除"
        },
        notificationWarn: {
            formNotValid: "赤色の入力項目を修正してください。"
        },
        notificationError: {
            tagNotFound: "翻訳データが見つかりません。",
            oops: "予期しない問題が発生しました。info@fpvracetracker.comまでお問い合わせください。"
        }
    };
})(main || (main = {}));
