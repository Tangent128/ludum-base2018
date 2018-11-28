import { Data } from "Ecs/Components";
import { Join } from "Ecs/Data";
import { TransformCx } from "Ecs/Location";
import { DrawSet } from "Ecs/Render";

export function RenderBoxes(data: Data, drawSet: DrawSet) {
    drawSet.queue(...Join(data, "location", "renderBox").map(
        ([id, location, {box, color, layer}]) => layer.toRender((cx, dt) => {
            TransformCx(cx, location, dt);
            cx.fillStyle = color;
            cx.fillRect(box.x, box.y, box.w, box.h);
        }))
    );
}
