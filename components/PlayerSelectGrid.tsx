"use client";
import { useState } from "react";
import PlayerButton from "./PlayerButton";
import PlayerModal from "./PlayerModal";

interface Player {
  id: number;
  name: string;
  price: number;
  squad: number;
}


interface PlayerSelectGridProps {
  selectedPlayers: (Player | null)[];
  allPlayers: Player[];
}

const PlayerSelectGrid = ({ selectedPlayers, allPlayers }: PlayerSelectGridProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOldPlayerId, setSelectedOldPlayerId] = useState<number | null>(null);
  const [selectedNewPlayerId, setSelectedNewPlayerId] = useState<number | null>(null);

  const handlePlayerSelect = (playerId: number | null) => {
    setSelectedNewPlayerId(playerId);
    setModalOpen(false);
  };

  console.log("Selected:", selectedPlayers)
  console.log("All:", allPlayers)

  return (
    <div>
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
      {modalOpen && <PlayerModal players={allPlayers} onClose={handlePlayerSelect} />}
      {selectedNewPlayerId && <p className="text-white">Selected new player: {allPlayers[selectedNewPlayerId].name}</p>}
    </div>
  );
};

export default PlayerSelectGrid;