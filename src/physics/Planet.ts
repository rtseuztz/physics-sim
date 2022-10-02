import PhysicsObj, { PhysicsParams } from "./PhysicsObj";

/**
 * subclass of physics object that is a planet
 * default force is 0 for x and y
 */
export default class Planet extends PhysicsObj {
    //variables
    protected _radius: number = 0;
    protected _mass: number = 0;
    //getters and setters
    public get radius(): number { return this._radius }
    public set radius(radius: number) {
        this._radius = radius;
        this.element.setAttribute("r", "" + radius)
    }
    public get mass(): number { return this._mass }
    public set mass(mass: number) {
        this._mass = mass;
        this.element.setAttribute("r", "" + mass)
    }
    constructor(element: HTMLElement, radius: number, mass: number) {
        const PlanetParams: PhysicsParams = {
            element: element,
            x: document.body.clientWidth * Math.random(),
            y: document.body.clientHeight * Math.random(),
            vx: Math.random() * 20,
            vy: Math.random() * 20,
            fx: Math.random() * 20,
            fy: Math.random() * 20,
            mass: mass
        }
        super(PlanetParams);
        this.radius = radius;
        this.mass = mass;
    }
}