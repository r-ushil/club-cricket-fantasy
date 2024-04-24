import { Player } from "@/types/player";
import TshirtIcon from "./TshirtIcon";


interface PlayerButtonProps {
  onClick: (player: Player | null) => void;
  player: Player | null;
  index: number;
}

const formatSquad = (squad: number) => {
  if (squad === 4) {
    return "W";
  } else {
    return squad.toString();
  }
}

const PlayerButton: React.FC<PlayerButtonProps> = ({ onClick, player = null, index }) => {
  let shirtText = "+";
  let shirtColour = "gray-800";
  let name = "Select Player"

  if (player) {
    shirtText = formatSquad(player.squad);
    shirtColour = "blue-950"
    name = player.name;
  }


  return (
    <div className="flex flex-col items-center">
      <button
        className="relative"
        onClick={() => onClick(player)}
      >
        <TshirtIcon shirtText={shirtText} shirtColour={shirtColour} />
      </button>
      <span className="bg-gray-900 px-2 py-1 rounded-lg text-xs z-10 -mt-2">{name}</span>
      {player && <span className="bg-yellow-800 px-2 rounded-md text-xs z-0 ">£{player.price}m</span>}
    </div>
  );
};

export default PlayerButton;