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
  const [isExploding, setIsExploding] = useState(false);
  const { setHasEnded, setScore, score, setFetchedLeaderBoard, settings } =
    useGameStateContext();

  const fetchLeaderBoard = async () => {
    const difficultyQuery = settings ? settings.difficulty : "";
    try {
      const leaderBoardData = await getLeaderBoard(5, difficultyQuery);
      console.log(leaderBoardData);
      setFetchedLeaderBoard(leaderBoardData);
    } catch (error) {}
  };

  const handleCellClick = (row: number, col: number) => {
    if (isExploding || grid[row][col].turned) return;
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

  const handleCellRightClick = (row: number, col: number) => {
    if (isExploding || grid[row][col].turned) return;
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((gridRow, rowIndex) =>
        gridRow.map((cell, colIndex) => {
          if (rowIndex === row && colIndex === col) {
            return { ...cell, flag: !cell.flag };
          }
          return cell;
        })
      );
      return newGrid;
    });
  };
  const changeScore = (cell: Casella): void => {
    setScore(
      score + cell.proximity
    ); /* punteggio dato dal valore di prossimità */
  };

  const revealBombs = (): void => {
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((gridRow, rowIndex) =>
        gridRow.map((cell, colIndex) => {
          if (cell.bomba) return { ...cell, turned: true };
          return cell;
        })
      );
      return newGrid;
    });
  };

  const explosion = (): void => {
    if (isExploding) return;
    setIsExploding(true);
    revealBombs();
    let explosionDelay = 2000;
    setTimeout(() => {
      setHasEnded(true);
    }, explosionDelay);
  };

  const checkEnd = (grid: Casella[][]): boolean => {
    grid.forEach((row) => {
      row.forEach((elem) => {
        if (!elem.bomba && !elem.turned) {
          return false;
        }
      });
    });
    setHasEnded(true);
    return true; /* each card without a bomb on it has been turned  */
  };
  useEffect(() => {
    fetchLeaderBoard();
  }, []);
  useEffect(() => {
    setGrid(initialGrid);
    setIsExploding(false);
  }, [initialGrid]);

  return (
    <div
      className="grid gap-1 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-slate-600 shadow-xl animate-in fade-in-0 duration-500"
      style={{
        gridTemplateColumns: `repeat(${grid.length}, 1fr)`,
        maxWidth: `${grid.length * 50 + 48}px`, // 48px for padding
      }}
    >
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            onClick={(e) => handleCellClick(rowIndex, colIndex)}
          >
            <Card
              turned={cell.turned || false}
              proximity={cell.proximity || 0}
              bomba={cell.bomba || false}
              explosion={explosion}
              flag={cell.flag}
              onRightClick={() => handleCellRightClick(rowIndex, colIndex)}
            />
          </div>
        ))
      )}
    </div>
  );
}
