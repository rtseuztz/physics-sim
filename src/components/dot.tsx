import { useEffect } from "react";
import physicsObj from "../physics/PhysicsObj";

let start: number, previousTimeStamp: number;
let done = false
let element: HTMLElement;
var body = document.body,
    html = document.documentElement;

var height = Math.max(body.scrollHeight, body.offsetHeight,
    html.clientHeight, html.scrollHeight, html.offsetHeight);
function step(timeStamp: number) {
    if (start === undefined)
        start = timeStamp
    const elapsed = timeStamp - start;
    if (previousTimeStamp !== timeStamp) {
        const count = (-200 * elapsed / 1000) + .5 * 90.8 * (Math.pow(elapsed / 1000, 2))
        element.style.transform = `translate(${elapsed * .1}px, ${count}px)`;
        if (count >= height) done = true;
    }
    previousTimeStamp = timeStamp;
    if (!done) {
        console.log("going")
        window.requestAnimationFrame(step);
    }
}

export default function Dot() {
    useEffect(() => {
        element = document.querySelector('.dot') || document.body
        element.style.transform = `translateY(0px)`;
        let rect = element.getBoundingClientRect();
        height = Math.max(body.scrollHeight, body.offsetHeight,
            html.clientHeight, html.scrollHeight, html.offsetHeight);
        height -= rect.bottom + rect.height / 2;
        console.log(height + " " + rect.top);
        setTimeout(() => {
            let physObj = new physicsObj(element, 500, 500, 100, 100, 0, 0)
            physObj.startAnimation();
            //window.requestAnimationFrame(step)
        }, 1000)
    }, [])
    return (
        <div className="dot">
            a
        </div>
    )
}