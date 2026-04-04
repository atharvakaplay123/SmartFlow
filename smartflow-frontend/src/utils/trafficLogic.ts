export type RoadId = 'A' | 'B' | 'C' | 'D';

export interface RoadData {
  id: RoadId;
  name: string;
  density: number;
}

export interface SignalResult {
  roadId: RoadId;
  greenTime: number;
  isGreen: boolean;
}

export const CYCLE_TIME = 120; // seconds

export const DEFAULT_ROADS: RoadData[] = [
  { id: 'A', name: 'Road A', density: 45 },
  { id: 'B', name: 'Road B', density: 70 },
  { id: 'C', name: 'Road C', density: 30 },
  { id: 'D', name: 'Road D', density: 55 },
];

/**
 * Calculate total traffic across all roads.
 */
export function calculateTotalTraffic(roads: RoadData[]): number {
  return roads.reduce((sum, road) => sum + road.density, 0);
}

/**
 * Calculate green signal time for each road.
 * Formula: (Road Traffic / Total Traffic) × Cycle Time
 */
export function calculateGreenTimes(roads: RoadData[]): Record<RoadId, number> {
  const total = calculateTotalTraffic(roads);
  const result: Partial<Record<RoadId, number>> = {};

  for (const road of roads) {
    if (total === 0) {
      result[road.id] = CYCLE_TIME / roads.length;
    } else {
      result[road.id] = Math.round((road.density / total) * CYCLE_TIME);
    }
  }

  return result as Record<RoadId, number>;
}

/**
 * Determine the active (GREEN) road based on highest green time.
 */
export function getActiveRoad(roads: RoadData[]): RoadId {
  const greenTimes = calculateGreenTimes(roads);
  let maxTime = -1;
  let activeRoad: RoadId = 'A';

  for (const road of roads) {
    if (greenTimes[road.id] > maxTime) {
      maxTime = greenTimes[road.id];
      activeRoad = road.id;
    }
  }

  return activeRoad;
}

/**
 * Build signal result list with green/red status.
 */
export function buildSignalResults(roads: RoadData[]): SignalResult[] {
  const greenTimes = calculateGreenTimes(roads);
  const activeRoad = getActiveRoad(roads);

  return roads.map((road) => ({
    roadId: road.id,
    greenTime: greenTimes[road.id],
    isGreen: road.id === activeRoad,
  }));
}

/**
 * Returns congestion score (0–100) for a set of roads.
 * Based on weighted average density.
 */
export function getCongestionScore(roads: RoadData[]): number {
  const total = calculateTotalTraffic(roads);
  return Math.round(total / roads.length);
}

/**
 * Returns the most congested road.
 */
export function getMostCongestedRoad(roads: RoadData[]): RoadData {
  return roads.reduce((prev, curr) => (curr.density > prev.density ? curr : prev));
}
