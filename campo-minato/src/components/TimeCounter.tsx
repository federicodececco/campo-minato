import { useGameStateContext } from "@/context/GameStateContext";
import { useEffect, useState } from "react";

export default function TimeCounter() {
  const { time, setTime, hasEnded, gameResetKey } = useGameStateContext();
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && !hasEnded) {
      interval = setInterval(() => {
        setTime((prevTime: number) => prevTime + 1);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, hasEnded, setTime]);

  useEffect(() => {
    setTime(0);
    setIsActive(true);
  }, [gameResetKey, setTime]);

  useEffect(() => {
    setIsActive(!hasEnded);
  }, [hasEnded]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  return (
    <div className="bg-timer text-3xl font-mono font-bold px-6 py-3 rounded-xl border-2 border-slate-600 text-amber-400 shadow-lg animate-in slide-in-from-top-4 duration-300">
      <span className="drop-shadow-lg"> {formatTime(time)}</span>
    </div>
  );
}
