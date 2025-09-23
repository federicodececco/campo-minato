import { useGameStateContext } from "@/context/GameStateContext";
import { useEffect, useState } from "react";

export default function TimeCounter() {
  const { time, setTime, hasEnded, gameResetkey } = useGameStateContext();
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
  }, [gameResetkey, setTime]);

  useEffect(() => {
    if (hasEnded) {
      setIsActive(false);
    }
    if (!hasEnded) {
      setIsActive(true);
    }
  }, [hasEnded]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  return (
    <div className="text-2xl font-bold text-gray-800 bg-gray-200 px-4 py-2 rounded-lg border-2 border-gray-400">
      {formatTime(time)}
    </div>
  );
}
