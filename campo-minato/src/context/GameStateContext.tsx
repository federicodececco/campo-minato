"use client";

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
};

const GameStateContext = createContext<GameStateContextInterface>(initalState);

export function GameStateProvider({
  children,
}: GameStateProviderChildrenInterface) {
  const [hasEnded, setHasEnded] = useState(false);
  const [time, setTime] = useState(0);
  const [score, setScore] = useState(0);
  const [difficutly, setDifficulty] = useState("");
  const [maxScore, setMaxScore] = useState(0);
  const value = {
    hasEnded,
    setHasEnded,
    score,
    setScore,
    time,
    setTime,
    difficutly,
    setDifficulty,
    maxScore,
    setMaxScore,
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
