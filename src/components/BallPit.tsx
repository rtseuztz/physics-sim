import { useEffect, useRef } from "react";
import { couldStartTrivia } from "typescript";
import physicsObj from "../physics/PhysicsObj";

/**
 * x is the center x, y is the center y.
 */
class Ball extends physicsObj {
    readonly radius: number;
    colliding: boolean = false;
    constructor(element: HTMLElement, radius: number) {
        super(element, Math.random() * 1000, Math.random() * 600, 0, Math.random() * 100, 0, 500.81);
        this.radius = radius;
        element.setAttribute("r", "" + radius)
    }
    protected collide(): void {

    }
    public intersects(ball: Ball) {
        return Math.sqrt(Math.pow(this.x - ball.x, 2) + Math.pow(this.y - ball.y, 2)) < this.radius + ball.radius;// + (this.colliding || ball.colliding ? 0 : 10);
    }
    public angleBetween(ball: Ball) {
        return -180 * Math.atan2(ball.y - this.y, ball.x - this.x) / Math.PI
    }
    // protected animate = (timeStamp: number) => {
    //     window.requestAnimationFrame(super.animate)
    //     //this.colliding = false;
    // }
    // protected animate = (timeStamp: number) => {
    //     var t = (timeStamp - this.previousTimeStamp) / 1000
    //     if (this.previousTimeStamp !== timeStamp) {
    //         var x = 0, y = 0;
    //         if (!this.colliding) {
    //             x = (this.Vx.i * t) + .5 * this.Ax.c * (Math.pow(t, 2))
    //             y = (this.Vy.i * t) + .5 * this.Ay.c * (Math.pow(t, 2))
    //         } else this.colliding = false;
    //         if (this.y + y >= this.height) {
    //             this.y = this.height - 1;
    //             y = 0;
    //             this.Vy.i = -this.Vy.i;
    //             this.collide()
    //         } else if (this.y + y <= 0) {
    //             this.y = 0;
    //             y = 0;
    //             this.Vy.i = -this.Vy.i;
    //             this.collide()
    //         }
    //         this.dy(y);
    //         if (this.x + x >= this.width) {
    //             this.x = this.width - 1;
    //             x = 0
    //             this.Vx.i = -this.Vx.i
    //             this.collide()
    //         } else if (this.x + x <= 0) {
    //             this.x = 0;
    //             x = 0
    //             this.Vx.i = -this.Vx.i
    //             this.collide()
    //         }
    //         this.dx(x)
    //         this.Vx.i += this.Ax.c * t
    //         this.Vy.i += this.Ay.c * t

    //     }
    //     this.previousTimeStamp = timeStamp;
    //     if (!this.done) {
    //         window.requestAnimationFrame(this.animate);
    //     }
    // }
}
class BallPitObj {
    readonly balls: Ball[] = [];
    readonly ballLength: number
    done: boolean = true;
    constructor(eleArr: HTMLElement[]) {
        eleArr.forEach((ele) => {
            this.balls.push(new Ball(ele, 40 * Math.random() + 30))
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
        let velocities: number[] = [];
        for (var i = 0; i < this.ballLength - 1; i++) {
            for (var j = i + 1; j < this.ballLength; j++) {
                if (this.balls[i].intersects(this.balls[j])) {
                    let angle = this.balls[i].angleBetween(this.balls[j]);
                    velocities[i] = velocities[i] || this.balls[i].getVelocity()
                    velocities[j] = velocities[j] || this.balls[j].getVelocity()
                    let newVelocity = (velocities[i] + velocities[j]) / 2
                    this.balls[i].setVelocity(newVelocity * Math.cos(angle), newVelocity * Math.sin(angle))
                    this.balls[j].setVelocity(newVelocity * Math.cos(angle + 180), newVelocity * Math.sin(angle + 180))
                    this.balls[i].dx(Math.cos(angle) * 10).dy(Math.sin(angle) * 10)
                    this.balls[j].dx(Math.cos(angle + 180) * 10).dy(Math.sin(angle + 180) * 10)
                    // this.balls[i].colliding = true;
                    // this.balls[j].colliding = true;
                }
            }
        }
        // for (var k = 0; k < this.ballLength; k++) {
        //     if (!velocities[k])
        //         this.balls[k].colliding = false;
        // }
        if (!this.done) {
            window.requestAnimationFrame(this.animate);
        }
    }

    public end(): void {
        this.done = true;
    }
}
export default function BallPit() {
    const ballNum = 10;
    let eles: JSX.Element[] = [];
    for (var i = 0; i < ballNum; i++) {
        eles.push(
            <circle className="Ball" cx="50" cy="50" r="50">/</circle>
        )
    }
    //const bp = new BallPitObj(eles)

    const ballPitRef = useRef<SVGSVGElement>(null)
    useEffect(() => {
        let ballEles: HTMLElement[] = []
        // if (ballPitRef.current) {
        //     bp.balls.forEach((b) => {
        //         ballPitRef.current!.appendChild(b.element)
        //     })
        // }
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