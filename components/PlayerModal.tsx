import React, { useState } from 'react';
import { Player } from '@/types/player';

interface PlayerModalProps {
  players: Player[];
  onClose: (selectedPlayerId: number | null) => void;
}

const formatSquad = (squad: number) => {
  if (squad === 1) return "1st XI";
  if (squad === 2) return "2nd XI";
  if (squad === 3) return "3rd XI";
  if (squad === 4) return "W\'s XI";
}

const PlayerModal: React.FC<PlayerModalProps> = ({ players, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);

  const filteredPlayers = players
    .filter(player => player.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-20">
      <div className="bg-black p-5 rounded-lg shadow max-w-md w-full m-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 p-2 w-full border rounded bg-gray-700 text-white"
        />
        <div className="overflow-y-auto max-h-60">
          {filteredPlayers.map(player => (
            <div
              key={player.playerid}
              className={`p-2 mb-1 ${selectedPlayerId === player.playerid ? 'bg-blue-800' : 'bg-black'} hover:bg-blue-800 cursor-pointer text-white`}
              onClick={() => {
                console.log("Selecting player:", player.playerid)
                setSelectedPlayerId(player.playerid)
              }
              }
            >
              <p className="text-gray-100 font-semibold">{player.name}</p>
              <p>
                <span className="text-gray-500">Price: £{player.price}m. </span>
                <span className="text-gray-500">{formatSquad(player.squad)}</span>
              </p>
            </div>
          ))}
        </div>
        <button
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded"
          onClick={() => onClose(selectedPlayerId)}
        >
          Submit
        </button>
        <button
          className="mt-4 ml-2 bg-gray-500 hover:bg-gray-700 text-black font-bold py-2 px-4 rounded"
          onClick={() => onClose(null)}
        >
          Close
        </button>
      </div>
    </div >
  );
};

export default PlayerModal;
