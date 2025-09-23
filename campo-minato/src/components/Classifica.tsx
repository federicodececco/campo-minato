const fake = [
  {
    name: "gigio",
    punteggio: 30,
  },
  {
    name: "gigetto",
    punteggio: 40,
  },
  {
    name: "gigione",
    punteggio: 10,
  },
  {
    name: "gigigigiato",
    punteggio: 20,
  },
];

import { LeaderBoardEntry } from "@/lib/supabase";
import { useGameStateContext } from "@/context/GameStateContext";
import { time } from "console";
interface LeaderBoardEntryInterface {
  leaderBoardArray: LeaderBoardEntry[];
}

export default function Classifica() {
  const { fetchedLeaderBoard } = useGameStateContext();

  if (!fetchedLeaderBoard) {
    return (
      <>
        <div className="bg-purple-300 py-20 px-30 rounded-2xl rounded-t-none w-full h-full flex items-center justify-center">
          <div className="text-yellow-700 text-xl">
            Caricamento classifica...
          </div>
        </div>
      </>
    );
  }

  if (fetchedLeaderBoard.length === 0) {
    return (
      <>
        <div className="bg-purple-300 py-20 px-30 rounded-2xl rounded-t-none w-full h-full flex items-center justify-center">
          <div className="text-yellow-700 text-xl">
            Nessun punteggio salvato
          </div>
        </div>
      </>
    );
  }

  const formatTime = (timeToFormat: number): string => {
    const minutes = Math.floor(timeToFormat / 60);
    const seconds = timeToFormat % 60;
    if (seconds < 10) {
      if (minutes < 10) {
        return `0${minutes}:0${seconds}`;
      }
      return `${minutes}:0${seconds}`;
    } else {
      if (minutes < 10) {
        return `0${minutes}:${seconds}`;
      }
      return `${minutes}:${seconds}`;
    }
  };

  return (
    <>
      <section className="bg-purple-300 py-20 px-30 rounded-2xl rounded-t-none w-full h-full">
        <div className="grid grid-cols-15  text-center text-yellow-700 text-xl  pb-2">
          <div className="col-span-1"></div>
          <div className="col-span-8 border-x-1">giocatore</div>
          <div className="col-span-3"> punti </div>
          <div className="col-span-3 border-x-1">tempo</div>
        </div>
        <div className="grid grid-cols-15 text-center text-yellow-700 text-xl border-b-2 border-l-2 border-r-2">
          {fetchedLeaderBoard.map((elem, index) => {
            return (
              <div key={`${elem.username}-${index}`} className="contents">
                <div className="col-span-1 py-2 border-t-2 px-2">
                  {index + 1 + "°"}
                </div>
                <div className="col-span-8 py-2 border-t-2">
                  {elem.username}
                </div>
                <div className="col-span-3 py-2 border-t-2">{elem.score}</div>
                <div className="col-span-3 py-2 border-t-2">
                  {formatTime(elem.time)}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
