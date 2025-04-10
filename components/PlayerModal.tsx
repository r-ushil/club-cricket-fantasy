import React, { useState } from 'react';
import { Player } from '@/types/player';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { Input } from './ui/input';

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
    <Dialog open={true} onOpenChange={() => onClose(null)}>
      <DialogContent className="bg-black text-white max-w-md w-5/6 p-4 rounded-2xl shadow-2xl border border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">Select Player</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-2 bg-gray-900 text-white placeholder-gray-500 border border-gray-700 focus-visible:ring-blue-500"
        />
        <ScrollArea className="max-h-64 pr-2">
          <div className="space-y-1">
            {filteredPlayers.map((player) => (
              <div
                key={player.playerid}
                className={`px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors border border-transparent ${selectedPlayerId === player.playerid
                  ? "bg-blue-600"
                  : "bg-gray-900 hover:bg-gray-800"
                  }`}
                onClick={() => setSelectedPlayerId(player.playerid)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{player.name}</span>
                  <span className="text-xs text-gray-400">
                    £{player.price}m • {formatSquad(player.squad)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <Button
          // className="bg- hover:bg-blue-500 text-white"
          onClick={() => onClose(selectedPlayerId)}
        >
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerModal;
