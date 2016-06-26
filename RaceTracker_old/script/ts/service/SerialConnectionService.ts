/// <reference path="../_reference.ts"/>
class SerialConnectionService {

    public static INIT_TIMER_STRING = String.fromCharCode(1) + String.fromCharCode(37) + String.fromCharCode(13) + String.fromCharCode(10);
    public static DEVICE: any = null;
    public static CONNECTION_ID: any = null;
    public static RECIEVER_SEARCH_INTERVAL: any = null;
    public static RECIEVER_SEARCH_CONTROL_INTERVAL: any = null;
    public static DEVICES: any[] = [];
    public static DEVICE_TO_VERIFY: any;
    public static SCAN_STRING: string = "";
    public static MESSAGES: string[] = [];

    public static init() {
        if (SERIAL_ENABLED) {
            SerialConnectionService.RECIEVER_SEARCH_INTERVAL = setInterval(SerialConnectionService.lookForDevices, 2000);

            chrome.serial.onReceive.addListener(SerialConnectionService.onReceive);

            chrome.serial.onReceiveError.addListener(function(info) {
                console.error("error: ", info);
                SerialConnectionService.DEVICE = null;
                SerialConnectionService.CONNECTION_ID = null;
                RaceService.CURRENT_STATUS.deviceNotReady = true;
                SerialConnectionService.DEVICES.length = null;
                NotificationService.notify("ERROR: USB connection interrupted, please re-connect and retry your race!!");
                angular.element(document.getElementById('usb')).scope().$apply();
            });
        }
    }

    public static mockOnReceive(dataString: string) {
        SerialConnectionService.onReceive({
            data: SerialConnectionService.str2ab(dataString)
        });
    }

    public static onReceive(info) {
        //<01>@<09>204<09>XXXXXXX<09>SECS.MSS<13><10>
        var msg = SerialConnectionService.ab2str(info.data);
        SerialConnectionService.SCAN_STRING += msg;

        var currentIndex = SerialConnectionService.MESSAGES.length - 1;
        for (var i = 0, strLen = msg.length; i < strLen; i++) {
            if (msg.charCodeAt(i) == 0) {
                continue;
            }
            if (msg.charCodeAt(i) == 1) {
                currentIndex++;
                SerialConnectionService.MESSAGES[currentIndex] = "";
            }
            else if (currentIndex > -1) {
                SerialConnectionService.MESSAGES[currentIndex] += msg[i];
                if (SerialConnectionService.MESSAGES[currentIndex].indexOf(String.fromCharCode(13) + "" + String.fromCharCode(10)) != -1) {
                    RaceService.devicePassed(SerialConnectionService.MESSAGES[currentIndex].split(String.fromCharCode(9)), false);
                }
            }
        }
    }

    public static lookForDevices() {
        if (!SerialConnectionService.isReady()) {
            chrome.serial.getDevices(SerialConnectionService.findReciverSerialDevice);
        }
    }

    public static isReady() {
        if (!SERIAL_ENABLED) {
            return true;
        }
        else {
            return (SerialConnectionService.DEVICE && SerialConnectionService.CONNECTION_ID) ? true : false;
        }
        //return SerialConnectionService.CONNECTION_ID && SerialConnectionService.DEVICE;
    }

    public static resetTrackingDevice() {
        if (SERIAL_ENABLED && SerialConnectionService.CONNECTION_ID) {
            SerialConnectionService.MESSAGES = [];
            SerialConnectionService.SCAN_STRING = "";
            chrome.serial.send(SerialConnectionService.CONNECTION_ID, SerialConnectionService.str2ab(SerialConnectionService.INIT_TIMER_STRING), function(sendInfo) {
                chrome.serial.flush(SerialConnectionService.CONNECTION_ID, function callback(result) {
                });
            });
        }
    }

    public static connectToDevice() {
        if (SERIAL_ENABLED) {
            if (SERIAL_ENABLED) {
                chrome.serial.getConnections((connections) => {
                    connections.forEach((con) => {
                        chrome.serial.disconnect(con.connectionId, function(x) { });
                    });
                });
                setTimeout(function() {
                    chrome.serial.connect(SerialConnectionService.DEVICE_TO_VERIFY.path, {
                        bitrate: 9600,
                        bufferSize: 4096,
                        dataBits: "eight",
                        parityBit: "no",
                        stopBits: "one",
                        ctsFlowControl: false
                    }, function(info) {
                        SerialConnectionService.CONNECTION_ID = info.connectionId;
                        chrome.serial.setControlSignals(SerialConnectionService.CONNECTION_ID, { rts: false }, function(c) {
                            SerialConnectionService.resetTrackingDevice();
                        });
                    });
                }, 1500);
            }
        }
    }

    public static selectDevice(device: any) {
        if (device == SerialConnectionService.DEVICE) {
            chrome.serial.disconnect(SerialConnectionService.CONNECTION_ID, function(data) {
                SerialConnectionService.DEVICE = null;
                SerialConnectionService.CONNECTION_ID = null;
                SerialConnectionService.DEVICES.length = null;
                SerialConnectionService.lookForDevices();
                NotificationService.notify("disconnected from USB device!");
            });
        }
        else {
            SerialConnectionService.DEVICE_TO_VERIFY = device;
            SerialConnectionService.connectToDevice();
        }
    }

    public static findReciverSerialDevice(devices: any[]) {
        if (SERIAL_ENABLED) {
            if (devices.length == 0) {
                SerialConnectionService.DEVICES.length = 0;
                angular.element(document.getElementById('usb')).scope().$apply();
            }
            else {
                for (var idx2 in SerialConnectionService.DEVICES) {
                    var contained = false;
                    for (var idx in devices) {
                        if (JSON.stringify(devices[idx]) == JSON.stringify(SerialConnectionService.DEVICES[idx2])) {
                            contained = true;
                        }
                    }
                    if (!contained) {
                        SerialConnectionService.DEVICES.splice(idx2, 1);
                        angular.element(document.getElementById('usb')).scope().$apply();
                    }
                }
                for (var idx in devices) {
                    var contained = false;
                    for (var idx2 in SerialConnectionService.DEVICES) {
                        if (JSON.stringify(devices[idx]) == JSON.stringify(SerialConnectionService.DEVICES[idx2])) {
                            contained = true;
                        }
                    }
                    if (!contained) {
                        SerialConnectionService.DEVICES.push(devices[idx]);
                        angular.element(document.getElementById('usb')).scope().$apply();
                    }
                }
            }
        }
    }

    public static ab2str(buf) {
        return String.fromCharCode.apply(null, new Uint8Array(buf));
    }

    public static str2ab(str) {
        var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
        var bufView = new Uint8Array(buf);
        for (var i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    }

}