/// <reference path="../_reference.ts"/>
class SoundService {

    public static startAudio;
    public static beepAudio;

    public static init() {
        SoundService.startAudio = new Audio();
        SoundService.startAudio.src = "sounds/start.mp3";
        SoundService.beepAudio = new Audio();
        SoundService.beepAudio.src = "sounds/beep.mp3";
    }

    public static playStart() {
        //play this sound 4 sec before race starts!
        SoundService.startAudio.play();
    }

    public static playBeep() {
        //play this sound 4 sec before race starts!
        SoundService.beepAudio.play();
    }
}

