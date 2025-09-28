"use client";
import Commentary from "@/components/Commentary";
import EndPopUp from "@/components/EndPopUp";
import GridForm from "@/components/GridForm";
import { useEffect, useState } from "react";
import { useGameStateContext } from "@/context/GameStateContext";
import TimeCounter from "@/components/TimeCounter";
import { Comme } from "next/font/google";
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
    <div className="min-h-screen bg-game-gradient p-4">
      <Commentary />
      <div className="max-w-6xl mx-auto">
        {hasEnded && (
          <EndPopUp
            victory={true}
            punteggioMax={40}
            handleClosePopUp={handleClosePopUp}
          />
        )}

        <div className="text-center mb-8 space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 animate-in slide-in-from-top-4 duration-500">
            Campo Minato
          </h1>
          <p className="text-slate-300 text-xl md:text-2xl max-w-2xl mx-auto animate-in slide-in-from-top-8 duration-700">
            Scopri tutte le celle senza far esplodere le mine!
            <br />
            <span className="text-amber-400 font-semibold">
              L'Attenzione è chiave!
            </span>
          </p>
        </div>

        <div className="flex flex-col items-center space-y-8">
          {showTimer && (
            <div className="animate-in slide-in-from-top-8 duration-500">
              <TimeCounter />
            </div>
          )}

          <div className="w-full max-w-6xl">
            <GridForm />
          </div>
        </div>
      </div>
    </div>
  );
}
