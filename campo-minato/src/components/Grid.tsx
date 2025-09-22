"use client";

import { Casella } from "@/lib/gridUtils";
import Card from "./Card";
import { useEffect, useState } from "react";
import { useGameStateContext } from "@/context/GameStateContext";
import { getLeaderBoard } from "@/lib/supabase";
interface GridInterface {
  grid: Casella[][];
}

export default function GridComponent({ grid: initialGrid }: GridInterface) {
  const [grid, setGrid] = useState(initialGrid);
  const { setHasEnded, setScore, score, setFetchedLeaderBoard } =
    useGameStateContext();

  const fetchLeaderBoard = async () => {
    try {
      const leaderBoardData = await getLeaderBoard(5);
      console.log(leaderBoardData);
      setFetchedLeaderBoard(leaderBoardData);
    } catch (error) {}
  };

  const handleCellClick = (row: number, col: number) => {
    grid[row][col].turned = true;

    if (!grid[row][col].bomba) {
      changeScore(grid[row][col]);
    }

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
  function changeScore(cell: Casella): void {
    setScore(
      score + cell.proximity
    ); /* punteggio dato dal valore di prossimità */
  }

  function explosion(): void {
    console.log("kaboom");
    setHasEnded(true);
  }

  function checkEnd(grid: Casella[][]): boolean {
    grid.forEach((row) => {
      row.forEach((elem) => {
        if (!elem.bomba && !elem.turned) {
          return false;
        }
      });
    });
    setHasEnded(true);
    return true; /* each card without a bomb on it has been turned  */
  }
  useEffect(() => {
    fetchLeaderBoard();
  }, []);
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
