# ⚡ Release v1.3.0 - Interactive 3D WebGL Workbench & Curved Wiring Simulator

Welcome to **Kone Lab v1.3.0**! This is our biggest release yet, transforming the 3D workshop into an immersive, high-fidelity dynamic engineering configurator and circuit simulator. By migrating cluttered popover cards to an anchored property sidebar and introducing a parameterized custom part registry, Kone Lab now mimics professional EDA and CAD packages (like Altium or Blender) in a 100% web-native WebGL environment.

---

## 💎 What's New in v1.3.0

### 1. Anchored Property Editor Sidebar & Custom Controls 📐
* **Canvas Uncluttering:** Replaced floating canvas overlays with a high-fidelity anchored **Right Sidebar Properties Panel** (`properties-sidebar`) to maximize WebGL 3D workspace area.
* **Interactive Tweak Sliders:** Support real-time adjustments of component names, coordinate positioning (X/Z grid snapping), rotational sliders (Y-axis degrees), and telemetry variables.
* **Telemetry Outputs:** Real-time sensor readout consoles for temperature and humidity output fields linked programmatically to 3D environmental sensors.

### 2. Parameterized Parts Registry & High-Res Category Dropdowns 📦
* **Condensed Passive Parts Catalog:** Consolidated 600+ repetitive passive component items into dynamic base models:
  - **Carbon Film Resistor:** Automatically computes and colors 4-band striped resistor bodies in 3D WebGL and 2D vector layouts based on Ohm values (1Ω to 10MΩ).
  - **Capacitors:** Dynamic base ceramic decoupling disc and electrolytic radial polar capacitors with custom farad value fields.
* **Premium SVG Select Dropdowns:** Custom-built React select components (`<CustomDropdown>`) featuring:
  - Flexbox-aligned **text-truncation with elegant ellipses (`...`)** to prevent clipping on compact viewports.
  - Native browser **hover tooltips (`title={...}`)** for immediate item reading.
  - Actual high-fidelity **vector SVG category icons** inside the trigger and dropdown options.

### 3. Curved 3D Wire Connector & Signal Pulses ⚡
* **3D Wiring Simulator:** Smoothly drag, position, and snap wires between distinct pins in full 3D space.
* **Procedural Bezier Curve Wires:** Render realistic curved insulation lines that sag naturally between connection prongs.
* **Signal Flow Animations:** Moving, glowing electrical current pulses travel procedurally along active wires.
* **Closed-Loop LED Logic:** Automatic graph-traversal calculations trace power paths (VCC to GND). Powering a circuit lights up 3D LEDs with full physical glowing emissive dome reflections in real time!
* **Dynamic LED Color Sync:** Select Red, Green, Blue, or Yellow in the Properties Panel to instantly update the WebGL dome lens material, internal metal anvil pieces, and physical glowing light emission values!

---

## 🛠️ Technical Details & Commits
* **Three.js & react-three-fiber integration:** Optimized physical glassmorphic materials on components using high-transmission coefficients and custom roughness metrics.
* **Bespoke 3D Wire Meshes:** Wires utilize bespoke `tubeGeometry` generated on-the-fly from dynamic quadratic Bezier curves.
* **Emissive Mesh Shaders:** Custom emissive standard mesh materials driven programmatically via frame tickers (`useFrame`) to simulate glowing electrical currents and pulsing LED light source intensities.
