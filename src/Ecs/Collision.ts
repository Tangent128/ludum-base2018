import { Data, Location, Polygon, CollisionClass } from "Ecs/Components";
import { Id, Join } from "Ecs/Data";
import { TfPolygon } from "Ecs/Location";

export interface Collision {
    className: string;
    sourceId: Id;
    targetId: Id;
}

interface Candidate {
    id: Id;
    class: CollisionClass;
    poly: Polygon;
};

function hash(minX: number, minY: number, maxX: number, maxY: number, cellSize: number): string[] {
    let minXCell = Math.floor(minX/cellSize);
    let minYCell = Math.floor(minY/cellSize);
    let maxXCell = Math.floor(maxX/cellSize);
    let maxYCell = Math.floor(maxY/cellSize);
    const results = [];
    for(let xCell = minXCell; xCell <= maxXCell; xCell++) {
        for(let yCell = minYCell; yCell <= maxYCell; yCell++) {
            results.push(`${xCell},${yCell}`);
        }
    }
    return results;
}

function hashPolygon({points}: Polygon, cellSize: number): string[] {
    let minX = 1/0;
    let minY = 1/0;
    let maxX = -1/0;
    let maxY = -1/0;
    for(let i = 0; i < points.length; i += 2) {
        minX = Math.min(minX, points[i]);
        minY = Math.min(minY, points[i+1]);
        maxX = Math.max(maxX, points[i]);
        maxY = Math.max(maxY, points[i+1]);
    }
    return hash(minX, minY, maxX, maxY, cellSize);
}

function projectPolygonToAxis(axisX: number, axisY: number, points: number[]): [number, number] {
    let min = 1/0;
    let max = -1/0;
    for(let i = 0; i < points.length; i += 2) {
        // dot product doesn't need normalizing since we only compare magnitudes
        const value = (axisX * points[i]) + (axisY * points[i+1]);
        min = Math.min(min, value);
        max = Math.max(max, value);
    }
    return [min, max];
}

/**
 * Return true if the axis contains a gap between the two polygons
 */
function testPolygonSeparatingAxis(axisX: number, axisY: number, aPoints: number[], bPoints: number[]): boolean {
    const [minA, maxA] = projectPolygonToAxis(axisX, axisY, aPoints);
    const [minB, maxB] = projectPolygonToAxis(axisX, axisY, bPoints);
    return !((minA < maxB) && (minB < maxA));
}

function halfCollideConvexPolygons(aPoints: number[], bPoints: number[]): boolean {
    for(let i = 2; i < aPoints.length; i += 2) {
        const dx = aPoints[i] - aPoints[i-2];
        const dy = aPoints[i+1] - aPoints[i-1];
        if(testPolygonSeparatingAxis(-dy, dx, aPoints, bPoints)) {
            return false;
        }
    }
    const dx = aPoints[0] - aPoints[aPoints.length-2];
    const dy = aPoints[1] - aPoints[aPoints.length-1];
    if(testPolygonSeparatingAxis(-dy, dx, aPoints, bPoints)) {
        return false;
    }

    // no gaps found in this half
    return true;
}

function collideConvexPolygons({points: aPoints}: Polygon, {points: bPoints}: Polygon): boolean {
    return halfCollideConvexPolygons(aPoints, bPoints) && halfCollideConvexPolygons(bPoints, aPoints);
}

export function FindCollisions(data: Data, cellSize: number): Collision[] {
    const spatialMap: Record<string, Candidate[]> = {};

    Join(data, "collisionTargetClass", "location", "bounds").map(
        ([id, targetClass, location, poly]) => {
            const workingPoly = TfPolygon(poly, location);
            const candidate = {
                id, class: targetClass, poly: workingPoly
            };
            hashPolygon(workingPoly, cellSize).forEach(key => {
                if(!spatialMap[key]) spatialMap[key] = [];
                spatialMap[key].push(candidate);
            });
        }
    );

    const results: Collision[] = [];

    Join(data, "collisionSourceClass", "location", "bounds").map(
        ([id, sourceClass, location, poly]) => {
            const workingPoly = TfPolygon(poly, location);
            const candidates: Record<string, Candidate> = {};
            hashPolygon(workingPoly, cellSize).forEach(key => {
                if(spatialMap[key]) {
                    for(const candidate of spatialMap[key]) {
                        // dedup targets to test
                        candidates[candidate.id[0]] = candidate;
                    }
                }
            });
            for(const bareId in candidates) {
                const target = candidates[bareId];
                if(collideConvexPolygons(workingPoly, target.poly)) {
                    results.push({
                        className: `${sourceClass.name}>${target.class.name}`,
                        sourceId: id,
                        targetId: target.id
                    });
                }
            }
        }
    );

    return results;
}
