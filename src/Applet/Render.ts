/**
 * A thing that can be drawn.
 */
export interface Render {
    z: number;
    render(cx: CanvasRenderingContext2D, dt: number): void;
};

/**
 * A global transform for many onscreen objects.
 */
export class Camera {
    public x = 0;
    public y = 0;
    public zoom = 1;
};

/**
 * A "group" of Renderables that share a common z-order and
 * "camera" transforms.
 */
export class Layer {

    public Camera = new Camera();

    constructor(
        public z: number,
        public parallax = 1,
        public scale = 1
    ) {};

    public enter(cx: CanvasRenderingContext2D) {
        const camera = this.Camera;
        const scale = this.scale * camera.zoom;
        const parallax = this.parallax;

        cx.save();

        cx.scale(scale, scale);
        cx.translate(-camera.x * parallax, -camera.y * parallax);
    };
    public exit(cx: CanvasRenderingContext2D) {
        cx.restore();
    };

    public toRender(drawCode: (cx: CanvasRenderingContext2D, dt: number) => void): Render {
        return {
            z: this.z,
            render: (cx: CanvasRenderingContext2D, dt: number) => {
                this.enter(cx);
                    drawCode(cx, dt);
                this.exit(cx);
            }
        };
    };
};

/**
 * Collect items needing to be drawn, sort them,
 * and render them.
 */
export class DrawSet {
    renderables: Render[] = [];

    queue(...render: Render[]) {
        this.renderables.push(...render);
    };

    draw(cx: CanvasRenderingContext2D, dt = 0) {

        // sort list by layer z index
        this.renderables.sort((a, b) => {
            return a.z - b.z;
        });

        for(const {z, render} of this.renderables) {
            render(cx, dt);
        }

        this.renderables.length = 0;
    }
}
