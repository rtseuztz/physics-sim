import { useEffect, useMemo, useRef, useState } from "react";
import Ball from '../physics/Ball'

class BallPitObj {
    readonly balls: Ball[] = [];
    public ballLength: number
    done: boolean = true;
    constructor(eleArr: HTMLElement[]) {
        eleArr.forEach((ele) => {

            this.balls.push(new Ball(ele, 30 * Math.random() + 5))
        })
        //set the first ball's mass (cursor) to 1 using the setmass function
        this.balls[0].mass = 1
        this.balls[0].setVelocity(0, -100)
        this.balls[0].element.style.visibility = "none"
        this.ballLength = eleArr.length;
        //track mouse position
        window.addEventListener('mousemove', (e) => {
            this.balls[0].move(e.clientX, e.clientY)
        })
    }
    public startAnimation() {

        if (this.ballLength > 1 && this.done) {
            this.done = false;
            window.requestAnimationFrame(this.animate)
        }
    }
    protected animate = (timeStamp: number) => {
        let first = true;
        this.balls.forEach((ball) => {
            if (first) {
                first = false;
                this.balls[0].setVelocity(5000, 5000)
            } else
                ball.groupAnimate(timeStamp)
        })
        const ballsDx: number[] = [];
        const ballsDy: number[] = [];
        for (var i = 0; i < this.ballLength - 1; i++) {
            for (var j = i + 1; j < this.ballLength; j++) {
                var overlap = this.balls[i].intersects(this.balls[j])
                if (overlap < 0) {
                    overlap = Math.abs(overlap);
                    /**
                     * Using momentum equation with elastic collision: 
                     * V1f = (m1-m2)v1/(m1+m2) + (2*m2*v2)/(m1+m2)
                     * V2f = (2*m1*v1)/(m1+m2) - (m1-m2)v2/(m1+m2)
                     */
                    const b1 = this.balls[i], b2 = this.balls[j]
                    if (i === 0) {
                        //j hits cursor
                        b2.setVelocity(1.1 * b2.vx, 1.1 * b2.vy)
                        continue;
                    }
                    if (Math.abs(b1.vx) < .1 && Math.abs(b1.vy) < .1 &&
                        Math.abs(b2.vy) < .1 && Math.abs(b2.vy) < .1) {
                        continue
                    }
                    const V1Template = (v1: number, v2: number): number => {
                        return (b1.mass - b2.mass) * v1 / (b1.mass + b2.mass) + (2 * b2.mass * v2) / (b1.mass + b2.mass);
                    }
                    const V2Template = (v1: number, v2: number): number => {
                        return (2 * b1.mass * v1) / (b1.mass + b2.mass) - (b1.mass - b2.mass) * v2 / (b1.mass + b2.mass)
                    }
                    const b1x = V1Template(b1.vx, b2.vx), b1y = V1Template(b1.vy, b2.vy)
                    const b2x = V2Template(b1.vx, b2.vx), b2y = V2Template(b1.vy, b2.vy)
                    const b1overlap = (b1.radius / (b1.radius + b2.radius)) * overlap
                    const b2overlap = overlap - b1overlap;
                    // .009 is due to multiple collisions, should only collide once though
                    // when fixed, this can be the dampening factor 
                    b1.setVelocity((1 - .009) * b1x, (1 - .009) * b1y);
                    b2.setVelocity((1 - .009) * b2x, (1 - .009) * b2y)
                    const angle = b1.angleBetween(b2)
                    // ballsDx[i] += -Math.cos(angle) * b1overlap
                    // ballsDx[j] += Math.cos(angle) * b2overlap
                    // ballsDy[i] += Math.sin(angle) * b1overlap
                    // ballsDy[j] += -Math.sin(angle) * b2overlap

                    b1.dx(-Math.cos(angle)).dy(Math.sin(angle))
                    b2.dx(Math.cos(angle)).dy(-Math.sin(angle))
                    //b1.setForce(-Math.cos(angle), Math.sin(angle))
                    //b2.setForce(-Math.cos(angle + Math.PI), Math.sin(angle + Math.PI))
                    //b1.collide()
                    //b2.collide()
                }
            }
        }
        // for (var i = 0; i < this.ballLength; i++) {
        //     this.balls[i].dx(ballsDx[i] ?? 0).dy(ballsDy[i] ?? 0)
        // }
        if (!this.done) {
            window.requestAnimationFrame(this.animate);
        }
    }
    public addBall(ele: JSX.Element): void {
        this.balls.push(new Ball(ele as unknown as HTMLElement, 30 * Math.random() + 5))
        this.ballLength++;
    }
    //remove a random ball and the element
    public removeBall(): void {
        if (this.ballLength > 1) {
            const ball = this.balls.pop()
            ball?.element.remove()
            this.ballLength--;
        }
    }
    /**
     * Stops the animation
     */
    public end(): void {
        this.done = true;
    }
}

export default function BallPit(this: any) {
    //ball num as state
    const [ballNum, setBallNum] = useState(5);

    const ballPitRef = useRef<SVGSVGElement>(null);
    const ballPitObj = useRef<BallPitObj | null>(null);
    //make eles array of jsx.element a use memo
    const eles = useMemo<JSX.Element[]>(() => [], [])
    useEffect(() => {
        if (ballPitRef.current) {
            const ballPit = ballPitRef.current;
            const ballEles = [...ballPit.children].map((ele) => ele as HTMLElement);
            ballPitObj.current = new BallPitObj(ballEles);
            ballPitObj.current.startAnimation();

        }
        return () => {
            if (ballPitObj.current) {
                ballPitObj.current.end();
            }
        }
    }, [eles])
    //function to end the previous ballpit and start a new one
    const startNewBallPit = () => {
        if (ballPitObj.current) {
            ballPitObj.current.end();
        }
        const ballPit = ballPitRef.current;
        if (!ballPit) {
            return;
        }
        const ballEles = [...ballPit.children].map((ele) => ele as HTMLElement);
        ballPitObj.current = new BallPitObj(ballEles);
        ballPitObj.current.startAnimation();
    }
    const genRanHex = (size: number): string => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    const genCircle = (): JSX.Element => {
        return <circle className="Ball" cx="50" cy="50" r="50" fill={"#" + genRanHex(6)} />
    }
    eles.push(genCircle())
    for (var i = 0; i < ballNum; i++) {
        eles.push(
            genCircle()
        )
    }
    return (
        <>
            <svg ref={ballPitRef} style={{ position: "absolute", width: "100%", height: "100%" }} className="BallPit">
                {eles}
            </svg>
            <input type="range" min="2" max="200" value={ballNum} onChange={(e) => {
                setBallNum(parseInt(e.target.value))
                if (ballPitObj.current) {
                    if (ballPitObj.current.ballLength < ballNum) {
                        for (var i = ballPitObj.current.ballLength; i < ballNum; i++) {
                            const ball = genCircle()
                            eles.push(ball)
                        }
                    } else if (ballPitObj.current.ballLength > ballNum) {
                        for (var i = ballPitObj.current.ballLength; i > ballNum; i--) {
                            eles.pop();
                        }
                    }
                    startNewBallPit()
                }
            }} />
        </>
    )
}
