"use client";

import EndPopUp from "@/components/EndPopUp";
import GridForm from "@/components/GridForm";
import { useEffect, useState } from "react";
import { useGameStateContext } from "@/context/GameStateContext";
import TimeCounter from "@/components/TimeCounter";
export default function HomePage() {
  const { hasEnded, setHasEnded, grid } = useGameStateContext();
  const [showTimer, setShowTimer] = useState(false);

  const handleClosePopUp = () => {
    setHasEnded(false);
  };

  useEffect(() => {
    // Mostra il timer solo quando la griglia è stata generata
    setShowTimer(!!grid);
  }, [grid]);

  useEffect(() => {}, [hasEnded]);

  return (
    <div className="container relative">
      {hasEnded && (
        <EndPopUp
          victory={true}
          punteggioMax={40}
          onClose={handleClosePopUp}
        ></EndPopUp>
      )}
      <div className="mx-auto p-4 w-screen">
        <h1 className="text-2xl font-bold mb-4">Campo Minato</h1>
        {showTimer && <TimeCounter />}
        <GridForm></GridForm>
      </div>
    </div>
  );
}
