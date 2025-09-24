import { faL } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import Star from "./Star";
import Classifica from "./Classifica";
import { useGameStateContext } from "@/context/GameStateContext";
import { LeaderBoardEntry, saveScore } from "@/lib/supabase";
interface EndInterface {
  victory: boolean;
  handleClosePopUp: () => void;
  punteggioMax: number;
}

export default function EndPopUp({
  victory,
  punteggioMax,
  handleClosePopUp,
}: EndInterface) {
  const [displayedScore, setDisplayedScore] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showStars, setShowStars] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] =
    useState(true); /* true= puntegigo, false classifica */
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ username: "" });
  const [leaderBoard, setLeaderBoard] = useState([]);
  const { score, difficulty, resetGameState, time, settings } =
    useGameStateContext();
  const newGame = (): void => {
    resetGameState();
    handleClosePopUp();
  };
  const calculateStars = () => {
    if (!punteggioMax || punteggioMax === 0) return 3;

    const percentage = (score / punteggioMax) * 100;
    if (percentage >= 90) return 3;
    if (percentage >= 70) return 2;
    if (percentage >= 50) return 1;
    return 0;
  };
  const starsNumber = calculateStars();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getFinalMessage = (): string => {
    if (score >= punteggioMax / 3 / 2) {
      return "Quasi Perfetto!";
    } else if (score >= punteggioMax / 2) {
      return "Ottimo Lavoro!";
    } else if (score === punteggioMax) {
      return "VITTORIA!";
    } else {
      return "Potevi fare di meglio...";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log(settings?.difficulty);
      const entry = new LeaderBoardEntry(
        formData.username,
        score,
        settings?.difficulty,
        time,
        1
      );
      const newEntry = await saveScore(entry);
      console.log(newEntry);
    } catch (error) {
      console.error("errore", error);
    } finally {
      setIsLoading(false);
      newGame();
    }
  };

  const handleCancel = (e) => {
    e.preventDefaut();
    newGame();
  };

  useEffect(() => {
    setIsAnimating(true);

    const animateCounter = () => {
      const duration = 2000; /* 2 seconds */
      const startTime = performance.now();
      const startValue = 0;

      const updateCounter = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeOutQuart = 1 - Math.pow(1 - progress, 4);

        const current = Math.floor(
          startValue + (score - startValue) * easeOutQuart
        );
        setDisplayedScore(current);

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          setIsAnimating(false);
          /* stars */
          setTimeout(() => setShowStars(true), 500);
        }
      };

      requestAnimationFrame(updateCounter);
    };
    /* initial delay to prevent the score to skyrocket on component load */
    const timer = setTimeout(animateCounter, 300);

    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-popup rounded-2xl border-2 border-slate-600 shadow-2xl max-w-2xl w-full animate-bounce-in">
        {isSaving ? (
          <div className="p-8 text-center">
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-3xl font-bold text-white mb-6">
                Ottimo punteggio!
              </h2>
              <p className="text-slate-300 text-lg">
                Inserisci il tuo username per salvare il punteggio
              </p>

              <input
                type="text"
                name="username"
                value={formData.username}
                placeholder="Il tuo username..."
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all duration-200"
              />

              <div className="flex gap-4 justify-center">
                <button
                  type="submit"
                  disabled={isLoading || !formData.username.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Salvando...
                    </span>
                  ) : (
                    "Salva Punteggio"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsSaving(false)}
                  className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Annulla
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl">
            {/* Tab Navigation */}
            <div className="grid grid-cols-2 bg-slate-800">
              <button
                className={`py-4 px-6 font-semibold text-lg transition-all duration-200 ${
                  activeTab
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
                onClick={() => setActiveTab(true)}
              >
                Risultato
              </button>

              <button
                className={`py-4 px-6 font-semibold text-lg transition-all duration-200 ${
                  !activeTab
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
                onClick={() => setActiveTab(false)}
              >
                Classifica
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              {activeTab ? (
                <div className="text-center space-y-6">
                  <h2 className="text-4xl font-bold text-white mb-4">
                    {getFinalMessage()}
                  </h2>

                  <div className="bg-score-gradient text-6xl font-bold animate-gradient-shift">
                    {displayedScore.toLocaleString()}
                  </div>

                  <div className="flex justify-center space-x-2 mb-6">
                    {[0, 1, 2].map((index) => (
                      <Star
                        key={index}
                        index={index}
                        filled={index < calculateStars()}
                        showStars={showStars}
                      />
                    ))}
                  </div>

                  <div className="text-slate-300 space-y-2">
                    <p className="text-lg">
                      {displayedScore.toLocaleString()} /{" "}
                      {punteggioMax?.toLocaleString() ||
                        displayedScore.toLocaleString()}{" "}
                      punti
                    </p>
                    <p className="text-xl font-semibold text-amber-400">
                      {/*! da implementare     {getScoreMessage(calculateStars())}  */}
                    </p>
                  </div>

                  <div className="flex gap-4 justify-center pt-6">
                    <button
                      onClick={() => newGame()}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                      Nuova Partita
                    </button>

                    <button
                      onClick={() => setIsSaving(true)}
                      className="px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                      Salva Punteggio
                    </button>
                  </div>
                </div>
              ) : (
                <Classifica />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
