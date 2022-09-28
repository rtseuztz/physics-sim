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
            fy: 0,
            dampening: 0
        }
        super(screenSaverParams);
        element.classList.add(screenSaver.colors[this.colorIndex])
    }

    protected crossesRight = (): boolean => this.x + this.element.clientWidth >= this.width
    protected rightBoundaryHit = (offset?: number | undefined): number => {
        return super.rightBoundaryHit(-this.element.clientWidth)
    }
    protected crossesTop = (): boolean => this.y <= 0
    protected topBoundaryHit(offset?: number | undefined): number {
        return super.topBoundaryHit(1)
    }
    protected crossesBottom = (): boolean => this.y >= this.height;
    // protected bottomBoundaryHit(offset?: number): number {
    //     this.y = this.height - this.element.clientHeight
    //     this.Vy = -this.Vy
    //     return 0;
    // }
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