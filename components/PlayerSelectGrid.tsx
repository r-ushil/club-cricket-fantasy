"use client";
import { useEffect, useState } from "react";
import PlayerButton from "./PlayerButton";
import PlayerModal from "./PlayerModal";
import { Player } from "@/types/player";

interface PlayerSelectGridProps {
  selectedPlayers: (Player | null)[];
  allPlayers: Player[];
  onSelect: (newPlayers: (Player | null)[]) => void;
  onSubmit: (newPlayers: Player[]) => void;
}

const PlayerSelectGrid = ({ selectedPlayers, allPlayers, onSelect, onSubmit }: PlayerSelectGridProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectablePlayers, setSelectablePlayers] = useState<Player[]>(allPlayers);
  const [selectedOldPlayerId, setSelectedOldPlayerId] = useState<number | null>(null);

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
    <div className="items-center">
      <div className="grid grid-cols-4 gap-4 mt-8">
        {selectedPlayers.map((player, i) => (
          <div key={i}>
            <PlayerButton index={i} player={player} onClick={() => {
              setSelectedOldPlayerId(i);
              setModalOpen(true);
            }} />
          </div>
        ))}
      </div>
      {modalOpen && <PlayerModal players={selectablePlayers} onClose={handlePlayerSelect} />}
      <button
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded"
        onClick={async () => {
          // Validate team
          if (selectedPlayers.some(player => player === null)) {
            alert("Please select all players before submitting your team.");
          } else {
            await onSubmit(selectedPlayers as Player[]);
          }
        }}
      >Submit
      </button>
    </div>
  );
};

export default PlayerSelectGrid;