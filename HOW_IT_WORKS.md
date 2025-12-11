# How CogniSketch Frontend Works

This document provides an in-depth explanation of how the CogniSketch frontend application works, from user interaction to displaying results.

---

## Table of Contents

1. [Application Architecture](#application-architecture)
2. [Routing & Navigation](#routing--navigation)
3. [The Drawing Canvas](#the-drawing-canvas)
4. [Drawing Mechanism](#drawing-mechanism)
5. [Undo/Redo System](#undoredo-system)
6. [Color Selection](#color-selection)
7. [API Communication](#api-communication)
8. [Result Rendering](#result-rendering)
9. [State Management](#state-management)

---

## Application Architecture

The application is built using React with TypeScript and uses Vite as the build tool. The architecture follows a simple screen-based structure:

```
App.tsx (Router)
    ├── Landing Screen (/)
    │   └── Hero section with "Start Drawing" button
    │
    └── Drawing Screen (/drawing)
        ├── Toolbar (Reset, Undo, Redo, Colors, Calculate, Guide)
        ├── Canvas (Full-screen drawing area)
        └── Draggable Result Cards
```

### Entry Point (`main.tsx`)

```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

The app is wrapped in `StrictMode` for development warnings and rendered to the `#root` element.

### App Component (`App.tsx`)

The App component sets up:
1. **React Router** - For navigation between pages
2. **Mantine Provider** - For UI component theming

---

## Routing & Navigation

The app uses `react-router-dom` for client-side routing:

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `Landing` | Welcome page with app introduction |
| `/drawing` | `Drawing` | Main drawing canvas where calculations happen |

Navigation is triggered by user actions:
- Clicking "Start Drawing" on landing page → navigates to `/drawing`

---

## The Drawing Canvas

The core of the application is an HTML5 `<canvas>` element that captures user drawings.

### Canvas Initialization

When the Drawing component mounts, a `useEffect` hook:

1. **Sets canvas dimensions** to match the full window size
2. **Configures drawing context**:
   ```typescript
   ctx.lineCap = "round";  // Smooth line endings
   ctx.lineWidth = 3;      // Stroke thickness
   ```
3. **Adds resize listener** to handle window resizing while preserving drawings
4. **Loads MathJax** for rendering mathematical expressions
5. **Initializes history** with empty canvas state for undo/redo

### Canvas Resize Handling

When the window resizes:
1. Current drawing is saved as `ImageData`
2. Canvas is resized to new dimensions
3. Drawing is restored with `putImageData()`

---

## Drawing Mechanism

The drawing system uses three primary event handlers:

### 1. `startDrawing(e)`

Triggered on `mousedown` or `touchstart`:

```typescript
const startDrawing = (e) => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  const { x, y } = getEventCoordinates(e);
  
  ctx.beginPath();      // Start a new path
  ctx.moveTo(x, y);     // Move to starting point
  setIsDrawing(true);   // Enable drawing mode
};
```

### 2. `draw(e)`

Triggered on `mousemove` or `touchmove`:

```typescript
const draw = (e) => {
  if (!isDrawing) return;  // Only draw when mouse/touch is down
  
  const ctx = canvas.getContext("2d");
  const { x, y } = getEventCoordinates(e);
  
  ctx.strokeStyle = color;  // Use selected color
  ctx.lineTo(x, y);         // Draw line to current point
  ctx.stroke();             // Render the stroke
};
```

### 3. `stopDrawing()`

Triggered on `mouseup`, `mouseout`, or `touchend`:

```typescript
const stopDrawing = () => {
  setIsDrawing(false);
  
  // Save current state to history for undo/redo
  setTimeout(() => {
    const currentStep = historyStepRef.current;
    setHistory((prev) => {
      const newHistory = prev.slice(0, currentStep + 1);
      newHistory.push(canvas.toDataURL());
      return newHistory;
    });
    setHistoryStep(currentStep + 1);
  }, 0);
};
```

### Coordinate Calculation

The `getEventCoordinates` function handles both mouse and touch events, accounting for canvas scaling:

```typescript
const getEventCoordinates = (e) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  
  if ('touches' in e) {
    // Touch event
    return {
      x: (touch.clientX - rect.left) * scaleX,
      y: (touch.clientY - rect.top) * scaleY,
    };
  } else {
    // Mouse event
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }
};
```

---

## Undo/Redo System

The undo/redo system maintains a history of canvas states as base64 data URLs.

### State Structure

```typescript
const [history, setHistory] = useState<string[]>([]);  // Array of canvas snapshots
const [historyStep, setHistoryStep] = useState(-1);    // Current position in history
const historyStepRef = useRef(-1);                     // Ref to avoid stale closures
```

### How History Works

1. **Initial State**: Empty canvas is saved as first history entry
2. **After Each Stroke**: Canvas is converted to data URL and added to history
3. **On Undo**: `historyStep` decreases, canvas restores previous state
4. **On Redo**: `historyStep` increases, canvas restores next state
5. **New Drawing After Undo**: History is truncated, removing "future" states

### Undo Function

```typescript
const undo = () => {
  setHistoryStep((prev) => {
    const newStep = Math.max(0, prev - 1);
    restoreFromHistory(history[newStep]);
    return newStep;
  });
};
```

### Redo Function

```typescript
const redo = () => {
  setHistoryStep((prev) => {
    const newStep = Math.min(history.length - 1, prev + 1);
    restoreFromHistory(history[newStep]);
    return newStep;
  });
};
```

### Restoring Canvas State

```typescript
const restoreFromHistory = (imageDataUrl: string) => {
  const img = new Image();
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  };
  img.src = imageDataUrl;
};
```

---

## Color Selection

Colors are defined in `constants.ts`:

```typescript
const SWATCHES = [
  "#000000",  // black
  "#ffffff",  // white
  "#ee3333",  // red
  "#e64980",  // pink
  "#be4bdb",  // purple
  // ... more colors
];
```

The selected color is stored in state and applied during drawing:

```typescript
const [color, setColor] = useState("rgb(255, 255, 255)");

// In draw function:
ctx.strokeStyle = color;
```

Color swatches are rendered using Mantine's `ColorSwatch` component with a visual ring indicator for the selected color.

---

## API Communication

When the user clicks "Calculate", the app sends the canvas image to the backend.

### Request Flow

```typescript
const runRoute = async () => {
  setIsCalculating(true);
  
  try {
    const response = await axios.post(`${API_URL}/calculate`, {
      image: canvas.toDataURL("image/png"),  // Canvas as base64
      dict_of_vars: dictOfVars               // Previously assigned variables
    });
    
    // Process response...
  } catch (error) {
    console.error("Error calculating:", error);
  } finally {
    setIsCalculating(false);
  }
};
```

### Request Payload

```json
{
  "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "dict_of_vars": { "x": "5", "y": "10" }
}
```

### Response Processing

The response contains an array of results:

```json
{
  "data": [
    { "expr": "2 + 3", "result": "5", "assign": false },
    { "expr": "x", "result": "10", "assign": true }
  ]
}
```

For each result:
1. If `assign` is `true`, the variable is saved to `dictOfVars` for future calculations
2. The expression and result are formatted as LaTeX and displayed

---

## Result Rendering

Results are displayed as draggable cards using `react-draggable` and rendered with MathJax.

### LaTeX Formatting

```typescript
const renderLatexToCanvas = (expression: string, answer: string) => {
  const latex = `\\(\\LARGE{${expression} = ${answer}}\\)`;
  setLatexExpression([...latexExpression, latex]);
  
  // Clear canvas after showing result
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};
```

### Result Positioning

The app calculates where to place the result based on the drawn content:

```typescript
// Find bounding box of drawn content
for (let y = 0; y < canvas.height; y++) {
  for (let x = 0; x < canvas.width; x++) {
    if (imageData.data[i + 3] > 0) {  // If pixel is not transparent
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
}

// Position result at center of drawing
const centerX = (minX + maxX) / 2;
const centerY = (minY + maxY) / 2;
setLatexPosition({ x: centerX, y: centerY });
```

### Draggable Results

Each result is wrapped in a `Draggable` component:

```jsx
<Draggable
  defaultPosition={latexPosition}
  onStop={(_, data) => setLatexPosition({ x: data.x, y: data.y })}
>
  <div className="absolute p-3 text-white rounded-lg">
    {latex}
  </div>
</Draggable>
```

---

## State Management

The app uses React's built-in `useState` and `useRef` hooks for state management:

| State | Purpose |
|-------|---------|
| `isDrawing` | Whether user is currently drawing |
| `color` | Selected drawing color |
| `reset` | Triggers canvas reset |
| `dictOfVars` | Stores assigned variables for reuse |
| `result` | Current calculation result |
| `latexPosition` | Position of result card |
| `latexExpression` | Array of LaTeX expressions to render |
| `isCalculating` | Loading state during API call |
| `history` | Array of canvas states for undo/redo |
| `historyStep` | Current position in history |
| `historyStepRef` | Ref to avoid stale closure issues |

---

## Summary

The CogniSketch frontend is a canvas-based drawing application that:

1. Captures freehand drawings on an HTML5 canvas
2. Maintains drawing history for undo/redo functionality
3. Converts the canvas to a base64 image and sends it to the AI backend
4. Receives calculated results and displays them as draggable LaTeX-rendered cards
5. Preserves variable assignments for complex, multi-step calculations
