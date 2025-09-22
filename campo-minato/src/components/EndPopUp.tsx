import { faL } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import Star from "./Star";
import Classifica from "./Classifica";
import { useGameStateContext } from "@/context/GameStateContext";
import { LeaderBoardEntry, saveScore } from "@/lib/supabase";
interface EndInterface {
  victory: boolean;
  handleClosePopUp: () => void;
  punteggioMax?: number;
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
    handleClosePopUp;
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
    <>
      <div className="bg-black/70 absolute top-0 h-screen w-screen z-10">
        <div className="text-white absolute top-[50%] left-[50%] -translate-1/2">
          {/* center popup */}
          {isSaving ? (
            <>
              <div className="bg-green-600/50 border-4 border-amber-400 w-md h-40 relative rounded-4xl">
                <form
                  onSubmit={handleSubmit}
                  action=""
                  className=" flex flex-col items-center absolute top-[50%] left-[50%] -translate-[50%]"
                >
                  <div className="text-center text-xl pb-4 ">
                    Inserisci un username
                  </div>
                  <div className="text-center text-lg rounded-lg border-2 border-amber-400">
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      placeholder="username"
                      className="placeholder:pl-2"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-3 pt-4 ">
                    <button
                      type="submit"
                      className="col-span-1 text-xl border px-3 rounded text-amber-400 hover:bg-amber-400 duration-500"
                    >
                      Salva
                    </button>
                    <button
                      className="  text-lg col-start-3 col-span-1 text-red-700   font-bold hover:bg-red-700 rounded-xl duration-500"
                      onClick={handleCancel}
                    >
                      Cancella
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <>
              <div className="border-3 border-black rounded-2xl p-1 bg-amber-300 w-xl h-100 grid grid-rows-10">
                {/* button container */}
                <div className="grid grid-cols-2 gap-0 w-full row-span-1 ">
                  <button
                    className="bg-green-700 rounded-tl-2xl w-full col-span-1 border-r border-black"
                    onClick={() => {
                      setActiveTab(true);
                      handleClosePopUp();
                    }}
                  >
                    partita
                  </button>
                  <button
                    className="bg-purple-300 rounded-tr-2xl w-full col-span-1  border-l border-black"
                    onClick={() => setActiveTab(false)}
                  >
                    classifica
                  </button>
                </div>
                {/* page container */}
                <div className="row-span-9">
                  {activeTab && (
                    <section className="bg-green-700 py-10 px-20 rounded-2xl rounded-t-none w-full h-full">
                      <div></div>
                      Hai Vinto!
                      <div className="relative">
                        <div
                          className={`text-6xl text-white bg-clip-text bg-gradient-to-r transition-all duration-300 ${
                            isAnimating ? "animate-pulse" : "scale-110"
                          }`}
                        >
                          {displayedScore.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-center space-x-2 ">
                          {[0, 1, 2].map((index) => (
                            <Star
                              index={index}
                              filled={index < starsNumber}
                              showStars={showStars}
                              key={index}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-gray-400">
                          <p>
                            {displayedScore.toLocaleString()} /
                            {punteggioMax
                              ? punteggioMax.toLocaleString()
                              : displayedScore.toLocaleString()}
                          </p>
                          <p className="pt-1">
                            {starsNumber === 3 && (
                              <span className="text-yellow-400 font-bold">
                                Perfetto!
                              </span>
                            )}
                            {starsNumber === 2 && (
                              <span className="text-yellow-400 font-bold">
                                Ottimo lavoro!
                              </span>
                            )}
                            {starsNumber === 1 && (
                              <span className="text-yellow-400 font-bold">
                                Ben fatto!
                              </span>
                            )}
                            {starsNumber === 0 && (
                              <span className="text-yellow-400">
                                Puoi fare meglio!
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className=" grid grid-cols-5 pt-8">
                        <button
                          onClick={() => newGame()}
                          className="text-xl bg-amber-300 text-green-700 border-black border p-2 col-span-2 rounded-xl hover:bg-green-700 hover:text-amber-300 hover:border-0"
                        >
                          Nuova Partita
                        </button>
                        <button
                          onClick={() => {
                            setIsSaving(true);
                          }}
                          className="col-start-4 col-span-2 hover:bg-amber-300 border-black hover:border p-2 text-lg rounded-xl hover:text-green-700 bg-green-700 text-amber-300 border-0"
                        >
                          salva
                        </button>
                      </div>
                    </section>
                  )}
                  {!activeTab && <Classifica />}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
