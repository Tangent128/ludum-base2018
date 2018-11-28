import { Data, Location } from "Ecs/Components";
import { Join } from "Ecs/Data";

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
