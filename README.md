# CogniSketch - Frontend

An AI-powered drawing calculator that transforms your handwritten mathematical expressions into solved equations. Draw math problems on a canvas and let AI do the calculations for you.

## ✨ Features

- **Freehand Drawing Canvas** - Draw mathematical expressions naturally with mouse or touch
- **AI-Powered Recognition** - Uses Google's Gemini AI to analyze and solve drawn expressions
- **Multiple Color Swatches** - Choose from a variety of colors for drawing
- **Undo/Redo Support** - Navigate through your drawing history
- **Draggable Results** - Move calculation results anywhere on the canvas
- **Variable Support** - Assign variables and use them in subsequent calculations
- **Responsive Design** - Works on desktop and mobile devices
- **Touch Support** - Full touch screen compatibility for tablets and phones

## 🛠️ Tech Stack

- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool & Dev Server
- **Tailwind CSS** - Styling
- **Mantine UI** - Component Library
- **Axios** - HTTP Client
- **React Router** - Navigation
- **MathJax** - LaTeX Rendering
- **Lucide React** - Icons

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cognisketch.git
   cd cognisketch/CogniSketch
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:8900
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`


## 🎨 How to Use

1. **Navigate to the drawing canvas** by clicking "Start Drawing" on the landing page
2. **Select a color** from the color swatches in the toolbar
3. **Draw your mathematical expression** on the canvas
4. **Click "Calculate"** to send your drawing to the AI for analysis
5. **View the result** - it appears as a draggable card on the canvas
6. **Use Undo/Redo** to navigate through your drawing history
7. **Click Reset** to clear the canvas and start fresh

## 🧮 Supported Calculations

- **Basic Arithmetic**: `2 + 3 * 4`, `10 / 2 - 5`
- **Algebraic Equations**: `x^2 + 2x + 1 = 0`
- **Variable Assignment**: `x = 5`, `y = 10`
- **Graphical Math Problems**: Word problems represented as drawings
- **Abstract Concepts**: Drawings representing ideas or concepts


## 🔗 Related

- [CogniSketch Backend](../CogniSketch-Backend) - The FastAPI backend for this application
