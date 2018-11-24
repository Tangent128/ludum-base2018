
export interface Component {
    generation: number;
}

export enum Liveness {
    DEAD = 0,
    ALIVE = 1,
    INACTIVE = 2
}

export interface EntityState extends Component {
    alive: Liveness;
}

export class Data {
    public entity: EntityState[] = [];
    [name: string]: Component[] | Record<number, Component>;
}

// Ergonomic Join typings
export function Join<
    DATA extends Data,
    A extends keyof DATA,
> (
    data: DATA,
    a: A,
): [
    [number, number],
    DATA[A][number]
][];
export function Join<
    DATA extends Data,
    A extends keyof DATA,
    B extends keyof DATA,
> (
    data: DATA,
    a: A,
    b: B,
): [
    [number, number],
    DATA[A][number],
    DATA[B][number]
][];
export function Join<
    DATA extends Data,
    A extends keyof DATA,
    B extends keyof DATA,
    C extends keyof DATA,
> (
    data: DATA,
    a: A,
    b: B,
    c: C,
): [
    [number, number],
    DATA[A][number],
    DATA[B][number],
    DATA[C][number]
][];
/**
 * Query a Data collection for all Alive entities possessing the named set of Components.
 * @returns an array of tuples containing the matching entity [ID, generation]s & associated Components
 */
export function Join<DATA extends Data, K extends keyof DATA>(data: DATA, ...components: K[]): [[number, number], ...Component[]][] {
    const entities = data.entity;
    const stores = components.map(name => data[name]);

    const results: [[number, number], ...Component[]][] = [];
    entityLoop: for(let id = 0; id < entities.length; id++) {
        const entity = entities[id];
        // only process active entities
        if(entity.alive != Liveness.ALIVE) continue;

        const generation = entity.generation;
        const result: [[number, number], ...Component[]] = [[id, generation]];

        for (const store of stores) {
            const component = store[id];
            if(component && component.generation == generation) {
                result.push(component);
            } else {
                continue entityLoop;
            }
        }

        results.push(result);
    }
    return results;
}
