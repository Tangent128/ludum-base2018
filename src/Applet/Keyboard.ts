export type KeyName = "up" | "down" | "left" | "right" | "a" | "b" | "menu";

/**
 * A mapper from keys to game actions;
 * meant to be easy to swap out, so only one
 * of these for each "screen" or "menu" is needed.
 */
export interface KeyHandler {
    /// A key has been pressed
    press?(key: KeyName): void,

    /// A key has been released
    release?(key: KeyName): void,

    /// You are receiving control now, perhaps indicate this in the UI
    activate?(): void,

    /// Some other key handler's active now, best not assume you'll get release() events
    block?(): void,
};

const KEY_NAMES: {[code: number]: KeyName} = {
    // compact keys (WASD+ZXC)
    90: "a",
    88: "b",
    67: "menu",
    87: "up",
    83: "down",
    65: "left",
    68: "right",
    // full-board keys (arrows+space/shift/enter)
    32: "a",
    16: "b",
    13: "menu",
    38: "up",
    40: "down",
    37: "left",
    39: "right",
};

/**
 * Utility class to read game input from a DOM element
 * and dispatch it to a KeyHandler object.
 */
export class KeyControl {
    private handler?: KeyHandler;

    private keyUp = (evt: KeyboardEvent) => {
        this.dispatch(evt, "release");
    };
    private keyDown = (evt: KeyboardEvent) => {
        this.dispatch(evt, "press");
    };
    private blur = (evt: FocusEvent) => {
        this.handler && this.handler.block && this.handler.block();
    };

    constructor(private element: HTMLElement, tabindex: number = -1) {
        element.addEventListener("keyup", this.keyUp, false);
        element.addEventListener("keydown", this.keyDown, false);
        element.addEventListener("blur", this.blur, false);
        element.setAttribute("tabindex", tabindex+"");
    };

    public dispose() {
        this.element.removeEventListener("keyup", this.keyUp, false);
        this.element.removeEventListener("keydown", this.keyDown, false);
        this.element.removeEventListener("blur", this.blur, false);
    };

    public setHandler(newHandler?: KeyHandler) {
        this.handler && this.handler.block && this.handler.block();
        this.handler = newHandler;
        this.handler && this.handler.activate && this.handler.activate();
    };

    dispatch(evt: KeyboardEvent, state: "press" | "release") {
        let name = KEY_NAMES[evt.which];
        if(name != null && this.handler) {
            evt.preventDefault();
            evt.stopPropagation();

            if(state == "press" && this.handler.press) {
                this.handler.press(name);
            } else if(state == "release" && this.handler.release) {
                this.handler.release(name);
            }
        }
    };

    public focus() {
        this.element.focus();
    };

};
