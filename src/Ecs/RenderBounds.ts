import { Data } from "Ecs/Components";
import { Join } from "Ecs/Data";
import { TransformCx } from "Ecs/Location";
import { DrawSet } from "Applet/Render";

export function RunRenderBounds(data: Data, drawSet: DrawSet) {
    drawSet.queue(...Join(data, "renderBounds", "location", "bounds").map(
        ([id, {color, layer}, location, box]) => layer.toRender((cx, dt) => {
            TransformCx(cx, location, dt);
            cx.fillStyle = color;
            cx.fillRect(box.x, box.y, box.w, box.h);
        }))
    );
}
