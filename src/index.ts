import "index.scss";
import { Bind } from "Applet";

@Bind("div")
export class Test {
    constructor(div: HTMLElement) {
        div.innerText = "Hello, World!";
    }
}
