
/**
 * A class decorator for automatically constructing
 * class instances around elements on page load.
 */
export function Bind(selector: string) {
    return (appletType: AppletConstructor) => {
        let elements = document.querySelectorAll(selector);
        for(let i = 0; i < elements.length; i++) {
            let element = elements[i] as HTMLElement;
            new appletType(element);
        }
    }
};
export interface AppletConstructor {
    new(element: HTMLElement): any
};
