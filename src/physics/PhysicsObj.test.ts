//unit test for a physics object
import PhysicsObj from "./PhysicsObj";
import { PhysicsParams } from "./PhysicsObj";

//test an object with no mass
const element = document.createElementNS("http://www.w3.org/2000/svg", "circle") as unknown as HTMLElement
test("test physics object with no mass", () => {
    var physicsParams: PhysicsParams = {
        element: document.createElementNS("http://www.w3.org/2000/svg", "circle") as unknown as HTMLElement,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        fx: 0,
        fy: 0,
        mass: 0
    }
    const physicsObj = new PhysicsObj(physicsParams);
    expect(physicsObj.mass).toBe(0);
    expect(physicsObj.x).toBe(0);
    expect(physicsObj.y).toBe(0);
    expect(physicsObj.vx).toBe(0);
    expect(physicsObj.vy).toBe(0);
    expect(physicsObj.fx).toBe(0);
    expect(physicsObj.fy).toBe(0);
    expect(physicsObj.width).toBe(0);
    expect(physicsObj.height).toBe(0);
    expect(physicsObj.colliding).toBe(false);
    expect(physicsObj.element).toBe(physicsParams.element);
    expect(physicsObj.element.style.left).toBe("0px");
    expect(physicsObj.element.style.top).toBe("0px");

    //test the start animation, and after a certain 1000ms, the animation should be stopped
    physicsObj.startAnimation();
    setTimeout(() => {
        //see if the attributes are updated after 1000ms
        physicsObj.stopAnimation();
        expect(physicsObj.element.getAttribute("cx")).toBe("0");
        expect(physicsObj.element.getAttribute("cy")).toBe("0");
        expect(physicsObj.element.getAttribute("r")).toBe("0");

    }, 1000);

});

//test a physics object with mass, position, velocity, and force
test("test physics object with mass, position, velocity, and force", () => {
    var x = 10, y = 10, vx = 10, vy = 10, fx = 10, fy = 10, mass = 10;
    const physicsParams: PhysicsParams = {
        element: document.createElementNS("http://www.w3.org/2000/svg", "circle") as unknown as HTMLElement,
        x: x,
        y: y,
        vx: vx,
        vy: vy,
        fx: fx,
        fy: fy,
        mass: mass
    }
    const physicsObj = new PhysicsObj(physicsParams);
    expect(physicsObj.mass).toBe(mass);
    expect(physicsObj.x).toBe(x);
    expect(physicsObj.y).toBe(y);
    expect(physicsObj.vx).toBe(vx);
    expect(physicsObj.vy).toBe(vy);
    expect(physicsObj.fx).toBe(fx);
    expect(physicsObj.fy).toBe(fy);

    const t = Math.random() * 3
    //test the start animation, and after a certain 1000ms, the animation should be stopped
    physicsObj.startAnimation();
    setTimeout(() => {
        //see if the attributes are updated after 1000ms
        physicsObj.stopAnimation();
        //calculate position, velocity, and force after 1000ms using the kinematics formula in physicsObj
        x += vx * t;
        y += vy * t;
        vx += (fx / mass) * t;
        vy += (fy / mass) * t;
        expect(physicsObj.x).toBe(x);
        expect(physicsObj.y).toBe(y);
        expect(physicsObj.vx).toBe(vx);
        expect(physicsObj.vy).toBe(vy);
        expect(physicsObj.element.getAttribute("cx")).toBe(x);
        expect(physicsObj.element.getAttribute("cy")).toBe(y);
        expect(physicsObj.element.getAttribute("r")).toBe(mass);

    }, t * 1000);

});