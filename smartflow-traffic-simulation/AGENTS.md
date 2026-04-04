# AGENTS MEMORY MAP
*Repository Context and Constraints Tracker for Autonomous Agents*

### 🎯 Current State
You are placed inside an active **SmartFlow Traffic Simulation Engine** directory.
All core frontend user-interface rendering is taking place in `/app/page.tsx`.
The page contains a fully realized Live Intersection Map, Density control sliders, and a Green Time Analytics dashboard.

### 🚫 Strict Prohibitions
1. **Never alter the visual mathematical bindings** of the Map. Signal lights (`top, left, bottom, right` with `calc(50% + Xpx)`) are explicitly bound via complex measurements off of 120px road vectors.
2. **Never push code creating unnecessary pages or routes.** This dashboard operates strictly as a Single Page Application (SPA).
3. **Avoid adding Neon styling**. The user heavily discourages neon flashes `animate-pulse`, hyper-glowing shadows, or non-matte components on the UI intersection.

### 💡 Workflow Execution
Whenever a new directive involves updating cycle times or modifying UI:
1. Always calculate geometry accurately.
2. Respect existing Next.js / Tailwind conventions.
3. Consult the logic parameters present in `CLAUDE.md`.
4. Ensure components stay inside the overarching single layout grid constraints defined by `<div className="max-w-[1200px] mx-auto...">`.
