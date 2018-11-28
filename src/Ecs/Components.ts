
import { Data as CoreData, Store } from "Ecs/Data";
import { Box, Layer } from "Ecs/Render";

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

export class RenderBox  {
    constructor(
        public box: Box,
        public color = "#f00",
        public layer: Layer
    ) {};
};

export class Data extends CoreData {
    location: Store<Location> = [];
    renderBox: Store<RenderBox> = [];
}