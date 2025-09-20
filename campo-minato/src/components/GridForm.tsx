"use client";

import { useState } from "react";
import { generateGrid, Casella, Grid, Settings } from "@/lib/gridUtils";
import GridComponent from "./Grid";
import { useGameStateContext } from "@/context/GameStateContext";
export default function GridForm() {
  const [formData, setFormData] = useState({
    length: 0,
  });
  const { resetGameState, setSettings, grid, setGrid, gameResetKey } =
    useGameStateContext();

  function handleInputChange(e) {
    const { name, value } = e.currentTarget;
    console.log(formData.length);

    setFormData((prev) => ({
      ...prev,
      [name]: parseInt(value) || 0,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    resetGameState();
    const length = formData.length;
    const newGrid = new Grid(length);
    const displayGrid = generateGrid(newGrid);
    const set = new Settings(length, "easy");
    setSettings(set);
    setGrid(displayGrid);
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="mb-4">
        <label htmlFor="length" className="block mb-2">
          Inserisci la dimensione del lato della tabella
        </label>
        <input
          type="number"
          name="length"
          id="length"
          min="3"
          max="20"
          required
          className="border border-black text-black bg-slate-400 mx-2 px-2 py-1"
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="border border-black text-black px-4 py-1 hover:bg-black hover:text-black"
        >
          Genera Griglia
        </button>
      </form>
      {grid && <GridComponent grid={grid} key={gameResetKey} />}
    </div>
  );
}
