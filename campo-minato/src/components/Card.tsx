interface CardInterface {
  turned: boolean;
  proximity: number;
  bomba: boolean;
  explosion: Function;
  onRightClick: Function;
  flag: boolean;
}

import { Bomb, FlagTriangleRight } from "lucide-react";
export default function Card({
  turned,
  proximity,
  bomba,
  explosion,
  flag,
  onRightClick,
}: CardInterface) {
  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!turned && onRightClick) {
      onRightClick();
    }
  };

  if (turned && bomba) {
    explosion();
    return (
      <>
        <div className="w-10 h-10 flex items-center justify-center bg-cell-bomb border-2 border-red-600 rounded-lg animate-pulse-glow">
          <Bomb data-testid="bomb-icon" />
        </div>
      </>
    );
  }

  if (turned) {
    const getProximityColor = (num: number) => {
      const colors = {
        1: "text-blue-500",
        2: "text-green-500",
        3: "text-red-500",
        4: "text-purple-500",
        5: "text-yellow-500",
        6: "text-pink-500",
        7: "text-gray-700",
        8: "text-black",
      };
      return colors[num] || "text-gray-500";
    };
    return (
      <div className="w-10 h-10 flex items-center justify-center bg-cell-revealed border border-slate-300 rounded-lg shadow-inner">
        <span className={`font-bold text-lg ${getProximityColor(proximity)}`}>
          {proximity > 0 ? proximity : ""}
        </span>
      </div>
    );
  }
  if (turned) {
    const getProximityColor = (num: number) => {
      const colors = {
        1: "text-blue-400",
        2: "text-green-400",
        3: "text-red-400",
        4: "text-purple-400",
        5: "text-yellow-400",
        6: "text-pink-400",
        7: "text-gray-400",
        8: "text-black",
      };
      return colors[num] || "text-gray-400";
    };

    return (
      <div className="cell-revealed">
        <span className={`font-bold ${getProximityColor(proximity)}`}>
          {proximity > 0 ? proximity : ""}
        </span>
      </div>
    );
  }

  return (
    <div
      data-testid="card"
      className="w-10 h-10 bg-cell-unrevealed border-2 border-slate-700 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 hover:bg-zinc-500 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center"
      onContextMenu={handleRightClick}
    >
      {flag && <FlagTriangleRight className="text-red-500 w-6 h-6" />}
    </div>
  );
}
