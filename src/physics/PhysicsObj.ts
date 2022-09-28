import { throws } from "assert";
import { timeStamp } from "console";

var body = document.body,
    html = document.documentElement;
export interface PhysicsParams {
    element: HTMLElement, x: number, y: number, vx: number, vy: number, fx: number, fy: number, mass?: number, dampening?: number
}

export default class physicsObj {
    element: HTMLElement;
    static body = document.body;
    static html = document.documentElement;
    readonly height = Math.max(body.scrollHeight, body.offsetHeight,
        html.clientHeight, html.scrollHeight, html.offsetHeight);
    readonly width = Math.max(body.scrollWidth, body.offsetWidth,
        html.clientWidth, html.scrollWidth, html.offsetWidth);
    public static kinematics = {
        velocity: (v0: number, a: number, t: number) => v0 + a * t,
        displacement: (v0: number, a: number, t: number) => v0 * t + .5 * a * t * t,
        time: (v0: number, a: number, s: number) => (v0 + Math.sqrt(v0 * v0 + 2 * a * s)) / a
    }
    protected _x!: number;
    protected _y!: number;
    protected _vx!: number;
    protected _vy!: number;

    protected _fx!: number;
    protected _fy!: number;
    protected _previousTimeStamp: number = 0;
    protected _done: boolean = false;
    protected _isColliding: boolean = false;
    protected _mass!: number;
    readonly defaultForceY: number; //gravity
    readonly defaultForceX: number;
    readonly dampeningMultiplier: number;

    //getters/setters
    public get x(): number {
        return this._x
    }
    public set x(x: number) {
        this._x = x;
        this.element.style.left = `${x}px`;
    }
    public get y(): number { return this._y }
    public set y(y: number) {
        this._y = y;
        this.element.style.top = `${y}px`;
    }
    public get vx(): number { return this._vx }
    public set vx(vx: number) {
        this._vx = vx;
    }
    public get vy(): number { return this._vy }
    public set vy(vy: number) {
        this._vy = vy;
    }
    public get velocity(): number {
        return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    }
    public get ax(): number { return this._fx / this._mass }
    public get ay(): number { return this._fy / this._mass }
    public get mass(): number { return this._mass }
    public set mass(mass: number) {
        this._mass = mass;
    }
    public get fx(): number { return this._fx }
    public set fx(fx: number) {
        this._fx = fx;
    }
    public get fy(): number { return this._fy }
    public set fy(fy: number) {
        this._fy = fy;
    }
    public get colliding(): boolean { return this._isColliding }
    public get done(): boolean { return this._done }
    protected set done(done: boolean) {
        this._done = done;
    }

    constructor({ element, x, y, vx, vy, fx, fy, mass, dampening }: PhysicsParams) {
        this.element = element;
        this.x = x;
        this.y = y;
        this.vx = vx
        this.vy = vy
        this.fx = fx;
        this.fy = fy;
        this.defaultForceY = fy;
        this.defaultForceX = fx;
        this.height -= element.clientHeight;
        this.width -= element.clientWidth;
        this.mass = (mass !== undefined) ? mass : 50;
        this.dampeningMultiplier = (dampening !== undefined) ? (1 - dampening) : .7 //if dampening is .3, then the multiplier is .7
    }


    //utility functions
    public dx = (dx: number): physicsObj => { this.x = (dx + this.x); return this }
    public dy = (dy: number): physicsObj => { this.y = (dy + this.y); return this }
    public setVelocity(vx: number, vy: number): void {
        this.vx = vx;
        this.vy = vy;
    }
    protected resetForce = (): void => {
        this.setForce(this.defaultForceX, this.defaultForceY)
    }
    public setForce = (fx: number, fy: number): void => {
        this.fx = fx + this.defaultForceX;
        this.fy = fy + this.defaultForceY;
    }
    public startAnimation() {
        this._done = false;
        window.requestAnimationFrame(this.animate)
    }
    /**
     * Where each frame is animated
     * Calculation order: Acceleration from force, distance, then velocities
     * @param timeStamp 
     */
    public readonly groupAnimate = (timeStamp: number) => {
        var t = (timeStamp - this._previousTimeStamp) / 1000
        if (this._previousTimeStamp !== timeStamp) {

            if (this._isColliding) {
                this.setForce(0, 0)
                this._isColliding = false;
            } else {
                this.resetForce()
            }
            //Position needs to be checked first, because if the object is out of bounds, it will be corrected
            var dx = physicsObj.kinematics.displacement(this.vx, this.ax, t)
            var dy = physicsObj.kinematics.displacement(this.vy, this.ay, t)
            if (this.crossesBottom(dy)) {
                dy = this.bottomBoundaryHit()
                this.collide()
            } else if (this.crossesTop(dy)) {
                dy = this.topBoundaryHit()
                this.collide()
            }
            this.dy(dy);
            if (this.crossesRight(dx)) {
                dx = this.rightBoundaryHit()
                this.collide()
            } else if (this.crossesLeft(dx)) {
                dx = this.leftBoundaryHit()
                this.collide()
            }
            this.dx(dx)
            this.vx = physicsObj.kinematics.velocity(this.vx, this.ax, t)
            this.vy = physicsObj.kinematics.velocity(this.vy, this.ay, t)
        }
        this._previousTimeStamp = timeStamp;
    }
    protected animate = (timeStamp: number) => {
        this.groupAnimate(timeStamp)
        if (!this._done) {
            window.requestAnimationFrame(this.animate);
        }
    }
    public collide() {
        this._isColliding = true;
    }
    protected crossesBottom = (y: number): boolean => this.y + y >= this.height - 1
    protected bottomBoundaryHit(offset?: number): number {
        this.y = this.height - 1 + (offset || 0)
        this.vy = -this.vy * this.dampeningMultiplier
        return 0;
    }
    protected crossesTop = (y: number): boolean => this.y + y <= 1
    protected topBoundaryHit(offset?: number): number {
        this.y = offset || 0;
        this.vy = -this.vy * this.dampeningMultiplier
        return 0;
    }
    protected crossesLeft = (x: number): boolean => this.x + x <= 1
    protected leftBoundaryHit(offset?: number): number {
        this.x = offset || 0;
        this.vx = -this.vx
        return 0;
    }
    protected crossesRight = (x: number): boolean => this.x + x >= this.width - 1
    protected rightBoundaryHit(offset?: number): number {
        this.x = this.width - 1 + (offset || 0)
        this.vx = -this.vx
        return 0;
    }
    public stopAnimation() {
        this._done = true;
    }

}