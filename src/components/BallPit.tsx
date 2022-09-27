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
        this.balls[0].setMass(1)
        this.balls[0].setVelocity(5000, 5000)
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

    // https://stackoverflow.com/questions/58325771/how-to-generate-random-hex-string-in-javascript
    //generate random colors
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
    //generate a circle element
    const genCircle = (): JSX.Element => {
        return <circle className="Ball" cx="50" cy="50" r="50" fill={"#" + genRanHex(6)} />
    }
    //connect a ball to the mouse with usestate

    eles.push(genCircle())
    for (var i = 0; i < ballNum; i++) {
        eles.push(
            genCircle()
        )
    }

    //event handler for cursor to keep track of mouse. use effect
    // const [mouseX, setMouseX] = useState<number>(0);
    // const [mouseY, setMouseY] = useState<number>(0);
    // useEffect(() => {
    //     const handleMouseMove = (e: MouseEvent) => {
    //         setMouseX(e.clientX)
    //         setMouseY(e.clientY)
    //     }
    //     window.addEventListener("mousemove", handleMouseMove)
    //     return () => {
    //         window.removeEventListener("mousemove", handleMouseMove)
    //     }
    // }, [])

    // when the mouse moves, update the force of the balls
    // useEffect(() => {
    //     // if (ballPitObj.current) {
    //     //     ballPitObj.current.updateForce(mouseX, mouseY)
    //     // }
    // }, [mouseX, mouseY])
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
