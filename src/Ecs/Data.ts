
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
 * Create an entity in the store
 * @param data store
 * @param assign map of components to attach
 * @param state Liveness state, allows creating an inactive entity
 * @returns the new entity's ID and generation
 */
type StripKeys<T, N> = {
    [P in keyof T]: P extends N ? never : P
}[keyof T];
type Assigner<DATA extends Data> = {
    [S in keyof DATA]?: Pick<DATA[S][number], StripKeys<DATA[S][number], "generation">>
};
export function Create<DATA extends Data>(data: DATA, assign: Assigner<DATA>, state = Liveness.ALIVE): Id {
    const entities = data.entity;
    // find free ID
    let freeId = -1;
    let generation = -1;
    for(let id = 0; id < entities.length; id++) {
        if(entities[id].alive == Liveness.DEAD) {
            freeId = id;
            generation = entities[id].generation + 1;
            break;
        }
    }

    if(freeId == -1) {
        freeId = entities.length;
        generation = 1;
    }

    entities[freeId] = {
        generation,
        alive: state
    };

    for(const key in assign) {
        data[key][freeId] = {...(assign[key] as {}), generation};
    }

    return [freeId, generation];
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

// Ergonomic Lookup typings
export function Lookup<
    DATA extends Data,
    A extends keyof DATA,
> (
    data: DATA,
    id: Id,
    a: A,
): [
    DATA[A][number] | null
];
export function Lookup<
    DATA extends Data,
    A extends keyof DATA,
    B extends keyof DATA,
> (
    data: DATA,
    id: Id,
    a: A,
    b: B,
): [
    DATA[A][number] | null,
    DATA[B][number] | null
];
export function Lookup<
    DATA extends Data,
    A extends keyof DATA,
    B extends keyof DATA,
    C extends keyof DATA,
> (
    data: DATA,
    id: Id,
    a: A,
    b: B,
    c: C,
): [
    DATA[A][number] | null,
    DATA[B][number] | null,
    DATA[C][number]
];

/**
 * Look up components that may or may not exist for an entity
 * @param data store
 * @param param1 entity Id
 * @param components names of components to look for
 * @returns the cooresponding components, with unfound ones replaced by nulls
 */
export function Lookup<DATA extends Data, K extends keyof DATA>(data: DATA, [id, generation]: Id, ...components: K[]): (Component | null)[] {
    const entity = data.entity[id];
    // inactive entities are fine to lookup, but dead ones are not
    if(entity && entity.generation == generation && entity.alive != Liveness.DEAD) {
        return components.map(storeName => {
            const component = data[storeName][id];
            if(component && component.generation == generation) {
                return component;
            } else {
                return null;
            }
        });
    } else {
        return components.map(() => null);
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
