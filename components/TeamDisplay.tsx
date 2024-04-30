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
  if (squad === 4) return "W\'s XI";
}


export default function TeamDisplay({ userTeamInfo }: TeamDisplayProps) {

  const { teamInfo, players, swaps, currentGWPoints } = userTeamInfo;
  

  const swapsContent = swaps.map((swap) => (
    <li key={swap.oldplayername} className="flex items-center justify-between gap-2 text-center">
      {/* Desktop transfers display */}
      <div className="lg:flex hidden">
        <span className="lg:mr-4 mr-2 text-gray-400">{swap.oldplayername}</span>
        <span className="text-red-400">&#8594;</span> {/* Arrow symbol for swap */}
      </div>
      <div className="lg:flex hidden">
        <span className="lg:mr-4 mr-2 text-gray-200">{swap.newplayername}</span>
        <span className="text-green-400">&#8594;</span> {/* Arrow symbol for swap */}
      </div>

      {/* Mobile transfers display */}
      <div className="lg:hidden flex flex-col overflow-hidden">
        <span className="lg:mr-4 mr-auto text-gray-400">{swap.oldplayername}</span>
      </div>
      <div className="lg:hidden flex flex-col overflow-hidden">
        <span className="lg:mr-4 text-gray-200">{swap.newplayername}</span>
      </div>
    </li>
  ))

  return (
    <div className="bg-gradient-to-br from-black to-red-950 text-white rounded-lg shadow-lg shadow-gray-600/50 px-6 pt-4">
      <div className="flex justify-between">
        <h1 className="lg:text-3xl text-lg font-bold text-gray-200 break-all">{teamInfo.teamname}</h1>
        <p className="lg:text-2xl text-lg font-bold text-green-600">Total: {teamInfo.total}</p>
      </div>
      <div className="flex justify-between">
        <h2 className="lg:text-xl text-lg italic text-blue-600">{teamInfo.fullname}</h2>
        <p className="lg:text-xl text-sm font-semibold text-gray-200 italic">Current GW: {currentGWPoints}</p>
      </div>
      <div className="flex justify-between lg:mt-4 mt-2 mb-2">
        <h4 className="lg:text-xl text-base font-semibold">Team</h4>
        <button
          type="button"
          className="text-blue-500 border border-blue-700 rounded-lg text-sm px-4 py-1 text-center hover:text-white hover:bg-blue-600"
          onClick={() => window.location.href = "/edit-team"}
        >
          Edit
        </button>
      </div>
      <ul className="overflow-y-scroll h-[360px] pr-4 bg-gray-500 bg-opacity-20 rounded-lg p-4 mb-6">
        {players.map((player) => (
          <li key={player.playerid} className="flex items-center py-1 px-2 justify-between border rounded-md">
            <div className="flex flex-col">
              <span className="font-semibold text-white lg:text-base text-sm">{player.name}</span>
              <div className="flex">
                <span className="text-gray-400 whitespace-pre">£{player.price}m · </span>
                <span className="text-gray-400">{formatSquad(player.squad)}</span>
              </div>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-gray-300 lg:text-base text-sm font-semibold italic">Total: {player.total}</span>
              <span className="text-blue-400 lg:text-base text-sm font-semibold ">Current GW: {player.currentgw}</span>
            </div>
          </li>
        ))}
      </ul>

      <h4 className="text-lg font-medium">Transfers</h4>
      <ul className="list-disc pl-4 bg-gray-500 bg-opacity-20 rounded-lg p-4 mt-2 mb-6">
        {swaps.length > 0 ? <div className="flex justify-between lg:hidden">
          <span className="text-red-400">&#8594;</span> {/* Arrow symbol for swap */}
          <span className="text-green-400">&#8594;</span> {/* Arrow symbol for swap */}
        </div> : ""}
        {swaps.length > 0 ? swapsContent : <span className="text-gray-200">No transfers made</span>}
      </ul>
    </div>
  )
}