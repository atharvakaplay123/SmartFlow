import type { vehicleCountABC, vehicleCountD } from "../types.js";

export async function greenTimeLogicABC(vehicleCount: vehicleCountABC):Promise<vehicleCountABC>{
   
  const { A, B, C } = vehicleCount;

  const totalVehicles = A + B + C;

  // 🔥 Step 1: Decide total cycle time based on traffic level
  let TOTAL_TIME: number;

  if (totalVehicles <= 15) {
    TOTAL_TIME = 60;     // Low traffic
  } else if (totalVehicles <= 40) {
    TOTAL_TIME = 100;    // Medium traffic
  } else {
    TOTAL_TIME = 150;    // High traffic
  }

  // 🔥 Edge case
  if (totalVehicles === 0) {
    return { A: 10, B: 10, C: 10 };
  }

  // 🔥 Step 2: Distribute time proportionally
  const result: vehicleCountABC = {
    A: Math.round((A / totalVehicles) * TOTAL_TIME),
    B: Math.round((B / totalVehicles) * TOTAL_TIME),
    C: Math.round((C / totalVehicles) * TOTAL_TIME)
  };

  // 🔥 Optional: priority order
  const priority = (["A", "B", "C"] as (keyof vehicleCountABC)[])
    .sort((r1, r2) => result[r2] - result[r1]);

  console.log("🚦 Total Vehicles:", totalVehicles);
  console.log("⏱ Selected Cycle Time:", TOTAL_TIME);
  console.log("🚦 Priority Order:", priority);

  return result;
}
    

export async function greenTimeLogicD(vehicleCount: vehicleCountD):Promise<vehicleCountD>{
   

  const { D } = vehicleCount;

  const SCALE = 2;     // 1 vehicle = 2 sec
  const MIN_TIME = 10;

  // 🔥 Calculate time
  let time = D * SCALE;

  // 🔥 Apply only minimum limit (no max cap)
  time = Math.max(MIN_TIME, time);

  return { D: time };
}
    
