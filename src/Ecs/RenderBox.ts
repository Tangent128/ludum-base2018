import { Data, Join } from "Ecs/Data";
import {Box, Layer, DrawSet} from "Ecs/Render";
import { TransformCx } from "./Location";

export class RenderBox  {
    constructor(
        public box: Box,
        public color = "#f00",
        public layer: Layer
    ) {};
};

export function RenderBoxes(data: Data, drawSet: DrawSet) {
    drawSet.queue(...Join(data, "location", "renderBox").map(
        ([id, location, {box, color, layer}]) => layer.toRender((cx, dt) => {
            TransformCx(cx, location, dt);
            cx.fillStyle = color;
            cx.fillRect(box.x, box.y, box.w, box.h);
        }))
    );
}
