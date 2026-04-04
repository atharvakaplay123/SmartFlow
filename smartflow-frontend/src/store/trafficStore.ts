import { create } from 'zustand';

export interface TrafficState {
  traffic: { A: number; B: number; C: number; D: number };
  mode: 'NORMAL' | 'AI';
  cycleTime: number;
  greenTimes: { A: number; B: number; C: number; D: number };
  tick: () => void;
}

export const useTrafficStore = create<TrafficState>((set) => ({
  traffic: { A: 25, B: 25, C: 25, D: 25 },
  mode: 'NORMAL',
  cycleTime: 60,
  greenTimes: { A: 15, B: 15, C: 15, D: 15 },
  
  tick: () => set((state) => {
    // Generate new random traffic with slight deviation
    const newTraffic = {
      A: Math.max(10, Math.min(100, state.traffic.A + Math.floor((Math.random() - 0.5) * 20))),
      B: Math.max(10, Math.min(100, state.traffic.B + Math.floor((Math.random() - 0.5) * 20))),
      C: Math.max(10, Math.min(100, state.traffic.C + Math.floor((Math.random() - 0.5) * 20))),
      D: Math.max(10, Math.min(100, state.traffic.D + Math.floor((Math.random() - 0.5) * 20))),
    };

    const avgLoad = (newTraffic.A + newTraffic.B + newTraffic.C + newTraffic.D) / 4;
    
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
      greenTimes.A = Math.round((newTraffic.A / totalTraffic) * cycleTime);
      greenTimes.B = Math.round((newTraffic.B / totalTraffic) * cycleTime);
      greenTimes.C = Math.round((newTraffic.C / totalTraffic) * cycleTime);
      greenTimes.D = cycleTime - greenTimes.A - greenTimes.B - greenTimes.C; // prevent rounding gap
    }

    return {
      traffic: newTraffic,
      mode,
      cycleTime,
      greenTimes
    };
  })
}));
