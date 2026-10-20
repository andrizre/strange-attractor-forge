# Strange Attractor Forge

An interactive studio for 3D strange attractors: chaos theory rendered as living
light trails on an HTML canvas.

## Concept

Eight classic chaotic systems (Lorenz, Thomas, Aizawa, Halvorsen, Rossler,
Chen-Lee, Sprott, Dadras) are integrated in real time with a 2nd-order
Runge–Kutta method. The trajectory is drawn as a colored trail with depth-based
brightness, slow auto-rotation, and motion-blur fading. Every system's constants
are exposed as live sliders — drag them and watch chaos collapse into a fixed
point or bloom into a new attractor. "Randomize" scrambles all parameters to
search for new regimes.

## Features

- 8 attractor presets, each with tunable constants (live sliders)
- Real-time RK2 integration (~60 points/frame, adjustable speed)
- Orbit with mouse drag, zoom with scroll wheel
- Motion-blur fade control, hue-cycling trail colors
- Export the current canvas as a PNG
- Share configurations via URL hash ("Copy link" — preset + parameter values are encoded in the URL and restored on load)
- Spacebar pauses/resumes

## Run

Pure static site — no build, no dependencies:

```bash
cd strange-attractor-forge
python3 -m http.server 8000
# open http://localhost:8000
```

(or just open `index.html` in a browser.)

## Files

- `index.html` — layout
- `style.css` — dark studio UI
- `presets.js` — attractor definitions (vector fields + parameter ranges)
- `main.js` — integrator, renderer, and controls
