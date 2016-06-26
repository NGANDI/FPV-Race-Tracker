/// <reference path="../_reference.ts"/>
class Timer {
    private intervalTime: number;
    public lastExecution: number;
    public internalTimer;
    public countdownValue: number = 0;
    private initCountdownValue: number;
    public finishCallback = null;
    public updateCallback = null;
    private startPlayed;
    private lastSecond = 0;
    private reloadCallback;
    private stop = false;
    
    constructor() {
        this.countdownValue = 0;
    }

    public startTimer(countdownValue: number, finishCallback, startPlayed, reloadCallback) {
        this.startPlayed = startPlayed;
        this.stop = false;
        this.initCountdownValue = countdownValue;
        this.intervalTime = 20;
        this.countdownValue = countdownValue;
        this.lastExecution = this.getCurrentMillis();
        clearTimeout(this.internalTimer);
        this.finishCallback = finishCallback;
        this.reloadCallback = reloadCallback;
        this.internalTimer = setTimeout(() => this.updateCountdown(), this.intervalTime);
        return this;
    }
    
    public setTimerStopable() {
        this.stop = true;
    }
    
    public stopTimer() {
        this.countdownValue = 0;
        clearTimeout(this.internalTimer);
        this.finishCallback();
    }

    private updateCountdown(): void {
        var now: number = this.getCurrentMillis();
        if (!this.stop && this.countdownValue - (now - this.lastExecution) > 0) {
            this.countdownValue = this.countdownValue - now + this.lastExecution;
            this.lastExecution = now;
            var progress = 100 - (100 * (this.countdownValue / this.initCountdownValue));
            this.internalTimer = setTimeout(() => this.updateCountdown(), this.intervalTime);

            if (!this.startPlayed && this.countdownValue < 5000) {
                this.startPlayed = true;
                SoundService.playStart();
            }
            
            if(this.reloadCallback && Math.floor(this.countdownValue) != this.lastSecond) {
                this.lastSecond = Math.floor(this.countdownValue);
                this.reloadCallback();
            }
        }
        else {
            this.stopTimer();
        }
    }

    private getCurrentMillis(): number {
        return new Date().getTime();
    }
}