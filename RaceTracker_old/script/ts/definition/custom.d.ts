declare var LOGGING: boolean;
declare var chrome: any;
declare var SERIAL_ENABLED: boolean;

interface Node {
    innerHTML: any;
    checked: boolean;
}

interface EventTarget {
    result: any;
}

interface IScope {
    (): void;
}

interface md5Lib {
    (text: string): string;
}

declare var md5: md5Lib;