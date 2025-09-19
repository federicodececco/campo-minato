"use client";

import { createContext, ReactNode, useContext, useState } from "react";

interface GameStateContextInterface {
  hasEnded: boolean;
  setHasEnded: Function;
}
interface GameStateProviderChildrenInterface {
  children: ReactNode;
}

const initalState: GameStateContextInterface = {
  hasEnded: false,
  setHasEnded: () => {
    throw new Error("setHasEnded called outside provider");
  },
};

const GameStateContext = createContext<GameStateContextInterface>(initalState);

export function GameStateProvider({
  children,
}: GameStateProviderChildrenInterface) {
  const [hasEnded, setHasEnded] = useState(false);
  const value = {
    hasEnded,
    setHasEnded,
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
