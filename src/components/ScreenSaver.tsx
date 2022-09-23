import { useEffect, useState } from "react";
import physicsObj from "../physics/PhysicsObj";
import dvd from './DVD_logo.svg'
class screenSaver extends physicsObj {
    private colorIndex = 0;
    private static colors = ["blue", "pink", "black", "green"]
    private static colorLen = this.colors.length;
    constructor(element: HTMLElement) {
        super(element, 1, 1, 400, 400, 0, 0);
        element.classList.add(screenSaver.colors[this.colorIndex])
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
                this.collide()
            } else if (this.y + y <= 0) {
                this.y = 0;
                y = 0;
                this.Vy.i = -this.Vy.i;
                this.collide()
            }
            this.dy(y);
            if (this.x + x >= this.width) {
                this.x = this.width - 1;
                x = 0
                this.Vx.i = -this.Vx.i
                this.collide()
            } else if (this.x + x <= 0) {
                this.x = 0;
                x = 0
                this.Vx.i = -this.Vx.i
                this.collide()
            }
            this.dx(x)
            this.Vx.i = this.Vx.i + this.Ax.c * t
            this.Vy.i = this.Vy.i + this.Ay.c * t
        }
        this.previousTimeStamp = timeStamp;
        if (!this.done) {
            window.requestAnimationFrame(this.animate);
        }
    }
    private collide() {
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
export default function ScreenSaver({ show }: ScreenSaverProps) {
    const [physObj, setPhysObj] = useState<screenSaver | null>(null);
    useEffect(() => {
        if (!physObj) return;
        if (show) {
            physObj.startAnimation()
        } else {
            physObj.end();
        }
    }, [physObj, show])
    useEffect(() => {
        let element: HTMLElement | null = document.querySelector('.ScreenSaver')
        setTimeout(() => {
            if (!element) return;
            let physObj = new screenSaver(element)
            setPhysObj(physObj);
        }, 500)
    }, [])
    return (
        <div style={{ visibility: show ? "inherit" : "hidden" }}>
            <img height="200px" className="ScreenSaver" alt="dvd" src={dvd}></img>
        </div>
    )
}