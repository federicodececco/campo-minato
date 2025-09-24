"use client";

import { useState } from "react";
import { generateGrid, Casella, Grid, Settings } from "@/lib/gridUtils";
import GridComponent from "./GridComponent";
import { useGameStateContext } from "@/context/GameStateContext";
import Buttons from "./Buttons";
export default function GridForm() {
  const [dimension, setDimension] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const {
    resetGameState,
    setSettings,
    grid,
    setGrid,
    gameResetKey,
    setDifficulty,
  } = useGameStateContext();

  function handleSubmit(e) {
    e.preventDefault();
    resetGameState();
    const length = dimension;
    const newGrid = new Grid(length);
    const displayGrid = generateGrid(newGrid);
    const set = new Settings(length, selectedDifficulty);
    setSettings(set);
    setDifficulty(selectedDifficulty);
    setGrid(displayGrid);
  }
  const handleEasyClick = () => {
    setDimension(10);
    setSelectedDifficulty("easy");
  };
  const handleMediumClick = () => {
    setDimension(9);
    setSelectedDifficulty("medium");
  };

  const handleHardClick = () => {
    setDimension(7);
    setSelectedDifficulty("hard");
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center space-y-6"
      >
        <label className="text-2xl font-semibold text-white text-center animate-in slide-in-from-top-4 duration-300">
          Scegli la difficoltà di gioco
        </label>

        <div className="flex flex-wrap gap-4 justify-center animate-in slide-in-from-bottom-4 duration-500">
          <Buttons
            color="green"
            value="Easy"
            isActive={selectedDifficulty === "easy"}
            onClick={handleEasyClick}
          />
          <Buttons
            color="yellow"
            value="Medium"
            isActive={selectedDifficulty === "medium"}
            onClick={handleMediumClick}
          />
          <Buttons
            color="red"
            value="Hard"
            isActive={selectedDifficulty === "hard"}
            onClick={handleHardClick}
          />
        </div>
      </form>

      {grid && (
        <div className="animate-in slide-in-from-bottom-8 duration-700">
          <GridComponent grid={grid} key={gameResetKey} />
        </div>
      )}
    </div>
  );
}
