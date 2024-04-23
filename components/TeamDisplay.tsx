"use client";
import { Team } from "@/types/team";
import { Swap } from "@/types/swap";
import { PlayerWithScore } from "@/types/player";

interface UserTeamInfo {
  teamInfo: Team;
  players: PlayerWithScore[];
  swaps: Swap[];
  currentGWPoints: number;
}

interface TeamDisplayProps {
  userTeamInfo: UserTeamInfo;
}

const formatSquad = (squad: number) => {
  if (squad === 1) return "1st XI";
  if (squad === 2) return "2nd XI";
  if (squad === 3) return "3rd XI";
  if (squad === 4) return "Women\'s";
}


export default function TeamDisplay({ userTeamInfo }: TeamDisplayProps) {

  const { teamInfo, players, swaps, currentGWPoints } = userTeamInfo;

  const totalPoints = players.reduce((acc, player) => acc + player.currentgw, 0) + teamInfo.total;

  return (
    <div className="bg-gradient-to-br from-black to-red-950 text-white rounded-lg shadow-md px-6 pt-4">
      <div className="flex justify-between">
        <h1 className="md:text-3xl text-lg font-bold text-blue-600">{teamInfo.teamname}</h1>
        <p className="md:text-2xl text-lg font-bold text-green-400">Total Points: { totalPoints }</p>


      </div>
      <div className="flex justify-between">
        <h2 className="md:text-xl text-lg italic text-gray-300">{teamInfo.fullname}</h2>
        <p className="md:text-xl text-lg font-semibold text-gray-200 italic">Current GW: {currentGWPoints}</p>
      </div>

      <div className="flex justify-between mt-4 mb-1">
        <h4 className="text-xl font-semibold">Team</h4>
        <button
          type="button"
          className="text-blue-500 hover:text-white hover:bg-blue-600 border border-blue-700 rounded-lg text-sm px-4 py-1 text-center mb-2 border-red-500 "
          onClick={() => window.location.href = "/edit-team"}
        >
          Edit
        </button>
      </div>
      <ul className="overflow-y-scroll h-[360px] pr-4 bg-gray-500 bg-opacity-20 rounded-lg p-4 mb-6">
        {players.map((player) => (
          <li key={player.playerid} className="flex items-center py-1 px-2 justify-between border rounded-md">
            <div className="flex flex-col">
              <span className="font-semibold">{player.name}</span>
              <div className="flex">
                <span className="text-gray-400 whitespace-pre">£{player.price}m · </span>
                <span className="text-gray-400">{formatSquad(player.squad)}</span>
              </div>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-blue-400 md:text-base text-sm font-semibold ">Current GW: {player.currentgw}</span>
              <span className="text-gray-400 md:text-base text-sm font-semibold italic">Total: {player.total}</span>
            </div>
          </li>
        ))}
      </ul>

      <h4 className="text-lg font-medium">Transfers</h4>
      <ul className="list-disc pl-4 bg-gray-500 bg-opacity-20 rounded-lg p-4 mt-2 mb-6">
        {swaps.map((swap) => (
          <li key={swap.oldplayername} className="flex items-center justify-between">
            <div className="flex">
              <span className="md:mr-4 mr-2 text-gray-400">{swap.oldplayername}</span>
              <span className="text-red-400">&#8594;</span> {/* Arrow symbol for swap */}
            </div>
            <div>
              <span className="md:mr-4 mr-2 text-gray-200">{swap.newplayername}</span>
              <span className="text-green-400">&#8594;</span> {/* Arrow symbol for swap */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}