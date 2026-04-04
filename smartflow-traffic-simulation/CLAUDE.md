# SmartFlow - AI Traffic Signal Control System

This file serves as a memory core and rulebook for AI assistants working on this project.

## 🏗 Project Overview
SmartFlow is a simulation engine for a hackathon projected focused on analyzing and optimizing traffic signals dynamically based on lane densities. 
This repository contains the **Frontend Dashboard** and **AI Traffic Visualization Engine** built using **Next.js (App Router)**, **TypeScript**, and **TailwindCSS**. Note that the backend API will run separately.

## 🎨 Design System & Theme
We enforce a strictly professional, extremely clean "Deep Navy & Light" theme without overwhelming neon glows.
- **Background:** Very Light Blue `#F5F8FC`
- **Text & Headings:** Deep Navy Blue `#0B2A4A`
- **Road Blocks:** Dark Navy `#1E3A5F`
- **Accents (Icons, Active Sliders, Glows):** Bright Blue `#2F80ED`
- **Signals:** Flat Red `#EB5757` and Green `#27AE60` without intense shadow drop-glows.
- **Cards:** White (`#FFFFFF`) with soft shadows (`shadow-sm` / border-slate-200).
- **Topology:** The intersection is a perfectly symmetrical `+` shape (Roads A, B, C, D) using explicit `absolute` coordinates to prevent overlapping components.

## 🧠 Core AI Engine Logic
The core traffic calculation relies heavily on real-time reactive dynamic loads (found in `app/page.tsx`).
1. **Dynamic Cycle Algorithm:**
   - Total Traffic `<= 40`  → **60s Cycle** (Low traffic handling)
   - Total Traffic `<=` 120 → **90s Cycle** (Medium traffic handling)
   - Total Traffic `> 120`  → **120s Cycle** (Heavy traffic handling)

2. **Proportional Green Time Allocation:**
   Specific lane allocations are derived as `{Lane} = Math.round((Lane Traffic / Total Traffic) * Active Cycle)`. Green times iterate dynamically via a `setInterval`-driven queue.

## 💻 Technical Stack & Rules
- **Framework:** Next.js uses App Router paradigm.
- **Styling:** Tailwind CSS exclusively.
- **Icons:** `lucide-react` is the chosen set.
- **Components:** Must be functional, typed cleanly, utilizing standard React Hooks (`useState`, `useMemo`, `useEffect`). Keep everything contained modularly rendering gracefully even on hydration.

## 🛠 Commands
- **Run dev environment:** `npm run dev`
- **Run build:** `npm run build`
