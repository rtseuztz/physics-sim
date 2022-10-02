import physicsObj, { PhysicsParams } from "./PhysicsObj";

/**
 * x is the center x, y is the center y.
 */
export default class Ball extends physicsObj {
    radius: number = 0;

    constructor(element: HTMLElement, radius: number) {
        const BallParams: PhysicsParams = {
            element: element,
            x: document.body.clientWidth * Math.random(),
            y: document.body.clientHeight * Math.random(),
            vx: - 400 + Math.random() * 800,
            vy: - 400 + Math.random() * 800,
            fx: 0,
            fy: 10 * radius,
            mass: radius
        }
        super(BallParams);
        this.radius = radius;
        element.setAttribute("r", "" + radius)
    }
    public get x(): number { return this._x }
    public set x(x: number) {
        if (Number.isNaN(x)) {
            return;
        }
        this._x = x;
        this.element.setAttribute("cx", x + "")
    }
    public get y(): number { return this._y }
    public set y(y: number) {
        if (Number.isNaN(y)) {
            return;
        }
        this._y = y;
        this.element.setAttribute("cy", y + "")
    }
    public dx = (dx: number): physicsObj => { this.x = (dx + this.x); return this }
    public dy = (dy: number): physicsObj => { this.y = (dy + this.y); return this }
    public get mass(): number { return this._mass }
    public set mass(mass: number) {
        this._mass = mass;
        this.radius = mass;
        this.element.setAttribute("r", "" + mass)
    }
    public get diameter() { return this.radius * 2 }

    //utility functions
    public move(x: number, y: number) {
        this.x = x
        this.y = y
    }
    public intersects(ball: Ball): number {
        return Math.sqrt(Math.pow(this.x - ball.x, 2) + Math.pow(this.y - ball.y, 2)) - (this.radius + ball.radius);
    }
    public angleBetween(ball: Ball) {
        return -Math.atan2(ball.y - this.y, ball.x - this.x)
    }
    protected crossesTop = (y: number): boolean => {
        return this.y + y - this.radius <= 1
    }
    protected topBoundaryHit(offset?: number | undefined): number {
        return super.topBoundaryHit(this.radius + 1)
    }
    protected crossesLeft = (x: number): boolean => {
        return this.x + x - this.radius <= 1
    }
    protected leftBoundaryHit(offset?: number): number {
        return super.leftBoundaryHit(this.radius)
    }
    protected crossesRight = (x: number): boolean => this.x + x + this.radius >= this.width - 1
    protected rightBoundaryHit(offset?: number | undefined): number {
        return super.rightBoundaryHit(-this.radius)
    }
    protected crossesBottom = (y: number): boolean => this.y + y + this.radius >= this.height - 1
    protected bottomBoundaryHit(offset?: number | undefined): number {
        return super.bottomBoundaryHit(-this.radius)
    }

}