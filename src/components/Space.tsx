import { useEffect, useMemo, useRef, useState } from "react";
import Planet from "../physics/Planet";

export class SpaceObj {
    readonly planets: Planet[] = [];
    public planetLength: number
    done: boolean = true;
    constructor(eleArr: HTMLElement[]) {
        eleArr.forEach((ele) => {

            this.planets.push(new Planet(ele, 30 * Math.random() + 5, 30 * Math.random() + 5))
        })
        //set the first planet's mass (cursor) to 1 using the setmass function
        // this.planets[0].mass = 1
        // this.planets[0].setVelocity(0, -100)
        // this.planets[0].element.style.visibility = "none"
        this.planetLength = eleArr.length;
        //track mouse position
        // window.addEventListener('mousemove', (e) => {
        //     this.planets[0].move(e.clientX, e.clientY)
        // })
    }
    public startAnimation() {

        if (this.planetLength > 1 && this.done) {
            this.done = false;
            window.requestAnimationFrame(this.animate)
        }
    }
    protected animate = (timeStamp: number) => {
        let first = true;
        this.planets.forEach((planet) => {
            if (first) {
                first = false;
                this.planets[0].setVelocity(5000, 5000)
            } else
                planet.groupAnimate(timeStamp)
        })
        // for (var i = 0; i < this.planetLength - 1; i++) {
        //     for (var j = i + 1; j < this.planetLength; j++) {
        //         if (this.planets[i].intersects(this.planets[j])) {
        //             /**
        //              * Using momentum equation with elastic collision: 
        //              * V1f = (m1-m2)v1/(m1+m2) + (2*m2*v2)/(m1+m2)
        //              * V2f = (2*m1*v1)/(m1+m2) - (m1-m2)v2/(m1+m2)
        //              */
        //             const b1 = this.planets[i], b2 = this.planets[j]
        //             if (i === 0) {
        //                 //j hits cursor
        //                 b2.setVelocity(1.5 * b2.vx, 1.5 * b2.vy)
        //                 continue;
        //             }
        //             if (Math.abs(b1.vx) < .1 && Math.abs(b1.vy) < .1 &&
        //                 Math.abs(b2.vy) < .1 && Math.abs(b2.vy) < .1) {
        //                 continue
        //             }
        //             const V1Template = (v1: number, v2: number): number => {
        //                 return (b1.mass - b2.mass) * v1 / (b1.mass + b2.mass) + (2 * b2.mass * v2) / (b1.mass + b2.mass);
        //             }
        //             const V2Template = (v1: number, v2: number): number => {
        //                 return (2 * b1.mass * v1) / (b1.mass + b2.mass) - (b1.mass - b2.mass) * v2 / (b1.mass + b2.mass)
        //             }
        //             var b1x = V1Template(b1.vx, b2.vx), b1y = V1Template(b1.vy, b2.vy)
        //             var b2x = V2Template(b1.vx, b2.vx), b2y = V2Template(b1.vy, b2.vy)

        //             // .009 is due to multiple collisions, should only collide once though
        //             // when fixed, this can be the dampening factor 
        //             b1.setVelocity((1 - .009) * b1x, (1 - .009) * b1y);
        //             b2.setVelocity((1 - .009) * b2x, (1 - .009) * b2y)
        //             const angle = b1.angleBetween(b2)
        //             b1.dx(-Math.cos(angle)).dy(Math.sin(angle) * 1)
        //             console.log(-Math.cos(angle) * 1, Math.sin(angle) * 1)
        //             b2.dx(-Math.cos(angle + Math.PI) * 1).dy(Math.sin(angle + Math.PI) * 1)
        //             b1.setForce(-Math.cos(angle), Math.sin(angle))
        //             b2.setForce(-Math.cos(angle + Math.PI), Math.sin(angle + Math.PI))
        //         }
        //     }
        // }
        if (!this.done) {
            window.requestAnimationFrame(this.animate);
        }
    }
    // public addplanet(ele: JSX.Element): void {
    //     this.planets.push(new Planet(ele as unknown as HTMLElement, 30 * Math.random() + 5))
    //     this.planetLength++;
    // }
    // //remove a random planet and the element
    // public removeplanet(): void {
    //     if (this.planetLength > 1) {
    //         const planet = this.planets.pop()
    //         planet?.element.remove()
    //         this.planetLength--;
    //     }
    // }
    /**
     * Stops the animation
     */
    public end(): void {
        this.done = true;
    }

}

export default function Space() {
    const [planetNum, setPlanetNum] = useState(5);

    const spaceRef = useRef<SVGSVGElement>(null);
    const spaceObj = useRef<SpaceObj | null>(null);
    //make eles array of jsx.element a use memo
    const eles = useMemo<JSX.Element[]>(() => [], [])
    useEffect(() => {
        if (spaceRef.current) {
            const space = spaceRef.current;
            const planetEles = [...space.children].map((ele) => ele as HTMLElement);
            spaceObj.current = new SpaceObj(planetEles);
            spaceObj.current.startAnimation();
        }
        return () => {
            if (spaceObj.current) {
                spaceObj.current.end();
            }
        }
    }, [eles])
    //function to end the previous space and start a new one
    const startNewspace = () => {
        if (spaceObj.current) {
            spaceObj.current.end();
        }
        const space = spaceRef.current;
        if (!space) {
            return;
        }
        const planetEles = [...space.children].map((ele) => ele as HTMLElement);
        spaceObj.current = new SpaceObj(planetEles);
        spaceObj.current.startAnimation();
    }
    const genRanHex = (size: number): string => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    const genCircle = (): JSX.Element => {
        return <circle className="planet" cx="50" cy="50" r="50" fill={"#" + genRanHex(6)} />
    }
    eles.push(genCircle())
    for (var i = 0; i < planetNum; i++) {
        eles.push(
            genCircle()
        )
    }
    return (
        <div className="space">
            <svg ref={spaceRef} className="space" viewBox="0 0 100 100">
                {eles}
            </svg>
            <button onClick={() => setPlanetNum(planetNum + 1)}>Add Planet</button>
            <button onClick={() => setPlanetNum(planetNum - 1)}>Remove Planet</button>
            <button onClick={startNewspace}>Start New Space</button>
        </div>
    )
}