interface pulseProps {
  color: "Green" | "Yellow" | "Red"; // color of the pulsing circle, as Green, Yellow, Red
}
export default function Pulse({ color }: pulseProps) {
  //choose a bg-color based on the color prop
  let bgColor = "";
  if (color === "Green") {
    bgColor = "bg-green-400";
  } else if (color === "Yellow") {
    bgColor = "bg-yellow-400";
  } else if (color === "Red") {
    bgColor = "bg-red-400";
  }
  return (
    <span className="relative flex h-3 w-3 mr-2">
      <span
        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${bgColor}`}
      ></span>
      <span
        className={`relative inline-flex rounded-full h-3 w-3 ${bgColor}`}
      ></span>
    </span>
  );
}
