/// <reference path="../_reference.ts"/>
function UsbController() {
    this.devices = SerialConnectionService.DEVICES;
    this.isReady = SerialConnectionService.isReady;

    this.selectDevice = function(device) {
        SerialConnectionService.selectDevice(device);
    }
}