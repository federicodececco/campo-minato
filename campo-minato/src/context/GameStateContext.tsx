"use client";

import { Casella, Settings } from "@/lib/gridUtils";
import { LeaderBoardEntry } from "@/lib/supabase";
import { GameNarrator, GameStats, GameEvent } from "@/lib/geminiSerivice";
import { createContext, ReactNode, useContext, useRef, useState } from "react";

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
  narrator: GameNarrator;
  gameNarration: string;
  setGameNarration: Function;
  liveCommentary: string;
  setLiveCommentary: Function;
  isGeneratingNarration: boolean;
  setIsGeneratingNarration: Function;
  flagsUsed: number;
  setFlagsUsed: Function;
  explosions: number;
  setExplosions: Function;
  perfectMoves: number;
  setPerfectMoves: Function;
  riskyMoves: number;
  setRiskyMoves: Function;
  generateGameNarration: Function;
  addGameEvent: Function;
}
interface GameStateProviderChildrenInterface {
  children: ReactNode;
}

const narrator = new GameNarrator();

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
  narrator,
  gameNarration: "",
  setGameNarration: () => {
    throw new Error("setGameNarration called outside provider");
  },
  liveCommentary: "",
  setLiveCommentary: () => {
    throw new Error("setLiveCommentary called outside provider");
  },
  isGeneratingNarration: false,
  setIsGeneratingNarration: () => {
    throw new Error("setIsGeneratingNarration called outside provider");
  },
  flagsUsed: 0,
  setFlagsUsed: () => {
    throw new Error("setFlagsUsed called outside provider");
  },
  explosions: 0,
  setExplosions: () => {
    throw new Error("setExplosions called outside provider");
  },
  perfectMoves: 0,
  setPerfectMoves: () => {
    throw new Error("setPerfectMoves called outside provider");
  },
  riskyMoves: 0,
  setRiskyMoves: () => {
    throw new Error("setRiskyMoves called outside provider");
  },
  generateGameNarration: (): void => {},
  addGameEvent: (): void => {},
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
  const [gameNarration, setGameNarration] = useState("");
  const [liveCommentary, setLiveCommentary] = useState("");
  const [isGeneratingNarration, setIsGeneratingNarration] = useState(false);
  const [flagsUsed, setFlagsUsed] = useState(0);
  const [explosions, setExplosions] = useState(0);
  const [perfectMoves, setPerfectMoves] = useState(0);
  const [riskyMoves, setRiskyMoves] = useState(0);
  const narratorRef = useRef(narrator);

  function resetGameState(): void {
    setHasEnded(false);
    setTime(0);
    setScore(0);
    setMaxScore(0);
    setGameResetKey((prev) => prev + 1);
    setGameNarration("");
    setLiveCommentary("");
    setIsGeneratingNarration(false);
    setFlagsUsed(0);
    setExplosions(0);
    setPerfectMoves(0);
    setRiskyMoves(0);
    narratorRef.current.resetEvents();
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

  const addGameEvent = async (event: GameEvent) => {
    narratorRef.current.addGameEvent(event);

    if (["bomb_exploded", "near_miss", "game_won"].includes(event.type)) {
      try {
        const commentary = await narratorRef.current.generateLiveCommentary(
          event,
          {
            score,
            time,
            difficulty,
          }
        );
        setLiveCommentary(commentary);

        setTimeout(() => {
          setLiveCommentary("");
        }, 5000);
      } catch (error) {
        console.error("Errore nel generare commento live:", error);
      }
    }
  };
  const generateGameNarration = async () => {
    if (!grid) return;

    setIsGeneratingNarration(true);

    try {
      const totalCells = grid.length * grid[0].length;
      const revealedCells = grid.flat().filter((cell) => cell.turned).length;
      const bombsInGrid = grid.flat().filter((cell) => cell.bomba).length;

      const gameStats: GameStats = {
        score,
        time,
        difficulty,
        totalCells,
        revealedCells,
        flagsUsed,
        bombsFound: bombsInGrid,
        victory: hasEnded && explosions === 0,
        explosions,
        perfectMoves,
        riskyMoves,
      };

      const narration =
        await narratorRef.current.generateGameNarration(gameStats);
      setGameNarration(narration);
    } catch (error) {
      console.error("Errore nella generazione della narrazione:", error);
      setGameNarration(
        "Una partita memorabile che rimarrà negli annali del Campo Minato!"
      );
    } finally {
      setIsGeneratingNarration(false);
    }
  };

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
    narrator: narratorRef.current,
    gameNarration,
    setGameNarration,
    liveCommentary,
    setLiveCommentary,
    isGeneratingNarration,
    setIsGeneratingNarration,
    flagsUsed,
    setFlagsUsed,
    explosions,
    setExplosions,
    perfectMoves,
    setPerfectMoves,
    riskyMoves,
    setRiskyMoves,
    generateGameNarration,
    addGameEvent,
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
