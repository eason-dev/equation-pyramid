"use client";

import { useState } from "react";
import type { Equation } from "@/logic/game/types";

interface DebugPanelProps {
  validEquations: Equation[];
  onFinishRound: () => void;
}

export function DebugPanel({ validEquations, onFinishRound }: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* Debug Toggle Button - Bottom Left Corner */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 left-16 bg-gray-700 text-white p-2 rounded-full shadow-lg hover:bg-gray-800 transition-colors z-50"
        title="Debug Panel"
      >
        Debug
      </button>

      {/* Debug Panel Popover */}
      {isOpen && (
        <div className="fixed bottom-16 left-4 bg-white border border-gray-200 rounded-lg shadow-xl p-4 max-w-sm w-80 z-50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-900">Debug Panel</h4>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              {/* biome-ignore lint/a11y/noSvgWithoutTitle: This is a close icon button with aria-label */}
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-label="Close"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-600 mb-2">
                Valid Equations ({validEquations.length}):
              </p>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {validEquations.map((equation) => (
                  <div
                    key={equation.tiles.map((t) => t.label).join("")}
                    className="text-xs text-gray-700 font-mono bg-gray-50 px-2 py-1 rounded"
                  >
                    {equation.tiles.map((t) => t.label).join(" ")} ={" "}
                    {equation.result}
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onFinishRound();
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
            >
              Finish Round
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
