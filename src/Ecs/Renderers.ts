import { Data } from "Ecs/Components";
import { Join } from "Ecs/Data";
import { TransformCx } from "Ecs/Location";
import { DrawSet } from "Applet/Render";

export function RunRenderBounds(data: Data, drawSet: DrawSet) {
    drawSet.queue(...Join(data, "renderBounds", "location", "bounds").map(
        ([id, {color, layer}, location, {points}]) => layer.toRender((cx, dt) => {
            TransformCx(cx, location, dt);
            cx.fillStyle = color;
            cx.beginPath();
            for(let i = 0; i < points.length; i += 2) {
                cx.lineTo(points[i], points[i+1]);
            }
            cx.fill("nonzero");
        }))
    );
}
