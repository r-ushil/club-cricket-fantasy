import { Player } from "@/types/player";
import TshirtIcon from "./TshirtIcon";


interface PlayerButtonProps {
  onClick: (player: Player | null) => void;
  player: Player | null;
}

const formatSquad = (squad: number) => {
  if (squad === 4) {
    return "W";
  } else {
    return squad.toString();
  }
}

const PlayerButton: React.FC<PlayerButtonProps> = ({ onClick, player = null }) => {
  let shirtText = "+";
  let selected = false;
  let name = "Select Player"

  if (player) {
    selected = true;
    shirtText = formatSquad(player.squad);
    name = player.name;
  }


  return (
    <div className="flex flex-col items-center">
      <button
        className="relative"
        onClick={() => onClick(player)}
      >
        <TshirtIcon shirtText={shirtText} selected={selected} />
      </button>
      <span className="bg-gray-900 px-2 py-1 rounded-lg text-xs text-white z-10 -mt-1">{name}</span>
      {player && <span className="bg-yellow-800 px-2 rounded-md text-xs text-white z-0 ">£{player.price}m</span>}
    </div>
  );
};

export default PlayerButton;