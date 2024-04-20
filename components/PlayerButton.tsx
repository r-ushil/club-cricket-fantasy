interface Player {
  id: number;
  name: string;
  price: number;
  squad: number;
}

interface PlayerButtonProps {
  onClick: (player: Player | null) => void;
  player: Player | null;
  index: number;
}

const PlayerButton: React.FC<PlayerButtonProps> = ({ onClick, player = null, index }) => {
  return (
    <button
      type="button"
      onClick={() => onClick(player)}
      className="w-full whitespace-pre py-2 px-6 text-center bg-gray-800 hover:bg-gray-600 text-sm font-medium rounded focus:outline-none"
    >
      {player ? `${player.name}` : `${index + 1}. Select\nPlayer`}
    </button>
  );
};

export default PlayerButton;