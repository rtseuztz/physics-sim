//unit test for a ball
import Ball from "./Ball";

//test to see if the ball is created
test("test ball creation", () => {
    const element = document.createElementNS("http://www.w3.org/2000/svg", "circle") as unknown as HTMLElement;
    const radius = 10;
    const ball = new Ball(element, radius);
    expect(ball.radius).toBe(radius);
    expect(ball.element).toBe(element);
    expect(ball.element.getAttribute("r")).toBe(radius.toString());
});

//test to see a ball's attributes after a random amount of time between 0s and 2s
test("test ball attributes after a random amount of time between 0s and .5s", () => {
    const element = document.createElementNS("http://www.w3.org/2000/svg", "circle") as unknown as HTMLElement;
    const radius = 10;
    const ball = new Ball(element, radius);
    const time = Math.random() * 500;
    var x = ball.x, y = ball.y, vx = ball.vx, vy = ball.vy, fx = ball.fx, fy = ball.fy, mass = ball.mass;
    setTimeout(() => {
        ball.stopAnimation();
        //calculate the new values and add them
        x += vx * time;
        y += vy * time;
        vx += (fx / mass) * time;
        vy += (fy / mass) * time;
        expect(ball.x).toBe(x);
        expect(ball.y).toBe(y);
        expect(ball.vx).toBe(vx);
        expect(ball.vy).toBe(vy);
        expect(ball.element.getAttribute("cx")).toBe(x);
        expect(ball.element.getAttribute("cy")).toBe(y);
        expect(ball.element.getAttribute("r")).toBe(mass);
    }, time);
});
