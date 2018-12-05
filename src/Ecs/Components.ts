
import { Data as CoreData, Store } from "Ecs/Data";
import { Layer, SpriteSheet } from "Applet/Render";

export class Box {
    constructor(
        public x: number, public y: number,
        public w: number, public h: number
    ) {};
};

/**
 * Return source moved towards target by speed, without going past.
 */
export function Approach(source: number, target: number, speed: number): number {
    const delta = target - source;
    if(Math.abs(delta) <= speed) {
        return target;
    } else {
        return source + Math.sign(delta) * speed;
    }
}

/**
 * pairs of vertex coordinates in ccw winding order
 */
export class Polygon {
    constructor(
        public points: number[]
    ) {};
}

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

export class CollisionClass {
    constructor(
        public name: string
    ) {};
}

export class RenderBounds  {
    constructor(
        public color = "#f00",
        public layer: Layer
    ) {};
};

export class RenderSprite  {
    constructor(
        public sheet: SpriteSheet,
        public layer: Layer,
        public index = 0,
        public offsetX = 0,
        public offsetY = 0
    ) {};
};

export class Data extends CoreData {
    location: Store<Location> = [];
    bounds: Store<Polygon> = [];
    renderBounds: Store<RenderBounds> = {};
    renderSprite: Store<RenderSprite> = {};
    collisionSourceClass: Store<CollisionClass> = {};
    collisionTargetClass: Store<CollisionClass> = {};
}
