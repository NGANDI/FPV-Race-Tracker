/// <reference path="../_reference.ts"/>
class PilotService {
    public static pilots: Pilot[] = [];
    public static selectedCompetition: Competition = null;
    public static scanTimer: any = { value: 0 };
    public static scanInterval = null;
    public static pilot: Pilot = new Pilot({});
    public static mode: any = { update: false, create: false };
    public static countries = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua & Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia & Herzegovina", "Botswana", "Brazil", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Cape Verde", "Cayman Islands", "Chad", "Chile", "China", "Colombia", "Congo", "Cook Islands", "Costa Rica", "Cote D Ivoire", "Croatia", "Cruise Ship", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Estonia", "Ethiopia", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Polynesia", "French West Indies", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Kyrgyz Republic", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Mauritania", "Mauritius", "Mexico", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Namibia", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Rwanda", "Saint Pierre & Miquelon", "Samoa", "San Marino", "Satellite", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka", "St Kitts & Nevis", "St Lucia", "St Vincent", "St. Lucia", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor L'Este", "Togo", "Tonga", "Trinidad & Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks & Caicos", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "Uruguay", "USA", "Uzbekistan", "Venezuela", "Vietnam", "Virgin Islands (US)", "Yemen", "Zambia", "Zimbabwe"];
    public static selectedClass = null;

    public static init(callback) {
        DatabaseService.readAll(DatabaseService.store_pilots, function(pilots) {
            PilotService.setPilots(pilots);
            if (callback)
                callback();
        });
    }

    public static canPilotBeAssignedToRace() {
        if (!this.pilot || !this.pilot.uuid) {
            return false;
        }

        if (!this.pilot.firstName || this.pilot.firstName.length < 2) {
            return false;
        }

        if (!this.pilot.lastName || this.pilot.lastName.length < 2) {
            return false;
        }

        if (!this.pilot.country || this.pilot.country.length < 2) {
            return false;
        }
        if (!PilotService.pilot.pilotNumber || PilotService.pilot.pilotNumber < 1) {
            return false;
        }

        return true;
    }

    public static save() {
        if (!this.isValid()) {
            return;
        }
        PilotService.update(this.pilot); //set create mode only in success callback, good for sanity checks
        if (PilotService.selectedCompetition && PilotService.canPilotBeAssignedToRace()) {
            if (PilotService.selectedClass) {
                CompetitionService.addPilot(PilotService.selectedCompetition, PilotService.pilot, PilotService.selectedClass);
                CompetitionService.update(PilotService.selectedCompetition);
            }
            else {
                NotificationService.notify("No class selected, pilot was not added to Race " + PilotService.selectedCompetition.description);
            }
        }
        document.getElementById("createPilot").classList.add("hidden");
        PilotService.selectedCompetition = null;
        this.setCreateMode();
    }

    public static showCreate() {
        document.getElementById("createPilot").classList.remove("hidden");
        this.setCreateMode();
    }

    public static hideCreate() {
        document.getElementById("createPilot").classList.add("hidden");
        this.setCreateMode();
    }

    public static isValid() {
        if (!this.pilot || !this.pilot.uuid) {
            return false;
        }

        if (!this.pilot.firstName || this.pilot.firstName.length < 2) {
            NotificationService.notify("Please set a first name with 2 characters minimum!");
            return false;
        }

        if (!this.pilot.lastName || this.pilot.lastName.length < 2) {
            NotificationService.notify("Please set a last name with 2 characters minimum!");
            return false;
        }

        if (!this.pilot.country || this.pilot.country.length < 2) {
            NotificationService.notify("Please set a country name with 2 characters minimum!");
            return false;
        }
        
        var pilot = this.pilot;
         if (this.pilot.email && !PilotService.pilots.every(function(p) { return p.email != pilot.email || p.uuid == pilot.uuid; })) {
            NotificationService.notify("e-mail address allready taken!");
            return false;
        }

        return true;
    }

    public static showUpdate(pilot: Pilot) {
        if (this.pilot.uuid == pilot.uuid) {
            this.setCreateMode();
            document.getElementById("createPilot").classList.add("hidden");
            return;
        }
        this.pilot = pilot;
        this.mode.update = true;
        this.mode.create = false;
        this.selectedCompetition = null;
        this.selectedClass = null;
        document.getElementById("createPilotStatus").classList.add("activateUpdate");
        document.getElementById("createPilotStatus").classList.remove("activateCreate");
        document.getElementById("createPilot").classList.remove("hidden");
    }

    public static setCreateMode() {
        document.getElementById("createPilotStatus").classList.add("activateCreate");
        document.getElementById("createPilotStatus").classList.remove("activateUpdate");
        this.mode.update = false;
        this.mode.create = true;
        this.selectedCompetition = null;
        this.selectedClass = null;
        this.pilot = new Pilot({
            classs: ClassService.getFirstClass(),
            pilotNumber: PilotService.getNextPilotNumber()
        });
    }

    public static scanCountdown() {
        if (PilotService.scanTimer.value > 0) {
            PilotService.scanTimer.value--;
            PilotService.reloadAngular();
        }
        else {
            PilotService.scanTimer.value = 0;
            RaceService.CURRENT_STATUS.readDevice = false;
            clearInterval(PilotService.scanInterval);
        }
    }

    public static scanPilot() {
        RaceService.pilotToScan = this.pilot;
        RaceService.CURRENT_STATUS.readDevice = true;
        PilotService.scanTimer.value = 10;
        PilotService.scanInterval = setInterval(PilotService.scanCountdown, 1000);
    }

    public static pilotFilter(pilot, index, array) {
        if (
            !CompetitionService.nameFilter.text
            || ("" + pilot.pilotNumber).indexOf(CompetitionService.nameFilter.text) != -1
            || (pilot.firstName + " " + pilot.lastName).toUpperCase().indexOf(CompetitionService.nameFilter.text.toUpperCase()) != -1) {
            return true;
        }
        return false;
    }

    public static getNextPilotNumber() {
        var smallestFreePilotNumber: number = 1;
        var found = true;
        while (found) {
            found = false;
            for (var idx in PilotService.pilots) {
                if (PilotService.pilots[idx].pilotNumber == smallestFreePilotNumber) {
                    found = true;
                    smallestFreePilotNumber++;
                    break;
                }
            }
        }
        return smallestFreePilotNumber;
    }

    public static download() {
        var csv = "";
        csv += "Date:;" + (new Date()) + "\n\n";

        csv += "First Name; Last Name; Alias; Phone; Country; email; Club; Transponder ID; Race Number; Class\n";
        for (var idx in PilotService.pilots) {
            if (PilotService.pilots[idx].firstName) {
                csv += PilotService.pilots[idx].firstName + ";";
            }
            else {
                csv += ";";
            }
            if (PilotService.pilots[idx].lastName) {
                csv += PilotService.pilots[idx].lastName + ";";
            }
            else {
                csv += ";";
            }
            if (PilotService.pilots[idx].alias) {
                csv += PilotService.pilots[idx].alias + ";";
            }
            else {
                csv += ";";
            }
            if (PilotService.pilots[idx].phone) {
                csv += PilotService.pilots[idx].phone + ";";
            }
            else {
                csv += ";";
            }
            if (PilotService.pilots[idx].country) {
                csv += PilotService.pilots[idx].country + ";";
            }
            else {
                csv += ";";
            }
            if (PilotService.pilots[idx].email) {
                csv += PilotService.pilots[idx].email + ";";
            }
            else {
                csv += ";";
            }
            if (PilotService.pilots[idx].club) {
                csv += PilotService.pilots[idx].club + ";";
            }
            else {
                csv += ";";
            }
            if (PilotService.pilots[idx].deviceId) {
                csv += PilotService.pilots[idx].deviceId + ";";
            }
            else {
                csv += ";";
            }
            if (PilotService.pilots[idx].pilotNumber) {
                csv += PilotService.pilots[idx].pilotNumber + ";";
            }
            else {
                csv += ";";
            }
            csv += "\n";
        }
        var blobdata = new Blob([csv], { type: 'text/csv' });
        var filename = "pilots_export_(" + new Date().toJSON() + ").csv";
        filename = filename.replace(" ", "");
        var link = document.createElement("a");
        link.setAttribute("href", window.URL.createObjectURL(blobdata));
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        NotificationService.notify(NotificationService.fileDownloadText);
    }
    public static update(pilot: Pilot) {
        if (pilot.firstName && pilot.lastName) {
            DatabaseService.save(DatabaseService.store_pilots, pilot, function(e) {
                if (PilotService.pilots.every(function(p) {
                    if (p.uuid == pilot.uuid) {
                        p = pilot;
                        return false;
                    }
                    return true;
                })) {
                    PilotService.pilots.push(new Pilot(pilot));
                }
              	for (var eidx in CompetitionService.competitions) {
                    var competition = CompetitionService.competitions[eidx];
                    var changed = false;
                    console.log("pilots", competition.pilots);
                    for (var pidx in competition.pilots) {
                        if (pilot.uuid == competition.pilots[pidx].uuid) {
                            //this needs to be done because classs is only available in pilot copies of competition pilots array
                            var oldClasss = competition.pilots[pidx].classs;
                            console.log("oldClass", oldClasss);
                            competition.pilots[pidx] = new Pilot(pilot);
                            competition.pilots[pidx].classs = oldClasss;
                            changed = true;
                        }
                    }
                    if (changed) {
                        CompetitionService.update(competition);
                    }
                }
                RaceService.races.forEach((race) => {
                    race.rounds.forEach((round) => {
                        round.heats.forEach((heat) => {
                            if (!heat.heatResult) {
                                for (var idx = 0; idx < heat.pilots.length; idx++) {
                                    if (heat.pilots[idx].uuid == pilot.uuid) {
                                        //this needs to be done because raceband is only available in pilot copies of heat pilots array
                                        var oldRaceBand = heat.pilots[idx].assignedRaceBand;
                                        //this needs to be done because classs is only available in pilot copies of competition pilots array
                                        var oldClass = heat.pilots[idx].classs;
                                       	heat.pilots[idx] = new Pilot(pilot);
                                        heat.pilots[idx].assignedRaceBand = oldRaceBand;
                                        heat.pilots[idx].classs = oldClasss;
                                        RaceService.update(race);
                                    }
                                }
                            }
                        });
                    });
                });
                PilotService.reloadAngular();
                NotificationService.notify("Pilot saved!");
            }, function(e) {
                NotificationService.notify("Pilot error!");
            }); //replace null with callback
        }
    }

    public static deletePilot() {
        ConfirmationService.pleaseConfirm(function() {
            DatabaseService.delete(DatabaseService.store_pilots, PilotService.pilot, function() {
                if (PilotService.pilots.indexOf(PilotService.pilot) == -1) {
                    return;
                }
                PilotService.pilots.splice(PilotService.pilots.indexOf(PilotService.pilot), 1);
                document.getElementById("createPilotStatus").classList.add("activateCreate");
                document.getElementById("createPilotStatus").classList.remove("activateUpdate");
                for (var eidx in CompetitionService.competitions) {
                    var competition = CompetitionService.competitions[eidx];

                    for (var pidx = 0, max = competition.pilots.length; pidx < max; pidx++) {
                        if (PilotService.pilot.uuid == competition.pilots[pidx].uuid) {
                            competition.pilots.splice(pidx, 1);
                            max = CompetitionService.selectedCompetition.pilots.length;
                            pidx--;
                            CompetitionService.update(competition);
                        }
                    }
                }
                RaceService.races.forEach((race) => {
                    race.rounds.forEach((round) => {
                        round.heats.forEach((heat) => {
                            if (!heat.heatResult) {
                                for (var idx = 0; idx < heat.pilots.length; idx++) {
                                    if (heat.pilots[idx].uuid == PilotService.pilot.uuid) {
                                        heat.pilots.splice(idx, 1);
                                        RaceService.update(race);
                                        break;
                                    }
                                }
                            }
                        });
                    });
                });
                PilotService.setCreateMode();
                PilotService.reloadAngular();
                NotificationService.notify("Pilot deleted");
            }, function() {
                NotificationService.notify("Pilot delete error!");
            });
            document.getElementById("createPilot").classList.add("hidden");
        }, function() { });
    }

    public static setPilots(pilots: Pilot[]) {
        for (var pilotNewIdx in pilots) {
            var found = false;
            for (var pilotOldIdx in PilotService.pilots) {
                if (PilotService.pilots[pilotOldIdx].uuid == pilots[pilotNewIdx].uuid) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                PilotService.pilots.push(new Pilot(pilots[pilotNewIdx]));
            }
        }
        if (PilotService.pilots.length == 0) {
            DatabaseFillingService.fillDefaultPilots(PilotService.init);
        }
        PilotService.reloadAngular();
    }

    public static reloadAngular() {
        angular.element(document.getElementById('pilots')).scope().$apply();
    }
}