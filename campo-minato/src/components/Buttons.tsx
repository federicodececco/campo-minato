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

  const getColorClasses = () => {
    switch (color) {
      case "green":
        return "bg-emerald-400 hover:bg-emerald-700 hover:text-white";
      case "yellow":
        return "bg-yellow-400 hover:bg-yellow-700 hover:text-white";
      case "red":
        return "bg-red-400 hover:bg-red-700 hover:text-white";
      default:
        return "bg-gray-400 hover:bg-gray-700 hover:text-white";
    }
  };

  return (
    <button className={`${baseClasses} ${getColorClasses()}`} onClick={onClick}>
      {value}
    </button>
  );
}
