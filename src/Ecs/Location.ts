import { Component, Data, Join } from "Ecs/Data";

export class Location {
    constructor(init?: Partial<Location>) {
        init && Object.assign(this, init);
    };
    X = 0;
    Y = 0;
    Angle = 0;
    VX = 0;
    VY = 0;
    VAngle = 0;
}

export function TransformCx(cx: CanvasRenderingContext2D, location: Location, dt = 0) {
    cx.translate(location.X + location.VX * dt, location.Y + location.VY * dt);
    cx.rotate(location.Angle + location.VAngle * dt);
}

export function DumbMotion(data: Data, interval: number) {
    Join(data, "location").forEach(([id, location]) => {
        location.X += location.VX * interval;
        location.Y += location.VY * interval;
        location.Angle += location.VAngle * interval;
    });
}
