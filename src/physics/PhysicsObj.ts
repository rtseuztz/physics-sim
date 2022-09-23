
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
    protected done: boolean = false;
    constructor(element: HTMLElement, x: number, y: number, vx?: number, vy?: number, ax?: number, ay?: number) {
        this.element = element;
        this.setX(x)
        this.setY(y);

        this.Vx = { i: vx ?? 0, c: vx ?? 0, f: 0 };
        this.Vy = { i: vy ?? 0, c: vy ?? 0, f: 0 };
        this.Ax = { i: ax ?? 0, c: ax ?? 0, f: 0 };
        this.Ay = { i: ay ?? 0, c: ay ?? 0, f: 0 };
        this.height -= element.clientHeight;
        this.width -= element.clientWidth;
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
        this.done = false;
        window.requestAnimationFrame(this.animate)
    }
    protected animate = (timeStamp: number) => {
    }
}