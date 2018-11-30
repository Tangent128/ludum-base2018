import { Data, Location, Polygon } from "Ecs/Components";
import { Join } from "Ecs/Data";

export function TransformCx(cx: CanvasRenderingContext2D, location: Location, dt = 0) {
    cx.translate(location.X + location.VX * dt, location.Y + location.VY * dt);
    cx.rotate(location.Angle + location.VAngle * dt);
}

export function TfPolygon({points}: Polygon, {X, Y, Angle}: Location): Polygon {
    const sin = Math.sin(Angle);
    const cos = Math.cos(Angle);
    const result = new Polygon(new Array(points.length));
    for(let i = 0; i < points.length; i += 2) {
        const x = points[i];
        const y = points[i+1];
        result.points[i] = x*cos - y*sin + X;
        result.points[i+1] = x*sin + y*cos + Y;
    }
    return result;
}

export function DumbMotion(data: Data, interval: number) {
    Join(data, "location").forEach(([id, location]) => {
        location.X += location.VX * interval;
        location.Y += location.VY * interval;
        location.Angle += location.VAngle * interval;
    });
}
