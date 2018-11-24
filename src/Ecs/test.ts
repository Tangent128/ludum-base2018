import { Bind } from "Applet";
import { Component, Data, Join, Liveness, Remove, Create, Lookup } from "Ecs/Data";

interface Apple extends Component {}
interface Banana extends Component {
    peeled: boolean
}
interface Carrot extends Component {
    cronch: number
}

class TestData extends Data {
    entity = [
        {generation: 5, alive: Liveness.ALIVE},
        {generation: 5, alive: Liveness.DEAD},
        {generation: 5, alive: Liveness.ALIVE},
        {generation: 5, alive: Liveness.ALIVE},
        {generation: 5, alive: Liveness.INACTIVE},
        {generation: 5, alive: Liveness.ALIVE},
    ];
    apple: Apple[] = [
        {generation: 5},
        {generation: 5},
        {generation: -1},
        {generation: -1},
        {generation: 5},
        {generation: 5},
    ];
    banana: Record<number, Banana> = {
        3: {generation: 5, peeled: false},
        4: {generation: 5, peeled: true},
    };
    carrot: Record<number, Carrot> = {
        0: {generation: 5, cronch: 1},
        1: {generation: 5, cronch: 1},
        2: {generation: 4, cronch: 10},
        3: {generation: 5, cronch: 1},
    };
}

@Bind("#EcsJoinTest")
export class EcsJoinTest {
    constructor(pre: HTMLElement) {
        const data = new TestData();
        pre.innerText = JSON.stringify({
            "apples": Join(data, "apple"),
            "bananas": Join(data, "banana"),
            "carrots": Join(data, "carrot"),
            "apples+carrots": Join(data, "apple", "carrot"),
        }, null, 2);
    }
}

@Bind("#EcsLookupTest")
export class EcsLookupTest {
    constructor(pre: HTMLElement) {
        const data = new TestData();
        const applesMaybeCarrots = Join(data, "apple").map(([id, apple]) => ({
            apple,
            maybeCarrot: Lookup(data, id, "carrot")[0]
        }));
        pre.innerText = JSON.stringify(applesMaybeCarrots, null, 2);
    }
}

@Bind("#EcsRemoveTest")
export class EcsRemoveTest {
    constructor(pre: HTMLElement) {
        const data = new TestData();
        const beforeDelete = Join(data, "apple", "carrot");
        Remove(data, [0, 5]);
        const afterDelete = Join(data, "apple", "carrot");
        pre.innerText = JSON.stringify({
            beforeDelete,
            afterDelete
        }, null, 2);
    }
}

@Bind("#EcsCreateTest")
export class EcsCreateTest {
    constructor(pre: HTMLElement) {
        const data = new TestData();
        const beforeCreate = Join(data, "apple", "banana", "carrot");
        const createdId = Create(data, {
            apple: {},
            banana: {peeled: false},
            carrot: {cronch: 11}
        });
        const afterCreate = Join(data, "apple", "banana", "carrot");
        pre.innerText = JSON.stringify({
            beforeCreate,
            afterCreate,
            createdId
        }, null, 2);
    }
}
