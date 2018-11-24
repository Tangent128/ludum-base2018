
export interface Component {
    generation: number;
}

export type Id = [number, number];

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

/**
 * "Delete" an entity
 * @param data store
 * @param id entity ID
 * @param generation entity ID generation
 * @param state can be set to Liveness.INACTIVE to disable an entity without actually killing it, for later resurrection
 */
export function Remove<DATA extends Data>(data: DATA, [id, generation]: Id, state = Liveness.DEAD) {
    if(data.entity[id] && data.entity[id].generation == generation) {
        data.entity[id].alive = state;
    }
}

// Ergonomic Join typings
export function Join<
    DATA extends Data,
    A extends keyof DATA,
> (
    data: DATA,
    a: A,
): [
    Id,
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
    Id,
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
    Id,
    DATA[A][number],
    DATA[B][number],
    DATA[C][number]
][];
/**
 * Query a Data collection for all Alive entities possessing the named set of Components.
 * @returns an array of tuples containing the matching entity [ID, generation]s & associated Components
 */
export function Join<DATA extends Data, K extends keyof DATA>(data: DATA, ...components: K[]): [Id, ...Component[]][] {
    const entities = data.entity;
    const stores = components.map(name => data[name]);

    const results: [Id, ...Component[]][] = [];
    entityLoop: for(let id = 0; id < entities.length; id++) {
        const entity = entities[id];
        // only process active entities
        if(entity.alive != Liveness.ALIVE) continue;

        const generation = entity.generation;
        const result: [Id, ...Component[]] = [[id, generation]];

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
