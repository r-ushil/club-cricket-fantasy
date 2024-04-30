"use client";
import { useEffect, useState } from "react";
import PlayerButton from "./PlayerButton";
import PlayerModal from "./PlayerModal";
import { Player } from "@/types/player";

interface PlayerSelectGridProps {
  selectedPlayers: (Player | null)[];
  allPlayers: Player[];
  captainPlayer: Player | null;
  onSelect: (newPlayers: (Player | null)[]) => void;
  onSubmit: (newPlayers: Player[], captain: Player) => void;
}

const validateTeam = (selectedPlayers: (Player | null)[], captainPlayer: (Player | null)) => {
  if (captainPlayer === null) {
    return false;
  }

  if (selectedPlayers.some(player => player === null)) {
    return false;
  }

  // if there aren't 4 of each squad return false
  for (let i = 1; i <= 4; i++) {
    if (selectedPlayers.filter(player => player?.squad === i).length !== 4) {
      return false;
    }
  }

  // if total price is over 80 return false
  const totalPrice = selectedPlayers.reduce((acc, player) => acc + (player?.price || 0), 0);
  if (totalPrice > 80) {
    return false;
  }

  return true;

}

const PlayerSelectGrid = ({ selectedPlayers, allPlayers, captainPlayer, onSelect, onSubmit }: PlayerSelectGridProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectablePlayers, setSelectablePlayers] = useState<Player[]>(allPlayers);
  const [selectedOldPlayerId, setSelectedOldPlayerId] = useState<number | null>(null);
  const [captain, setCaptain] = useState<Player | null>(allPlayers.find(player => player.playerid === captainPlayer?.playerid) || null);

  const handleCaptainSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const playerId = event.target.value;
    const player = allPlayers.find(player => player.playerid === parseInt(playerId)) || null;
    setCaptain(player);
  };

  useEffect(() => {
    setSelectablePlayers(allPlayers.filter(player => !selectedPlayers.includes(player)));
  }, [modalOpen]);

  const handlePlayerSelect = (playerId: number | null) => {
    setModalOpen(false);

    const newPlayer = selectablePlayers.find(player => player.playerid === playerId) || null;

    if (selectedOldPlayerId !== null) {
      selectedPlayers[selectedOldPlayerId] = newPlayer;
    }
    onSelect(selectedPlayers);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="grid lg:grid-cols-4 gap-8 mt-8 grid-cols-2">
        {selectedPlayers.map((player, i) => (
          <div key={i}>
            <PlayerButton player={player} onClick={() => {
              setSelectedOldPlayerId(i);
              setModalOpen(true);
            }} />
          </div>
        ))}
      </div>
      {modalOpen && <PlayerModal players={selectablePlayers} onClose={handlePlayerSelect} />}

      {/* Select  */}
      <select
        id="captain"
        className="mt-6 bg-gray-500 bg-opacity-40 border border-gray-500 text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5"
        onChange={handleCaptainSelect}
        value={ captain?.name ?? "Select Captain"}
      >
        <option className="bg-gray-800 text-white" value="">{captain?.name ?? "Select Captain"}</option>
        {selectedPlayers.map((player, index) => (
          <option key={index} value={player?.playerid} className="bg-gray-800">{player?.name}</option>
        ))}
      </select>

      <button
        className="my-8 bg-blue-800 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
        onClick={async () => {
          // Validate team
          if (!validateTeam(selectedPlayers, captain)) {
            alert("Please ensure you have selected 4 players from each squad, that your team is under £80m and a captain.");
          } else {
            await onSubmit(selectedPlayers as Player[], captain as Player);
          }
        }}
      >Confirm
      </button>
    </div>
  );
};

export default PlayerSelectGrid;