"use client";

import EndPopUp from "@/components/EndPopUp";
import GridForm from "@/components/GridForm";
import { useEffect } from "react";
import { useGameStateContext } from "@/context/GameStateContext";
export default function HomePage() {
  const { hasEnded, setHasEnded } = useGameStateContext();

  const handleClosePopUp = () => {
    setHasEnded(false);
  };

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

        <GridForm></GridForm>
      </div>
    </div>
  );
}
