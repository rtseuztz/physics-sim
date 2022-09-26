import { useEffect, useState } from "react";
import physicsObj, { PhysicsParams } from "../physics/PhysicsObj";
import dvd from './DVD_logo.svg'
export class screenSaver extends physicsObj {
    private colorIndex = 0;
    private static colors = ["blue", "pink", "black", "green"]
    private static colorLen = this.colors.length;
    constructor(element: HTMLElement) {
        const screenSaverParams: PhysicsParams = {
            element: element,
            x: 1,
            y: 1,
            vx: 400,
            vy: 400,
            fx: 0,
            fy: 0
        }
        super(screenSaverParams);
        element.classList.add(screenSaver.colors[this.colorIndex])
    }
    protected animate = (timeStamp: number) => {
        var t = (timeStamp - this.previousTimeStamp) / 1000
        if (this.previousTimeStamp !== timeStamp) {
            var x = (this.Vx * t) + .5 * this.Ax * (Math.pow(t, 2))
            var y = (this.Vy * t) + .5 * this.Ay * (Math.pow(t, 2))
            if (this.y + y >= this.height) {
                this.y = this.height - 1;
                y = 0;
                this.Vy = -this.Vy;
                this.collide()
            } else if (this.y + y <= 0) {
                this.y = 0;
                y = 0;
                this.Vy = -this.Vy;
                this.collide()
            }
            this.dy(y);
            if (this.x + x >= this.width) {
                this.x = this.width - 1;
                x = 0
                this.Vx = -this.Vx
                this.collide()
            } else if (this.x + x <= 0) {
                this.x = 0;
                x = 0
                this.Vx = -this.Vx
                this.collide()
            }
            this.dx(x)
            this.Vx = this.Vx + this.Ax * t
            this.Vy = this.Vy + this.Ay * t
        }
        this.previousTimeStamp = timeStamp;
        if (!this.done) {
            window.requestAnimationFrame(this.animate);
        }
    }
    public collide() {
        this.element.classList.remove(screenSaver.colors[this.colorIndex])
        this.colorIndex = ++this.colorIndex % screenSaver.colorLen
        this.element.classList.add(
            screenSaver.colors[this.colorIndex]
        )
    }
    public end() {
        this.done = true;
    }
}
export interface ScreenSaverProps {
    show: boolean
}
export default function ScreenSaver() {
    const [physObj, setPhysObj] = useState<screenSaver | null>(null);
    useEffect(() => {
        const element = document.getElementById("screenSaver");
        if (!element) return;
        const physObj = new screenSaver(element);
        setPhysObj(physObj);
        physObj.startAnimation();
        return () => {
            physObj.end();
        }
    }, [])
    return (
        <div >
            <img height="200px" id="screenSaver" className="ScreenSaver" alt="dvd" src={dvd}></img>
        </div>
    )
}