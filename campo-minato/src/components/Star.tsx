interface StarInterface {
  showStars: boolean;
  index: number;
  filled: boolean;
}

export default function Star({ showStars, index, filled }: StarInterface) {
  return (
    <div
      className={`text-5xl transition-all duration-500 transform ${
        showStars ? "scale-100 opacity-100" : "scale-0 opacity-0"
      }`}
      style={{
        transitionDelay: showStars ? `${index * 200}ms` : "0ms",
      }}
    >
      <span
        className={`${filled ? "text-yellow-400 drop-shadow-lg animate-pulse" : "text-slate-500"}`}
      >
        {filled ? "⭐" : "☆"}
      </span>
    </div>
  );
}
