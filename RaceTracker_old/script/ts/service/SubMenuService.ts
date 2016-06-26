/// <reference path="../_reference.ts"/>
class SubMenuService {
    static init() {
        document.getElementById("subMenuUsb").onclick = SubMenuService.usb;
        document.getElementById("subMenuRaceBand").onclick = SubMenuService.raceBand;
        document.getElementById("subMenuClasses").onclick = SubMenuService.classes;
        document.getElementById("subMenuScreen2").onclick = SubMenuService.screen2;
        document.getElementById("subMenuTTS").onclick = SubMenuService.tts;
        document.getElementById("subMenuCloud").onclick = SubMenuService.cloud;
        document.getElementById("subMenuLiveScreen").onclick = SubMenuService.liveScreen;
    }

    public static showElementById(id: string) {
        document.getElementById(id).classList.add('visible');
    }

    public static hideAllContent() {
        document.getElementById('usb').classList.remove('visible');
        document.getElementById('raceBand').classList.remove('visible');
        document.getElementById('classes').classList.remove('visible');
        document.getElementById('screen2').classList.remove('visible');
        document.getElementById('tts').classList.remove('visible');
        document.getElementById('cloud').classList.remove('visible');
        document.getElementById('liveScreen').classList.remove('visible');
    }


    public static hideSubMenu() {
        document.getElementById('subMenu').classList.remove('visible');
        document.getElementById('subMenuUsb').classList.remove('visible');
        document.getElementById('subMenuRaceBand').classList.remove('visible');
        document.getElementById('subMenuClasses').classList.remove('visible');
        document.getElementById('subMenuScreen2').classList.remove('visible');
        document.getElementById('subMenuTTS').classList.remove('visible');
        document.getElementById('subMenuCloud').classList.remove('visible');
        document.getElementById('liveScreen').classList.remove('visible');
    }

    public static usb() {
        SubMenuService.hideAllContent();
        SubMenuService.showElementById("usb");
    }

    public static raceBand() {
        SubMenuService.hideAllContent();
        SubMenuService.showElementById("raceBand");
    }

    public static classes() {
        SubMenuService.hideAllContent();
        SubMenuService.showElementById("classes");
    }

    public static screen2() {
        SubMenuService.hideAllContent();
        SubMenuService.showElementById("screen2");
    }

    public static tts() {
        SubMenuService.hideAllContent();
        SubMenuService.showElementById("tts");
    }

    public static liveScreen() {
        SubMenuService.hideAllContent();
        SubMenuService.showElementById("liveScreen");
    }

    public static cloud() {
        SubMenuService.hideAllContent();
        SubMenuService.showElementById("cloud");
        setTimeout(CloudSyncService.readyToTransferAccount, 500);

    }

    public static showConfigurationSubMenu() {
        SubMenuService.setSubMenuSize(7);
        SubMenuService.showElementById("subMenuUsb");
        SubMenuService.showElementById("subMenuRaceBand");
        SubMenuService.showElementById("subMenuClasses");
        SubMenuService.showElementById("subMenuScreen2");
        SubMenuService.showElementById("subMenuTTS");
        SubMenuService.showElementById("subMenuCloud");
        SubMenuService.showElementById("subMenuLiveScreen");
        SubMenuService.showElementById("subMenu");
        SubMenuService.showElementById("usb");
    }

    public static setSubMenuSize(size: number) {
        if (size > 0 && size <= 7) {
            document.getElementById("subMenu").className = '';
            document.getElementById("subMenu").classList.add("size" + size);
        }
    }
}
