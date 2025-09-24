interface ButtonStyle {
  color: string;
  value: string;
  isActive: boolean;
  onClick?: () => void;
}

export default function Buttons({
  color,
  value,
  isActive,
  onClick,
}: ButtonStyle) {
  const baseClasses = "px-3 py-1 text-lg duration-400 rounded-lg text-black";

  const getButtonClass = () => {
    const baseClass =
      "px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50";

    switch (color) {
      case "green":
        return `${baseClass} bg-btn-easy text-white hover:bg-btn-easy`;
      case "yellow":
        return `${baseClass} bg-btn-medium text-white hover:bg-btn-medium`;
      case "red":
        return `${baseClass} bg-btn-hard text-white hover:bg-btn-hard`;
      default:
        return `${baseClass} bg-slate-500 hover:bg-slate-600 text-white`;
    }
  };

  return (
    <button
      className={`${getButtonClass()} ${isActive ? "ring-2 ring-white" : ""} animate-in slide-in-from-top-4 duration-300`}
      onClick={onClick}
    >
      {value}
    </button>
  );
}
