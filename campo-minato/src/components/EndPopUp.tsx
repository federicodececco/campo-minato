import { faL } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import Star from "./Star";
import Classifica from "./Classifica";

interface EndInterface {
  victory: boolean;
  punteggio: number;
  punteggioMax?: number;
}

export default function EndPopUp({
  victory,
  punteggio,
  punteggioMax,
}: EndInterface) {
  const [displayedScore, setDisplayedScore] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showStars, setShowStars] = useState(false);
  const [activeTab, setActiveTab] =
    useState(true); /* true= puntegigo, false classifica */

  const calculateStars = () => {
    if (!punteggioMax || punteggioMax === 0) return 3;

    const percentage = (punteggio / punteggioMax) * 100;
    if (percentage >= 90) return 3;
    if (percentage >= 70) return 2;
    if (percentage >= 50) return 1;
    return 0;
  };
  const starsNumber = calculateStars();

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
          startValue + (punteggio - startValue) * easeOutQuart
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
  }, [punteggio]);

  return (
    <>
      <div className="bg-black/70 absolute top-0 h-screen w-screen z-10">
        <div className="text-white absolute top-[50%] left-[50%] -translate-1/2">
          {/* center popup */}
          <div className="border-3 border-black rounded-2xl p-1 bg-amber-300 w-xl h-100 grid grid-rows-10">
            {/* button container */}
            <div className="grid grid-cols-2 gap-0 w-full row-span-1 ">
              <button
                className="bg-green-700 rounded-tl-2xl w-full col-span-1 border-r border-black"
                onClick={() => setActiveTab(true)}
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
                <section className="bg-green-700 py-10 px-40 rounded-2xl rounded-t-none w-full h-full">
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
                  <button>salva</button>
                  <button>nuova partita</button>
                </section>
              )}
              {!activeTab && <Classifica />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
