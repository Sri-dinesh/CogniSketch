import { ColorSwatch, Group } from "@mantine/core";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Draggable from "react-draggable";
import { SWATCHES } from "@/constants";
import {
  RotateCcw,
  Calculator,
  Loader2,
  Undo2,
  Redo2,
  HelpCircle,
  X,
} from "lucide-react";
// import {LazyBrush} from 'lazy-brush';

interface GeneratedResult {
  expression: string;
  answer: string;
}

interface Response {
  expr: string;
  result: string;
  assign: boolean;
}

export default function Drawing() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("rgb(255, 255, 255)");
  const [reset, setReset] = useState(false);
  const [dictOfVars, setDictOfVars] = useState({});
  const [result, setResult] = useState<GeneratedResult>();
  const [latexPosition, setLatexPosition] = useState({ x: 10, y: 200 });
  const [latexExpression, setLatexExpression] = useState<Array<string>>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const historyStepRef = useRef(-1);

  type ImageData = string;

  // Keep ref in sync with historyStep state to avoid stale closures
  useEffect(() => {
    historyStepRef.current = historyStep;
  }, [historyStep]);

  // const lazyBrush = new LazyBrush({
  //     radius: 10,
  //     enabled: true,
  //     initialPoint: { x: 0, y: 0 },
  // });

  useEffect(() => {
    if (latexExpression.length > 0 && window.MathJax) {
      setTimeout(() => {
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
      }, 0);
    }
  }, [latexExpression]);

  useEffect(() => {
    if (result) {
      renderLatexToCanvas(result.expression, result.answer);
    }
  }, [result]);

  useEffect(() => {
    if (reset) {
      setIsResetting(true);
      resetCanvas();
      setLatexExpression([]);
      setResult(undefined);
      setDictOfVars({});
      setHistory([]);
      setHistoryStep(-1);
      setTimeout(() => {
        setReset(false);
        setIsResetting(false);
      }, 300);
    }
  }, [reset]);

  useEffect(() => {
    const canvas = canvasRef.current;

    const resizeCanvas = () => {
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          // Save current drawing
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

          // Resize canvas
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          canvas.style.background = "#212529";
          ctx.lineCap = "round";
          ctx.lineWidth = 3;

          // Restore drawing
          ctx.putImageData(imageData, 0, 0);
        }
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML";
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.MathJax.Hub.Config({
        tex2jax: {
          inlineMath: [
            ["$", "$"],
            ["\\(", "\\)"],
          ],
        },
      });
    };

    // Initialize history with empty canvas state
    if (canvas && history.length === 0) {
      setHistory([canvas.toDataURL()]);
      setHistoryStep(0);
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      document.head.removeChild(script);
    };
  }, []);

  const renderLatexToCanvas = (expression: string, answer: string) => {
    const latex = `\\(\\LARGE{${expression} = ${answer}}\\)`;
    setLatexExpression([...latexExpression, latex]);

    // Clear the main canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const getEventCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();

    // Calculate scale factor between displayed size and actual canvas size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ("touches" in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current!;
    if (canvas) {
      canvas.style.background = "#212529";
      const ctx = canvas.getContext("2d")!;
      const { x, y } = getEventCoordinates(e);
      ctx.beginPath();
      ctx.moveTo(x, y);
      setIsDrawing(true);
    }
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current!;
    if (canvas) {
      const ctx = canvas.getContext("2d")!;
      const { x, y } = getEventCoordinates(e);
      ctx.strokeStyle = color;
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    // Save state to history after drawing ends
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        // Use ref to get the current historyStep value (avoids stale closure)
        const currentStep = historyStepRef.current;
        setHistory((prev) => {
          // Truncate any "future" history states after current step
          // This ensures undo works correctly by removing redo states when new drawing is made
          const newHistory = prev.slice(0, currentStep + 1);
          newHistory.push(canvas.toDataURL());
          return newHistory;
        });
        setHistoryStep(currentStep + 1);
      }
    }, 0);
  };

  const undo = () => {
    setHistoryStep((prev) => {
      const newStep = Math.max(0, prev - 1);
      setHistory((historyArray) => {
        if (newStep >= 0 && newStep < historyArray.length) {
          restoreFromHistory(historyArray[newStep]);
        }
        return historyArray;
      });
      return newStep;
    });
  };

  const redo = () => {
    setHistory((historyArray) => {
      setHistoryStep((prev) => {
        const newStep = Math.min(historyArray.length - 1, prev + 1);
        if (newStep >= 0 && newStep < historyArray.length) {
          restoreFromHistory(historyArray[newStep]);
        }
        return newStep;
      });
      return historyArray;
    });
  };

  const restoreFromHistory = (imageDataUrl: string) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineCap = "round";
        ctx.lineWidth = 3;
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        };
        img.src = imageDataUrl;
      }
    }
  };

  // const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
  //     const canvas = canvasRef.current;
  //     if (canvas) {
  //         canvas.style.background = 'black';
  //         const ctx = canvas.getContext('2d');
  //         if (ctx) {
  //             ctx.beginPath();
  //             ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  //             setIsDrawing(true);
  //         }
  //     }
  // };
  // const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
  //     if (!isDrawing) {
  //         return;
  //     }
  //     const canvas = canvasRef.current;
  //     if (canvas) {
  //         const ctx = canvas.getContext('2d');
  //         if (ctx) {
  //             ctx.strokeStyle = color;
  //             ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  //             ctx.stroke();
  //         }
  //     }
  // };
  // const stopDrawing = () => {
  //     setIsDrawing(false);
  // };

  const runRoute = async () => {
    const canvas = canvasRef.current;

    if (canvas) {
      setIsCalculating(true);
      try {
        const response = await axios({
          method: "post",
          url: `${import.meta.env.VITE_API_URL}/calculate`,
          data: {
            image: canvas.toDataURL("image/png"),
            dict_of_vars: dictOfVars,
          },
        });

        const resp = await response.data;
        console.log("Response", resp);
        resp.data.forEach((data: Response) => {
          if (data.assign === true) {
            // dict_of_vars[resp.result] = resp.answer;
            setDictOfVars({
              ...dictOfVars,
              [data.expr]: data.result,
            });
          }
        });
        const ctx = canvas.getContext("2d");
        const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
        let minX = canvas.width,
          minY = canvas.height,
          maxX = 0,
          maxY = 0;

        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const i = (y * canvas.width + x) * 4;
            if (imageData.data[i + 3] > 0) {
              // If pixel is not transparent
              minX = Math.min(minX, x);
              minY = Math.min(minY, y);
              maxX = Math.max(maxX, x);
              maxY = Math.max(maxY, y);
            }
          }
        }

        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        setLatexPosition({ x: centerX, y: centerY });
        resp.data.forEach((data: Response) => {
          setTimeout(() => {
            setResult({
              expression: data.expr,
              answer: data.result,
            });
          }, 1000);
        });
      } catch (error) {
        console.error("Error calculating:", error);
      } finally {
        setIsCalculating(false);
      }
    }
  };

  return (
    <div className="relative w-full h-screen bg-[#212529] overflow-hidden">
      {/* Top Toolbar */}
      <div className="absolute top-0 left-0 right-0 z-20 p-3">
        <div className="flex items-center justify-between gap-4 max-w-screen-xl mx-auto">
          {/* Left Section - Reset, Undo, Redo */}
          <div className="flex items-center gap-2">
            {/* Reset Button */}
            <Button
              onClick={() => setReset(true)}
              disabled={isResetting}
              className="bg-red-500/90 hover:bg-red-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-red-500/25 disabled:opacity-70"
            >
              {isResetting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RotateCcw className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">
                {isResetting ? "Clearing..." : "Reset"}
              </span>
            </Button>

            {/* Undo Button */}
            <Button
              onClick={undo}
              disabled={historyStep <= 0}
              className="bg-blue-500/90 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Undo2 className="w-4 h-4" />
            </Button>

            {/* Redo Button */}
            <Button
              onClick={redo}
              disabled={historyStep >= history.length - 1}
              className="bg-blue-500/90 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Redo2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Center Section - Color Swatches */}
          <Group className="bg-slate-800/80 backdrop-blur-sm rounded-xl flex items-center justify-center flex-wrap gap-2 p-2 shadow-lg">
            {SWATCHES.map((swatch) => (
              <ColorSwatch
                key={swatch}
                color={swatch}
                onClick={() => setColor(swatch)}
                className={`cursor-pointer transition-transform duration-200 hover:scale-110 ${
                  color === swatch
                    ? "ring-2 ring-white ring-offset-2 ring-offset-slate-800"
                    : ""
                }`}
                size={24}
              />
            ))}
          </Group>

          {/* Right Section - Calculate, Guide */}
          <div className="flex items-center gap-2">
            {/* Calculate Button */}
            <Button
              onClick={runRoute}
              disabled={isCalculating}
              className="bg-green-500/90 hover:bg-green-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-green-500/25 disabled:opacity-70"
            >
              {isCalculating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Calculator className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">
                {isCalculating ? "Processing..." : "Calculate"}
              </span>
            </Button>

            {/* Guide Button */}
            <Button
              onClick={() => setShowGuide(!showGuide)}
              className="bg-purple-500/90 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
            >
              <HelpCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Guide Card */}
      {showGuide && (
        <div className="absolute top-20 right-4 z-30 w-80 max-h-96 overflow-y-auto bg-slate-900/95 backdrop-blur-sm border border-purple-500/30 rounded-xl p-5 shadow-2xl animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-purple-400" />
              How to Use
            </h2>
            <button
              onClick={() => setShowGuide(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-3 text-sm text-gray-300">
            <div>
              <p className="font-semibold text-purple-300 mb-1">✏️ Drawing</p>
              <p>
                Click and drag on the canvas to write mathematical equations or
                expressions.
              </p>
            </div>
            <div>
              <p className="font-semibold text-blue-300 mb-1">🎨 Colors</p>
              <p>Click on the color swatches to change your drawing color.</p>
            </div>
            <div>
              <p className="font-semibold text-blue-300 mb-1">↩️ Undo/Redo</p>
              <p>
                Use the Undo and Redo buttons to navigate through your drawing
                history.
              </p>
            </div>
            <div>
              <p className="font-semibold text-green-300 mb-1">🧮 Calculate</p>
              <p>
                Click Calculate to send your drawing to the AI for analysis and
                solving.
              </p>
            </div>
            <div>
              <p className="font-semibold text-red-300 mb-1">🗑️ Reset</p>
              <p>Clear the entire canvas and start fresh.</p>
            </div>
            <div>
              <p className="font-semibold text-yellow-300 mb-1">💡 Tips</p>
              <ul className="list-disc list-inside space-y-1 ml-1">
                <li>Write clearly for better accuracy</li>
                <li>The results appear as draggable cards</li>
                <li>Use variables to solve complex equations</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        id="canvas"
        className="absolute top-0 left-0 w-full h-full cursor-crosshair"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />

      {latexExpression &&
        latexExpression.map((latex, index) => (
          <Draggable
            key={index}
            defaultPosition={latexPosition}
            onStop={(_, data) => setLatexPosition({ x: data.x, y: data.y })}
          >
            <div className="absolute p-3 text-white rounded-lg shadow-xl bg-slate-800/90 backdrop-blur-sm cursor-move">
              <div className="latex-content">{latex}</div>
            </div>
          </Draggable>
        ))}
    </div>
  );
}
