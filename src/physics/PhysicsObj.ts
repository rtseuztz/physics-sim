
var body = document.body,
    html = document.documentElement;
export interface PhysicsParams {
    element: HTMLElement, x: number, y: number, vx: number, vy: number, fx: number, fy: number, mass?: number
}

export default class physicsObj {
    element: HTMLElement;
    static body = document.body;
    static html = document.documentElement;
    readonly height = Math.max(body.scrollHeight, body.offsetHeight,
        html.clientHeight, html.scrollHeight, html.offsetHeight);
    readonly width = Math.max(body.scrollWidth, body.offsetWidth,
        html.clientWidth, html.scrollWidth, html.offsetWidth);
    protected x: number = 0;
    protected y: number = 0;
    protected Vx: number
    protected Vy: number;

    protected Fx: number;
    protected Fy: number;
    protected previousTimeStamp: number = 0;
    protected isSvg: boolean
    protected done: boolean = false;
    protected isColliding: boolean = false;
    public readonly mass: number;
    readonly defaultForceY: number = 5000;
    readonly defaultForceX: number = 0;
    readonly dampeningMultiplier = .7
    constructor({ element, x, y, vx, vy, fx, fy, mass }: PhysicsParams) {
        this.element = element;
        this.setX(x)
        this.setY(y);
        this.isSvg = element.nodeName === "circle"
        this.Vx = vx
        this.Vy = vy
        this.Fx = fx;
        this.Fy = fy;
        this.height -= element.clientHeight;
        this.width -= element.clientWidth;
        this.mass = mass || 50
    }
    protected setX(x: number) {
        this.x = x;
        this.element.style.left = `${x}px`;
    }
    protected setY(y: number) {
        this.y = y;
        this.element.style.top = `${y}px`;
    }
    public dx = (dx: number): physicsObj => { this.setX(dx + this.x); return this }
    public dy = (dy: number): physicsObj => { this.setY(dy + this.y); return this }
    public setVelocity(vx: number, vy: number): void {
        this.Vx = vx;
        this.Vy = vy;
    }
    protected Ax = (): number => this.Fx / this.mass
    protected Ay = (): number => this.Fy / this.mass
    protected resetForce = (): void => {
        this.setForce(this.defaultForceX, this.defaultForceY)
    }
    public setForce = (fx: number, fy: number): void => {
        this.Fx = fx + this.defaultForceX;
        this.Fy = fy + this.defaultForceY;
    }
    public getVelocity(): number {
        return Math.sqrt(Math.pow(this.Vx, 2) + Math.pow(this.Vy, 2))
    }
    public get getVx(): number { return this.Vx }
    public get getVy(): number { return this.Vy }
    public get colliding(): boolean { return this.isColliding }
    public startAnimation() {
        this.done = false;
        window.requestAnimationFrame(this.animate)
    }
    /**
     * Where each frame is animated
     * Calculation order: Acceleration from force, distance, then velocities
     * @param timeStamp 
     */
    protected animate = (timeStamp: number) => {
        var t = (timeStamp - this.previousTimeStamp) / 1000
        if (this.previousTimeStamp !== timeStamp) {

            if (this.isColliding) {
                this.setForce(0, 0)
                this.isColliding = false;
            } else {
                this.resetForce()
            }
            var x = (this.Vx * t) + .5 * this.Ax() * (Math.pow(t, 2))
            var y = (this.Vy * t) + .5 * this.Ay() * (Math.pow(t, 2))
            if (this.crossesBottom(y)) {
                y = this.bottomBoundaryHit()
                this.collide()
            } else if (this.crossesTop(y)) {
                y = this.topBoundaryHit()
                this.collide()
            }
            this.dy(y);
            if (this.crossesRight(x)) {
                x = this.rightBoundaryHit()
                this.collide()
            } else if (this.crossesLeft(x)) {
                x = this.leftBoundaryHit()
                this.collide()
            }
            this.dx(x)
            this.Vx += this.Ax() * t
            this.Vy += this.Ay() * t
        }
        this.previousTimeStamp = timeStamp;
        if (!this.done) {
            window.requestAnimationFrame(this.animate);
        }
    }
    public collide() {
        this.isColliding = true;
    }
    protected crossesBottom = (y: number): boolean => this.y + y >= this.height - 1
    protected bottomBoundaryHit(offset?: number): number {
        this.y = this.height - 1 + (offset || 0)
        this.Vy = -this.Vy * this.dampeningMultiplier
        return 0;
    }
    protected crossesTop = (y: number): boolean => this.y + y <= 1
    protected topBoundaryHit(offset?: number): number {
        this.y = offset || 0;
        this.Vy = -this.Vy * this.dampeningMultiplier
        return 0;
    }
    protected crossesLeft = (x: number): boolean => this.x + x <= 1
    protected leftBoundaryHit(offset?: number): number {
        this.x = offset || 0;
        this.Vx = -this.Vx
        return 0;
    }
    protected crossesRight = (x: number): boolean => this.x + x >= this.width - 1
    protected rightBoundaryHit(offset?: number): number {
        this.x = this.width - 1 + (offset || 0)
        this.Vx = -this.Vx
        return 0;
    }

}