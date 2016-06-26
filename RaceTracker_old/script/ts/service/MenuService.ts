/// <reference path="../_reference.ts"/>
class MenuService {
    static init() {
        document.getElementById("menuNewRace").onclick = MenuService.races;
        document.getElementById("menuNewPilot").onclick = MenuService.pilots;
        document.getElementById("menuStatistics").onclick = MenuService.statistics;
        document.getElementById("menuConfiguration").onclick = MenuService.configuration;
        document.getElementById("menuNewEvent").onclick = MenuService.events;
    }

    public static showElementById(id: string) {
        MenuService.hideAll();
        document.getElementById(id).classList.add('visible');
    }

    public static hideAll() {
        document.getElementById('pilots').classList.remove('visible');
        document.getElementById('races').classList.remove('visible');
        document.getElementById('statistic').classList.remove('visible');
        document.getElementById('events').classList.remove('visible');
        SubMenuService.hideAllContent();
        SubMenuService.hideSubMenu();
    }

    public static events() {
        CompetitionService.init(null);
        MenuService.showElementById("events");
    }

    public static races() {
        MenuService.showElementById("races");
        RaceService.init(null);
    }

    public static pilots() {
        PilotService.init(null);
        MenuService.showElementById("pilots");
    }

    public static configuration() {
        MenuService.hideAll();
        SubMenuService.showConfigurationSubMenu();
    }

    public static statistics() {
        StatisticService.init();
        MenuService.showElementById("statistic");
    }
}
