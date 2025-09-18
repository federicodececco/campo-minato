"use client";

import { Casella } from "@/lib/gridUtils";

interface GridInterface {
  grid: Casella[][];
}

export default function GridComponent({ grid }: GridInterface) {
  const handleCellClick = (row: number, col: number) => {
    console.log(`Clicked cell: ${row}, ${col}`);
    console.log(`Bomba: ${grid[row][col].bomba}`);
    console.log(`Prossimità: ${grid[row][col].prossimità}`);
  };

  return (
    <div
      className="grid gap-1 p-4"
      style={{
        gridTemplateColumns: `repeat(${grid.length}, 1fr)`,
        maxWidth: `${grid.length * 40}px`,
      }}
    >
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <button
            key={`${rowIndex}-${colIndex}`}
            onClick={() => handleCellClick(rowIndex, colIndex)}
            className="w-8 h-8 border border-gray-400 bg-gray-200 hover:bg-gray-300 text-black text-sm font-bold flex items-center justify-center"
          >
            {cell.bomba ? "boom" : cell.prossimità > 0 ? cell.prossimità : ""}
          </button>
        ))
      )}
    </div>
  );
}
