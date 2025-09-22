"use client";

import { useState } from "react";
import { generateGrid, Casella, Grid, Settings } from "@/lib/gridUtils";
import GridComponent from "./Grid";
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
    setDimension(15);
    setSelectedDifficulty("medium");
  };

  const handleHardClick = () => {
    setDimension(20);
    setSelectedDifficulty("hard");
  };
  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="mb-4">
        <label htmlFor="length" className="block mb-2">
          Scegli la difficoltà di gioco
        </label>

        <Buttons
          color={"green"}
          value={"Easy"}
          isActive={false}
          onClick={handleEasyClick}
        ></Buttons>

        <Buttons
          color={"yellow"}
          value={"Medium"}
          isActive={false}
          onClick={handleMediumClick}
        ></Buttons>
        <Buttons
          color={"red"}
          value={"Hard"}
          isActive={false}
          onClick={handleHardClick}
        ></Buttons>
      </form>
      {grid && <GridComponent grid={grid} key={gameResetKey} />}
    </div>
  );
}
