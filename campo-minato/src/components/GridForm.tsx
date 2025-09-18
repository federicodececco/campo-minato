"use client";

import { FormEvent, useState } from "react";
import { generateGrid, Casella, Grid } from "@/lib/gridUtils";
import GridComponent from "./Grid";
export default function GridForm() {
  const [grid, setGrid] = useState<Casella[][] | null>(null);
  const [formData, setFormData] = useState({
    length: 0,
  });

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
    const length = formData.length;
    const newGrid = new Grid(length);
    const displayGrid = generateGrid(newGrid);
    setGrid(displayGrid);
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-4">
        <label htmlFor="length" className="block mb-2">
          Inserisci lunghezza della tabella
        </label>
        <input
          type="number"
          name="length"
          id="length"
          min="3"
          max="20"
          required
          className="border border-white text-white bg-transparent mx-2 px-2 py-1"
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="border border-white text-white px-4 py-1 hover:bg-white hover:text-black"
        >
          Genera Griglia
        </button>
      </form>

      {grid && <GridComponent grid={grid} />}
    </div>
  );
}
