import { Bind } from "Applet";
import { KeyControl, KeyHandler, KeyName } from "Applet/Keyboard";
import { Loop } from "Applet/Loop";

@Bind("#KeyTest")
export class Test implements KeyHandler {
    private keys: KeyControl;

    constructor(public div: HTMLElement) {
        this.keys = new KeyControl(this.div);
        this.keys.setHandler(this);
        this.keys.focus();
    }

    dispose() {
        this.keys.dispose();
    }

    activate() {
        this.div.innerText = "Ready for input.";
    }

    press(key: KeyName) {
        this.div.innerText = `Pressed ${key}`;
    }

    release(key: KeyName) {
        this.div.innerText = `Released ${key}`;
    }
}
