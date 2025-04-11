"use client"

import { Team } from "@/types/team"
import { Swap } from "@/types/swap"
import { PlayerWithScore } from "@/types/player"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Crown, ArrowRightLeft, Users } from "lucide-react"
import { motion } from "framer-motion"

interface UserTeamInfo {
  teamInfo: Team
  players: PlayerWithScore[]
  swaps: Swap[]
  currentGWPoints: number
  captainName: string
  newCaptainName: string | null
}

interface TeamDisplayProps {
  userTeamInfo: UserTeamInfo
}

const formatSquad = (squad: number) => {
  return ["", "1st XI", "2nd XI", "3rd XI", "W's XI"][squad] || ""
}

// Animation presets
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05 }
  })
}

export default function TeamDisplay({ userTeamInfo }: TeamDisplayProps) {
  const { teamInfo, players, swaps, currentGWPoints, captainName, newCaptainName } = userTeamInfo
  const captainTransfer = newCaptainName !== null && captainName !== newCaptainName

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full"
    >
      <Card className="bg-gradient-to-br from-zinc-900 via-black to-zinc-800 border border-zinc-700 shadow-2xl rounded-3xl p-6 w-full text-white space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{teamInfo.teamname}</h1>
            <p className="text-zinc-400 text-sm italic">{teamInfo.fullname}</p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-yellow-400 text-lg font-semibold">Total: {teamInfo.total}</p>
            <p className="text-zinc-300 text-sm">GW Points: {currentGWPoints}</p>
          </div>
        </div>

        {/* Squad header */}
        <div className="flex justify-between items-center border-t border-zinc-700 pt-4">
          <div className="flex items-center gap-2 text-lg font-medium">
            <Users className="w-5 h-5 text-blue-400" />
            <span>Squad</span>
          </div>
          <Button
            variant="outline"
            className="text-blue-500 border-blue-600 hover:bg-blue-600 hover:text-white"
            onClick={() => window.location.href = "/edit-team"}
          >
            Edit
          </Button>
        </div>

        {/* Player list */}
        <ScrollArea className="h-[360px] pr-2">
          <ul className="space-y-3">
            {players.map((player, i) => {
              const isCaptain = player.name === captainName
              return (
                <motion.li
                  key={player.playerid}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  custom={i}
                  className="flex justify-between items-center px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl hover:bg-zinc-700 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-white text-sm lg:text-base">{player.name}</p>
                      {isCaptain && <Crown className="w-4 h-4 text-yellow-400" />}
                    </div>
                    <p className="text-zinc-400 text-xs">
                      £{player.price}m · {formatSquad(player.squad)}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-medium text-white">Total: {player.total}</p>
                    <p className="text-xs text-blue-400">
                      GW: {player.currentgw}
                      {isCaptain && <span className="ml-1 text-yellow-400">(x2)</span>}
                    </p>
                  </div>
                </motion.li>
              )
            })}
          </ul>
        </ScrollArea>

        {/* Transfers */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-lg font-medium">
            <ArrowRightLeft className="w-5 h-5 text-purple-400" />
            <span>Transfers</span>
          </div>

          <CardContent className="bg-zinc-800 rounded-xl border border-zinc-700 p-4 space-y-3">
            {swaps.length > 0 || captainTransfer ? (
              <>
                {swaps.map((swap, i) => (
                  <motion.div
                    key={swap.oldplayername}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={i}
                    className="flex justify-between text-sm text-zinc-300"
                  >
                    <span className="text-red-400 line-through">{swap.oldplayername}</span>
                    <span className="text-green-400 font-medium">{swap.newplayername}</span>
                  </motion.div>
                ))}
                {captainTransfer && (
                  <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={swaps.length}
                    className="flex justify-between text-sm text-yellow-400"
                  >
                    <span className="line-through text-zinc-400">{captainName} (C)</span>
                    <span className="font-semibold">{newCaptainName} (C)</span>
                  </motion.div>
                )}
              </>
            ) : (
              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="text-sm text-zinc-400"
              >
                No transfers made
              </motion.p>
            )}
          </CardContent>
        </div>
      </Card>
    </motion.div>
  )
}