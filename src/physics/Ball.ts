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
            fy: 100 * radius,
            mass: radius
        }
        super(BallParams);
        // super(element, 500, y, 0, 10, 0, 90);
        this.radius = radius;
        element.setAttribute("r", "" + radius)
    }
    protected setX(x: number) {
        this.x = x
        this.element.setAttribute("cx", Math.round(x) + "")
    }
    public setMass(mass: number): void {
        this.mass = mass;
        this.radius = mass;
        this.element.setAttribute("r", "" + mass)
    }
    get diameter() { return this.radius * 2 }
    protected setY(y: number) {
        this.y = y
        this.element.setAttribute("cy", Math.round(y) + "")
    }
    public move(x: number, y: number) {
        this.setX(x)
        this.setY(y)
    }
    public intersects(ball: Ball) {
        return Math.sqrt(Math.pow(this.x - ball.x, 2) + Math.pow(this.y - ball.y, 2)) < this.radius + ball.radius;// + (this.colliding || ball.colliding ? 0 : 10);
    }
    public angleBetween(ball: Ball) {
        return -Math.atan2(ball.y - this.y, ball.x - this.x)
    }
    protected crossesTop = (y: number): boolean => {
        return this.y + y - this.radius <= 1
    }
    protected topBoundaryHit(offset?: number | undefined): number {
        return super.topBoundaryHit(this.radius)
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