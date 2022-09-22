import { useEffect } from "react";
import physicsObj from "../physics/PhysicsObj";
class screenSaver extends physicsObj {
    constructor(element: SVGElement) {
        super(element, 1, 1, 100, 100, 0, 0);
    }
    protected animate = (timeStamp: number) => {
        var t = (timeStamp - this.previousTimeStamp) / 1000
        if (this.previousTimeStamp !== timeStamp) {
            var x = (this.Vx.i * t) + .5 * this.Ax.c * (Math.pow(t, 2))
            var y = (this.Vy.i * t) + .5 * this.Ay.c * (Math.pow(t, 2))
            if (this.y + y >= this.height) {
                this.y = this.height - 1;
                y = 0;
                this.Vy.i = -this.Vy.i;
                this.Ay.c = -this.Ay.c
            } else if (this.y + y <= 0) {
                this.y = 0;
                y = 0;
                this.Vy.i = -this.Vy.i;
                this.Ay.c = -this.Ay.c
            }
            this.dy(y);
            if (this.x + x >= this.width) {
                this.x = this.width - 1;
                x = 0
                this.Vx.i = -this.Vx.i
                this.Ax.c = -this.Ax.c
            } else if (this.x + x <= 0) {
                this.x = 0;
                x = 0
                this.Vx.i = -this.Vx.i
                this.Ax.c = -this.Ax.c
            }
            this.dx(x)
            //for next time
            this.Vx.i = this.Vx.i + this.Ax.c * t
            this.Vy.i = this.Vy.i + this.Ay.c * t
            this.start = timeStamp
        }
        this.previousTimeStamp = timeStamp;
        if (!this.done) {
            window.requestAnimationFrame(this.animate);
        }
    }
    public end() {
        this.done = true;
    }
}
export default function ScreenSaver() {
    useEffect(() => {
        let element: SVGElement | null = document.querySelector('svg')
        if (!element) return;
        let physObj = new screenSaver(element)
        physObj.startAnimation();
    }, [])
    return (
        <svg className="ScreenSaver" xmlns="http://www.w3.org/2000/svg">
            <g>
                <rect x="0" y="0" width="100" height="100" fill="red"></rect>
                <text x="0" y="50" font-family="Verdana" font-size="35" fill="blue">Hello</text>
            </g>
        </svg>
    )
}