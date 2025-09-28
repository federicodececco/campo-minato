import { LeaderBoardEntry } from "@/lib/supabase";
import { useGameStateContext } from "@/context/GameStateContext";
import { Medal, Trophy } from "lucide-react";

export default function Classifica() {
  const { fetchedLeaderBoard } = useGameStateContext();

  if (!fetchedLeaderBoard) {
    return (
      <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl rounded-t-none w-full h-full flex items-center justify-center p-12 border border-slate-600">
        <div className="flex flex-col items-center space-y-4 animate-pulse">
          <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-amber-400 text-xl font-semibold">
            Caricamento classifica...
          </div>
          <div className="text-slate-400 text-sm">
            Recuperando i migliori punteggi
          </div>
        </div>
      </div>
    );
  }

  if (fetchedLeaderBoard.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl rounded-t-none w-full h-full flex items-center justify-center p-12 border border-slate-600">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="text-6xl opacity-50 animate-bounce">
            <Trophy />
          </div>
          <div className="text-amber-400 text-xl font-semibold">
            Nessun punteggio salvato
          </div>
          <div className="text-slate-400 text-sm max-w-xs">
            Sii il primo a completare una partita e a salvare il tuo punteggio!
          </div>
          <div className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm rounded-lg font-medium">
            Inizia una nuova partita
          </div>
        </div>
      </div>
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

  const getRankStyle = (index: number): string => {
    switch (index) {
      case 0:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900";
      case 1:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-gray-900";
      case 2:
        return "bg-gradient-to-r from-amber-600 to-amber-800 text-amber-100";
      default:
        return "bg-gradient-to-r from-slate-500 to-slate-600 text-slate-100";
    }
  };
  return (
    <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl rounded-t-none w-full border border-slate-600 overflow-hidden">
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-4">
        <div className="grid grid-cols-12 gap-2 text-center text-white font-bold text-sm md:text-base">
          <div className="col-span-2 flex items-center justify-center">
            <span className="text-lg"></span>
          </div>
          <div className="col-span-4 text-left">
            <span className="hidden md:inline"> </span>Giocatore
          </div>
          <div className="col-span-3">
            <span className="hidden md:inline"> </span>Punti
          </div>
          <div className="col-span-3">
            <span className="hidden md:inline"> </span>Tempo
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-600">
        {fetchedLeaderBoard.map((elem, index) => (
          <div
            key={`${elem.username}-${index}`}
            className="grid grid-cols-12 gap-2 p-3 hover:bg-slate-600/30 transition-all duration-200 group animate-in slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="col-span-2 flex items-center justify-center">
              <div
                className={`px-2 py-1 rounded-lg text-xs font-bold shadow-lg transform group-hover:scale-110 transition-transform duration-200 ${getRankStyle(index)}`}
              >
                <span className="mr-1">
                  <Medal />
                </span>
                {index + 1}°
              </div>
            </div>

            <div className="col-span-4 flex items-center text-left">
              <div className="flex flex-col">
                <span className="text-amber-400 font-semibold text-sm md:text-base truncate group-hover:text-amber-300 transition-colors duration-200">
                  {elem.username}
                </span>
                {index < 3 && (
                  <span className="text-xs text-slate-400 font-medium">
                    {index === 0
                      ? " Primo!"
                      : index === 1
                        ? " Secondo!"
                        : " Terzo!"}
                  </span>
                )}
              </div>
            </div>

            <div className="col-span-3 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <span className="text-green-400 font-bold text-sm md:text-lg group-hover:text-green-300 transition-colors duration-200">
                  {elem.score.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500">pts</span>
              </div>
            </div>

            <div className="col-span-3 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <span className="text-blue-400 font-mono font-semibold text-sm md:text-base group-hover:text-blue-300 transition-colors duration-200">
                  {formatTime(elem.time)}
                </span>
                <span className="text-xs text-slate-500">min</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
