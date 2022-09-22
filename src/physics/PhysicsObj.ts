
type stages = {
    i: number,
    c: number,
    f: number
}
var body = document.body,
    html = document.documentElement;


export default class physicsObj {
    element: SVGElement;
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

    protected start: number | undefined = undefined
    protected previousTimeStamp: number = 0;
    protected done: boolean = false;
    constructor(element: SVGElement, x: number, y: number, vx?: number, vy?: number, ax?: number, ay?: number) {
        this.element = element;
        this.setX(x)
        this.setY(y);

        this.Vx = { i: vx ?? 0, c: vx ?? 0, f: 0 };
        this.Vy = { i: vy ?? 0, c: vy ?? 0, f: 0 };
        this.Ax = { i: ax ?? 0, c: ax ?? 0, f: 0 };
        this.Ay = { i: ay ?? 0, c: ay ?? 0, f: 0 };
        this.height -= element.clientHeight;
        this.width -= element.clientHeight
    }
    protected setX(x: number) {
        this.x = x;
        this.element.style.left = `${x}px`;
    }
    protected setY(y: number) {
        this.y = y;
        this.element.style.top = `${y}px`;
    }
    protected dx = (dx: number) => this.setX(dx + this.x)
    protected dy = (dy: number) => this.setY(dy + this.y)
    public startAnimation() {
        window.requestAnimationFrame(this.animate)
    }
    protected animate = (timeStamp: number) => {
        var t = (timeStamp - this.previousTimeStamp) / 1000
        if (this.previousTimeStamp !== timeStamp) {
            var x = (this.Vx.i * t) + .5 * this.Ax.c * (Math.pow(t, 2))
            var y = (this.Vy.i * t) + .5 * this.Ay.c * (Math.pow(t, 2))
            if (this.y + y >= this.height) {
                this.y = this.height;
                y = 0;
                this.Vy.i = -this.Vy.i;
                this.Ay.c = -this.Ay.c
                //y = height - this.element.clientHeight / 2;
            } else if (this.y + y <= 0) {
                this.y = 0;
                y = 0;
                this.Vy.i = -this.Vy.i;
                this.Ay.c = -this.Ay.c
            }
            this.dy(y);
            if (this.x + x >= this.width) {
                this.x = this.width;
                x = 0
                this.Vx.i = -this.Vx.i
                this.Ax.c = -this.Ax.c
                //y = width - this.element.clientWidth / 2;
            } else if (this.x + x <= 0) {
                this.x = 0;
                x = 0
                this.Vx.i = -this.Vx.i
                this.Ax.c = -this.Ax.c
            }
            this.dx(x)
            //for next time
            this.Vx.i = this.Vx.i + this.Ax.c * t
            this.Vy.i = this.Vy.i + this.Ay.c * t
            this.start = timeStamp
        }
        this.previousTimeStamp = timeStamp;
        if (!this.done) {
            window.requestAnimationFrame(this.animate);
        }
    }
}