import "index.scss";

export function test() {
    const div = document.querySelector("div");
    if(div) div.innerText = "Hello, World!";
}

test();
