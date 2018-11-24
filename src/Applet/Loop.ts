
/**
 * Toplevel game/animation loop
 */
export class Loop {

    private physicsTimeout?: number;
    private renderTimeout?: number;

    private lastPhysicsTick: number = (new Date()).getTime();

    constructor(
        private fps: number,
        private physicsCallback: (interval: number) => void,
        private renderCallback: (dt: number) => void,
    ) {
    };

    public start() {
        if(this.physicsTimeout == null) {
            this.physicsTimeout = window.setTimeout(() => {
                this.physicsTimeout = undefined;
                this.physicsTick(1 / this.fps);
            }, 1000 / this.fps);
        }
        if(this.renderTimeout == null) {
            this.renderTimeout = window.requestAnimationFrame(() => {
                this.renderTimeout = undefined;
                this.renderTick();
            });
        }
    };

    public stop() {
        if(this.physicsTimeout != null) {
            window.clearTimeout(this.physicsTimeout);
            this.physicsTimeout = undefined;
        }
        if(this.renderTimeout != null) {
            window.cancelAnimationFrame(this.renderTimeout);
            this.renderTimeout = undefined;
        }
    };

    private physicsTick(interval: number) {
        const now = (new Date()).getTime();
        this.lastPhysicsTick = now;

        this.physicsCallback(interval);

        // schedule next tick
        this.start();
    };
    private renderTick() {
        const now = (new Date()).getTime();

        this.renderCallback((now - this.lastPhysicsTick) / 1000);

        // schedule next tick
        this.start();
    };

};
