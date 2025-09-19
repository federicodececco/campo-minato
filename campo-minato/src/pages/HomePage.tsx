"use client";

import EndPopUp from "@/components/EndPopUp";
import GridForm from "@/components/GridForm";

export default function HomePage() {
  return (
    <div className="container relative">
      <EndPopUp victory={true} punteggio={20} punteggioMax={40}></EndPopUp>
      <div className="mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Campo Minato</h1>
        <GridForm></GridForm>
      </div>
    </div>
  );
}
