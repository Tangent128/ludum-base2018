import { KeyControl } from "./Keyboard";

/**
 * A class decorator for automatically constructing
 * class instances around elements on page load.
 */
export function Bind(selector: string) {
    return (appletType: AppletConstructor) => {
        const elements = document.querySelectorAll(selector);
        for(let i = 0; i < elements.length; i++) {
            const element = elements[i] as HTMLElement;
            new appletType(element);
        }
    }
};
export interface AppletConstructor {
    new(element: HTMLElement): any
};

/**
 * A class decorator for automatically constructing
 * a KeyControl around a canvas on page load & fetching the render context.
 */
export function Game(selector: string, tabIndex = -1) {
    return (gameType: GameConstructor) => {
        const elements = document.querySelectorAll(selector);
        for(let i = 0; i < elements.length; i++) {
            const element = elements[i] as HTMLCanvasElement;
            if(!(element instanceof HTMLCanvasElement)) continue;

            const cx = element.getContext("2d") as CanvasRenderingContext2D;
            const keys = new KeyControl(element, tabIndex);

            new gameType(element, cx, keys);
        }
    }
};
export interface GameConstructor {
    new(canvas: HTMLCanvasElement, cx: CanvasRenderingContext2D, keys: KeyControl): any
};
