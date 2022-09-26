import { useEffect, useRef } from "react";
import { couldStartTrivia } from "typescript";
import physicsObj, { PhysicsParams } from "../physics/PhysicsObj";
import Ball from '../physics/Ball'

class BallPitObj {
    readonly balls: Ball[] = [];
    readonly ballLength: number
    done: boolean = true;
    constructor(eleArr: HTMLElement[]) {
        eleArr.forEach((ele) => {
            this.balls.push(new Ball(ele, 30 * Math.random() + 5))
        })
        this.ballLength = eleArr.length;
    }
    public startAnimation() {
        this.balls.forEach((ball) => {
            ball.startAnimation()
        })
        if (this.ballLength > 1) {
            this.done = false;
            window.requestAnimationFrame(this.animate)
        }
    }
    protected animate = (timeStamp: number) => {
        for (var i = 0; i < this.ballLength - 1; i++) {
            for (var j = i + 1; j < this.ballLength; j++) {
                if (this.balls[i].intersects(this.balls[j])) {
                    /**
                     * Using momentum equation with elastic collision: 
                     * V1f = (m1-m2)v1/(m1+m2) + (2*m2*v2)/(m1+m2)
                     * V2f = (2*m1*v1)/(m1+m2) - (m1-m2)v2/(m1+m2)
                     */
                    const b1 = this.balls[i], b2 = this.balls[j]
                    if (Math.abs(b1.getVx) < .1 && Math.abs(b1.getVy) < .1 &&
                        Math.abs(b2.getVx) < .1 && Math.abs(b2.getVy) < .1) {
                        continue
                    }
                    const V1Template = (v1: number, v2: number): number => {
                        return (b1.mass - b2.mass) * v1 / (b1.mass + b2.mass) + (2 * b2.mass * v2) / (b1.mass + b2.mass);
                    }
                    const V2Template = (v1: number, v2: number): number => {
                        return (2 * b1.mass * v1) / (b1.mass + b2.mass) - (b1.mass - b2.mass) * v2 / (b1.mass + b2.mass)
                    }
                    var b1x = V1Template(b1.getVx, b2.getVx), b1y = V1Template(b1.getVy, b2.getVy)
                    var b2x = V2Template(b1.getVx, b2.getVx), b2y = V2Template(b1.getVy, b2.getVy)
                    // console.log(b1y + " " + b2y)
                    b1.setVelocity((1 - .009) * b1x, (1 - .009) * b1y);
                    b2.setVelocity((1 - .009) * b2x, (1 - .009) * b2y)
                    // let newVelocity = (velocities[i] + velocities[j]) / 2

                    // this.balls[i].setVelocity(newVelocity * -Math.cos(angle), newVelocity * Math.sin(angle))
                    // this.balls[j].setVelocity(newVelocity * -Math.cos(angle + Math.PI), newVelocity * Math.sin(angle + Math.PI))
                    const angle = b1.angleBetween(b2)
                    b1.dx(-Math.cos(angle) * 1).dy(Math.sin(angle) * 1)
                    b2.dx(-Math.cos(angle + Math.PI) * 1).dy(Math.sin(angle + Math.PI) * 1)
                    b1.setForce(-Math.cos(angle), Math.sin(angle))
                    b2.setForce(-Math.cos(angle + Math.PI), Math.sin(angle + Math.PI))
                }
            }
        }
        if (!this.done) {
            window.requestAnimationFrame(this.animate);
        }
    }

    public end(): void {
        this.done = true;
    }
}
export default function BallPit() {
    const ballNum = 220;
    // https://stackoverflow.com/questions/58325771/how-to-generate-random-hex-string-in-javascript
    const genRanHex = (size: number): string => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    let eles: JSX.Element[] = [];
    for (var i = 0; i < ballNum; i++) {
        eles.push(
            <circle className="Ball" cx="50" cy="50" r="50" fill={"#" + genRanHex(6)}>/</circle>
        )
    }
    useEffect(() => {
        let ballEles: HTMLElement[] = []
        document.querySelectorAll("circle").forEach((e) => {
            ballEles.push(e as unknown as HTMLElement)
        })
        const bp = new BallPitObj(ballEles)
        setTimeout(() => bp.startAnimation(), 1000)
    }, [])

    return (
        <>
            <svg style={{ position: "absolute", width: "100%", height: "100%" }} className="BallPit">
                {eles}
            </svg>
        </>
    )
}