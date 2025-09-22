"use client";

import { Casella, Settings } from "@/lib/gridUtils";
import { LeaderBoardEntry } from "@/lib/supabase";
import { createContext, ReactNode, useContext, useState } from "react";

interface GameStateContextInterface {
  hasEnded: boolean;
  setHasEnded: Function;
  score: number;
  setScore: Function;
  time: number;
  setTime: Function;
  difficulty: string;
  setDifficulty: Function;
  maxScore: number;
  setMaxScore: Function;
  grid: Casella[][] | undefined;
  setGrid: Function;
  fetchedLeaderBoard: LeaderBoardEntry[] | undefined;
  setFetchedLeaderBoard: Function;
  settings: Settings | undefined;
  setSettings: Function;
  resetGameState: Function;
  gameResetKey: number;
}
interface GameStateProviderChildrenInterface {
  children: ReactNode;
}

const initalState: GameStateContextInterface = {
  hasEnded: false,
  setHasEnded: () => {
    throw new Error("setHasEnded called outside provider");
  },
  score: 0,
  setScore: () => {
    throw new Error("setScore called outside provider");
  },
  time: 0,
  setTime: () => {
    throw new Error("setTime called outside provider");
  },
  difficulty: "",
  setDifficulty: () => {
    throw new Error("setDifficulty called outside provider");
  },
  maxScore: 0,
  setMaxScore: () => {
    throw new Error("setMaxScore called outside provider");
  },
  grid: undefined,
  setGrid: () => {
    throw new Error("setGrid called outside provider");
  },
  fetchedLeaderBoard: undefined,
  setFetchedLeaderBoard: () => {
    throw new Error("setGrid called outside provider");
  },
  settings: undefined,
  setSettings: () => {
    throw new Error("setSettings called outside provider");
  },
  resetGameState: (): void => {},
  gameResetKey: 0,
};

const GameStateContext = createContext<GameStateContextInterface>(initalState);

export function GameStateProvider({
  children,
}: GameStateProviderChildrenInterface) {
  const [hasEnded, setHasEnded] = useState(false);
  const [time, setTime] = useState(0);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState("");
  const [maxScore, setMaxScore] = useState(0);
  const [grid, setGrid] = useState<Casella[][] | undefined>(undefined);
  const [settings, setSettings] = useState<Settings | undefined>(undefined);
  const [gameResetKey, setGameResetKey] = useState(0);
  const [fetchedLeaderBoard, setFetchedLeaderBoard] = useState();

  function resetGameState(): void {
    setHasEnded(false);
    setTime(0);
    setScore(0);
    setMaxScore(0);
    setGameResetKey((prev) => prev + 1);
    if (grid) {
      const newGrid = grid.map((row) =>
        row.map((cell) => ({
          ...cell,
          turned: false,
        }))
      );
      setGrid(newGrid);
    }
  }

  const value = {
    hasEnded,
    setHasEnded,
    score,
    setScore,
    time,
    setTime,
    difficulty,
    setDifficulty,
    maxScore,
    setMaxScore,
    grid,
    setGrid,
    fetchedLeaderBoard,
    setFetchedLeaderBoard,
    settings,
    setSettings,
    resetGameState,
    gameResetKey,
  };
  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
}
export function useGameStateContext() {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error(
      "useGameStateContext must be used inside GameStateProvider"
    );
  }
  return context;
}
