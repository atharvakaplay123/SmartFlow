import { create } from 'zustand';

export type RoadId = 'A' | 'B' | 'C' | 'D';

export interface TrafficState {
  traffic: { A: number; B: number; C: number; D: number };
  mode: 'NORMAL' | 'AI';
  cycleTime: number;
  greenTimes: { A: number; B: number; C: number; D: number };
  selectedIntersection: string;
  systemHealth: 'GOOD' | 'WARNING' | 'CRITICAL';
  manualOverride: boolean;
  selectedOverrideRoad: RoadId | null;
  overrideHistory: { time: number; action: string }[];
  trafficHistory: { time: string; A: number; B: number; C: number; D: number; avg: number }[];
  setIntersection: (name: string) => void;
  setOverride: (active: boolean, road?: RoadId | null) => void;
  tick: () => void;
}

export const useTrafficStore = create<TrafficState>((set, get) => ({
  traffic: { A: 45, B: 55, C: 40, D: 60 },
  mode: 'NORMAL',
  cycleTime: 60,
  greenTimes: { A: 15, B: 15, C: 15, D: 15 },
  selectedIntersection: 'Vijay Nagar',
  systemHealth: 'GOOD',
  manualOverride: false,
  selectedOverrideRoad: null,
  overrideHistory: [],
  trafficHistory: [],

  setOverride: (active, road = null) => set((state) => {
    const newRoad = road !== undefined ? road : state.selectedOverrideRoad;
    const history = [...(state.overrideHistory || [])];
    
    if (active && !state.manualOverride) {
      history.unshift({ time: Date.now(), action: "Manual override activated" });
    }
    
    if (active && newRoad && newRoad !== state.selectedOverrideRoad) {
      history.unshift({ time: Date.now(), action: `Road ${newRoad} set to GREEN` });
    }
    
    if (!active && state.manualOverride) {
      history.unshift({ time: Date.now(), action: "Manual override deactivated" });
    }
    
    if (history.length > 3) history.length = 3;
    
    if (active && newRoad) {
      return {
        manualOverride: true,
        selectedOverrideRoad: newRoad,
        overrideHistory: history
      };
    }
    
    if (!active) {
      return { manualOverride: false, selectedOverrideRoad: null, overrideHistory: history };
    }
    
    return { manualOverride: active, selectedOverrideRoad: newRoad, overrideHistory: history };
  }),

  setIntersection: (name: string) => {
    let baseMin = 10, baseMax = 50;
    if (name === 'Vijay Nagar') { baseMin = 40; baseMax = 80; }
    else if (name === 'Palasia') { baseMin = 20; baseMax = 60; }
    else if (name === 'Bhanwar Kuan') { baseMin = 60; baseMax = 95; }

    const initialTraffic = {
      A: Math.floor(Math.random() * (baseMax - baseMin + 1)) + baseMin,
      B: Math.floor(Math.random() * (baseMax - baseMin + 1)) + baseMin,
      C: Math.floor(Math.random() * (baseMax - baseMin + 1)) + baseMin,
      D: Math.floor(Math.random() * (baseMax - baseMin + 1)) + baseMin,
    };

    set({ selectedIntersection: name, traffic: initialTraffic });
    get().tick(); // Trigger immediate recalculation to properly set mode, cycleTime etc.
  },

  tick: () => set((state) => {
    const name = state.selectedIntersection;
    let baseMin = 10, baseMax = 100;
    if (name === 'Vijay Nagar') { baseMin = 40; baseMax = 80; }
    else if (name === 'Palasia') { baseMin = 20; baseMax = 60; }
    else if (name === 'Bhanwar Kuan') { baseMin = 60; baseMax = 95; }

    // Generate new random traffic with slight deviation clamped by intersection ranges
    const gen = (val: number) => {
      const change = Math.floor((Math.random() - 0.5) * 20);
      return Math.max(baseMin, Math.min(baseMax, val + change));
    }

    const newTraffic = {
      A: gen(state.traffic.A),
      B: gen(state.traffic.B),
      C: gen(state.traffic.C),
      D: gen(state.traffic.D),
    };

    if (state.manualOverride) {
      // Disable AI logic completely when manual override is active.
      // Traffic still updates underneath, but AI mode, health, times stand still.
      return { traffic: newTraffic };
    }

    const avgLoad = Math.round((newTraffic.A + newTraffic.B + newTraffic.C + newTraffic.D) / 4);

    // Threshold calculation
    let threshold = 40;
    if (avgLoad < 30) threshold = 20;
    else if (avgLoad < 60) threshold = 30;

    // Mode determination
    let mode: 'NORMAL' | 'AI' = 'NORMAL';
    if (
      newTraffic.A >= threshold ||
      newTraffic.B >= threshold ||
      newTraffic.C >= threshold ||
      newTraffic.D >= threshold
    ) {
      mode = 'AI';
    }

    // Cycle time calculation
    let cycleTime = 120; // High
    if (avgLoad < 40) cycleTime = 60; // Low
    else if (avgLoad < 70) cycleTime = 90; // Medium

    // Green time allocation
    const greenTimes = { A: 0, B: 0, C: 0, D: 0 };
    if (mode === 'NORMAL') {
      const q = Math.round(cycleTime / 4);
      greenTimes.A = q; greenTimes.B = q; greenTimes.C = q; greenTimes.D = cycleTime - (q * 3);
    } else {
      const totalTraffic = newTraffic.A + newTraffic.B + newTraffic.C + newTraffic.D;
      // Safeguard against division by zero
      if (totalTraffic > 0) {
        greenTimes.A = Math.round((newTraffic.A / totalTraffic) * cycleTime);
        greenTimes.B = Math.round((newTraffic.B / totalTraffic) * cycleTime);
        greenTimes.C = Math.round((newTraffic.C / totalTraffic) * cycleTime);
        greenTimes.D = cycleTime - greenTimes.A - greenTimes.B - greenTimes.C;
      }
    }

    // System Health calculation
    let systemHealth: 'GOOD' | 'WARNING' | 'CRITICAL' = 'GOOD';
    if (avgLoad >= 80) systemHealth = 'CRITICAL';
    else if (avgLoad >= 50) systemHealth = 'WARNING';

    const now = new Date();
    const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    
    const historyEntry = { time: timeStr, A: newTraffic.A, B: newTraffic.B, C: newTraffic.C, D: newTraffic.D, avg: avgLoad };
    const newHistory = [...state.trafficHistory, historyEntry].slice(-10);

    return {
      traffic: newTraffic,
      mode,
      cycleTime,
      greenTimes,
      systemHealth,
      trafficHistory: newHistory
    };
  })
}));
