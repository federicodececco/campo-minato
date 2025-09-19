interface StarInterface {
  showStars: boolean;
  index: number;
  filled: boolean;
}

export default function Star({ showStars, index, filled }: StarInterface) {
  return (
    <div
      className={`text-6xl transition-all duration-500 transform ${
        showStars ? "scale-100 opacity-100" : "scale-0 opacity-0"
      }`}
      style={{
        transitionDelay: showStars ? `${index * 200}ms` : "0ms",
      }}
    >
      {filled ? (
        <span className="text-yellow-400 drop-shadow-lg animate-pulse">★</span>
      ) : (
        <span className="text-white-600">☆</span>
      )}
    </div>
  );
}
