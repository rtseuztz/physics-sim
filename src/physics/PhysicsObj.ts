
type stages = {
    i: number,
    c: number,
    f: number
}
var body = document.body,
    html = document.documentElement;

var height = Math.max(body.scrollHeight, body.offsetHeight,
    html.clientHeight, html.scrollHeight, html.offsetHeight);
var width = Math.max(body.scrollWidth, body.offsetWidth,
    html.clientWidth, html.scrollWidth, html.offsetWidth);
export default class physicsObj {
    element: HTMLElement;
    protected x: number = 0;
    protected y: number = 0;
    protected Vx: stages
    protected Vy: stages;

    protected Ax: stages;
    protected Ay: stages;

    protected start: number | undefined = undefined
    protected previousTimeStamp: number = 0;
    protected done: boolean = false;
    constructor(element: HTMLElement, x: number, y: number, vx?: number, vy?: number, ax?: number, ay?: number) {
        this.element = element;
        this.setX(x)
        this.setY(y);

        this.Vx = { i: vx ?? 0, c: vx ?? 0, f: 0 };
        this.Vy = { i: vy ?? 0, c: vy ?? 0, f: 0 };
        this.Ax = { i: ax ?? 0, c: ax ?? 0, f: 0 };
        this.Ay = { i: ay ?? 0, c: ay ?? 0, f: 0 };
    }
    public setX(x: number) {
        this.x = x;
        this.element.style.left = `${x}px`;
    }
    public setY(y: number) {
        this.y = y;
        this.element.style.top = `${y}px`;
    }
    public startAnimation() {
        window.requestAnimationFrame(this.animate)
    }
    private animate = (timeStamp: number) => {
        console.log(this);
        if (this.start === undefined)
            this.start = timeStamp
        var elapsed = timeStamp - this.start + 1;
        if (this.previousTimeStamp !== timeStamp) {
            var y = (this.Vy.i * elapsed / 1000) + .5 * this.Ay.c * (Math.pow(elapsed / 1000, 2))
            var x = (this.Vx.i * elapsed / 1000) + .5 * this.Ax.c * (Math.pow(elapsed / 1000, 2))
            if (y >= height || y <= 0) {
                this.Vy.i = -this.Vy.f;
                this.Ay.c = -this.Ay.c
                this.start = timeStamp

                //y = height - this.element.clientHeight / 2;
            }
            if (x >= width || x <= 0) {
                this.Vx.i = -this.Vx.f
                this.Ax.c = -this.Ax.c
                this.start = timeStamp
                //y = width - this.element.clientWidth / 2;
            }
            this.Vy.f = this.Vy.i;
            this.Vx.f = this.Vx.i;
            this.setY(y)
            this.setX(x)
        }
        this.previousTimeStamp = timeStamp;
        if (!this.done) {
            console.log("going")
            window.requestAnimationFrame(this.animate);
        }
    }
}