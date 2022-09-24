
type stages = {
    i: number,
    c: number,
    f: number
}
var body = document.body,
    html = document.documentElement;


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
    protected Vx: stages
    protected Vy: stages;

    protected Ax: stages;
    protected Ay: stages;

    protected previousTimeStamp: number = 0;
    protected isSvg: boolean
    protected done: boolean = false;
    constructor(element: HTMLElement, x: number, y: number, vx?: number, vy?: number, ax?: number, ay?: number) {
        this.element = element;
        this.setX(x)
        this.setY(y);
        this.isSvg = element.nodeName === "circle"
        this.Vx = { i: vx ?? 0, c: vx ?? 0, f: 0 };
        this.Vy = { i: vy ?? 0, c: vy ?? 0, f: 0 };
        this.Ax = { i: ax ?? 0, c: ax ?? 0, f: 0 };
        this.Ay = { i: ay ?? 0, c: ay ?? 0, f: 0 };
        this.height -= element.clientHeight;
        this.width -= element.clientWidth;
    }
    protected setX(x: number) {
        this.x = x;
        this.isSvg
            ? this.element.setAttribute("cx", "" + x)
            : this.element.style.left = `${x}px`;
    }
    protected setY(y: number) {
        this.y = y;
        this.isSvg
            ? this.element.setAttribute("cy", "" + y)
            : this.element.style.top = `${y}px`;
    }
    public dx = (dx: number): physicsObj => { this.setX(dx + this.x); return this }
    public dy = (dy: number): physicsObj => { this.setY(dy + this.y); return this }
    public setVelocity(vx: number, vy: number): void {
        this.Vx.i = vx;
        this.Vy.i = vy;
    }
    public getVelocity(): number {
        return Math.sqrt(Math.pow(this.Vx.i, 2) + Math.pow(this.Vy.i, 2))
    }
    public startAnimation() {
        this.done = false;
        window.requestAnimationFrame(this.animate)
    }
    protected animate = (timeStamp: number) => {
        var t = (timeStamp - this.previousTimeStamp) / 1000
        if (this.previousTimeStamp !== timeStamp) {
            var x = (this.Vx.i * t) + .5 * this.Ax.c * (Math.pow(t, 2))
            var y = (this.Vy.i * t) + .5 * this.Ay.c * (Math.pow(t, 2))
            if (this.y + y >= this.height) {
                this.y = this.height - 1;
                y = 0;
                //this.Vy.i = -this.Vy.i;
                this.collide()
            } else if (this.y + y <= 0) {
                this.y = 0;
                y = 0;
                this.Vy.i = -this.Vy.i;
                this.collide()
            }
            this.dy(y);
            if (this.x + x >= this.width) {
                this.x = this.width - 1;
                x = 0
                this.Vx.i = -this.Vx.i
                this.collide()
            } else if (this.x + x <= 0) {
                this.x = 0;
                x = 0
                this.Vx.i = -this.Vx.i
                this.collide()
            }
            this.dx(x)
            this.Vx.i += this.Ax.c * t
            this.Vy.i += this.Ay.c * t

        }
        this.previousTimeStamp = timeStamp;
        if (!this.done) {
            window.requestAnimationFrame(this.animate);
        }
    }
    protected collide() {

    }
}