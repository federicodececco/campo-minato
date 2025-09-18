"use client";

import { Casella } from "@/lib/gridUtils";
import Card from "./Card";
import { useEffect, useState } from "react";

interface GridInterface {
  grid: Casella[][];
}

export default function GridComponent({ grid: initialGrid }: GridInterface) {
  const [grid, setGrid] = useState(initialGrid);

  const handleCellClick = (row: number, col: number) => {
    grid[row][col].turned = true;

    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((gridRow, rowIndex) =>
        gridRow.map((cell, colIndex) => {
          if (rowIndex === row && colIndex === col) {
            return { ...cell, turned: true };
          }
          return cell;
        })
      );
      return newGrid;
    });
  };

  function explosion(): void {
    console.log("kaboom");
  }
  useEffect(() => {
    setGrid(initialGrid);
  }, [initialGrid]);

  return (
    <div
      className="grid gap-1 p-4 bg-white"
      style={{
        gridTemplateColumns: `repeat(${grid.length}, 1fr)`,
        maxWidth: `${grid.length * 40}px`,
      }}
    >
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            onClick={() => handleCellClick(rowIndex, colIndex)}
          >
            <Card
              turned={cell.turned || false}
              proximity={cell.proximity || 0}
              bomba={cell.bomba || false}
              explosion={explosion}
            />
          </div>
        ))
      )}
    </div>
  );
}
