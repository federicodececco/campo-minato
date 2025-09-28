import { useGameStateContext } from "@/context/GameStateContext";
import { MessageCircle, Sparkles } from "lucide-react";

export default function Commentary() {
  const { liveCommentary } = useGameStateContext();

  if (!liveCommentary) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-40 max-w-sm animate-in slide-in-from-right-4 duration-300">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-xl shadow-2xl border border-purple-400/50 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 bg-white/20 rounded-full p-2 animate-pulse">
            <MessageCircle size={20} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={16} className="text-yellow-300 animate-spin" />
              <span className="text-sm font-bold text-yellow-300">
                AI Commentator
              </span>
            </div>

            <p className="text-sm leading-relaxed font-medium">
              {liveCommentary}
            </p>
          </div>
        </div>

        <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full animate-[shrink_5s_linear_forwards]"
            style={{
              animation: "shrink 5s linear forwards",
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
