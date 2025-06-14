"use client";

interface TargetTileProps {
  targetNumber: number;
}

export function TargetTile({ targetNumber }: TargetTileProps) {
  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-2 text-center">Target</h3>
      <div className="text-3xl font-bold text-center">{targetNumber}</div>
    </div>
  );
}
