/// <reference path="../_reference.ts"/>
class TTSService {

    public static gender: string = "female";
    public static voiceName: string = "";
    public static ttsEnabled = { value: true };
    public static language = "en";

    public static speak(text: string) {
        if (!TTSService.ttsEnabled.value) {
            chrome.tts.stop();
            return;
        }
        chrome.tts.speak(text, { rate: 0.85, gender: TTSService.gender, 'lang': TTSService.language, 'enqueue': true, voiceName: TTSService.voiceName });
    }

    public static speakStartHeatCountdown(text: string) {
        if (!TTSService.ttsEnabled.value) {
            chrome.tts.stop();
            return;
        }
        chrome.tts.stop();
        chrome.tts.speak(text, { gender: TTSService.gender, 'lang': TTSService.language, 'enqueue': true, voiceName: TTSService.voiceName });
    }

    public static speakNow(text: string) {
        if (!TTSService.ttsEnabled.value) {
            chrome.tts.stop();
            return;
        }
        chrome.tts.stop();
        chrome.tts.speak(text, { gender: TTSService.gender, 'lang': TTSService.language, 'enqueue': true, voiceName: TTSService.voiceName });
    }

    public static pilotPassedGate(pilotName, lapNumber, lapTime) {
        TTSService.speak(pilotName + ", lap" + lapNumber + " with " + lapTime + " seconds");
    }
}

