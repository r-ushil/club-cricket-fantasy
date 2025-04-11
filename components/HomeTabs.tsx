"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Team } from "@/types/team"
import { PlayerWithScore } from "@/types/player"
import { Swap } from "@/types/swap"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import TeamDisplay from "./TeamDisplay"
import Leaderboard from "./Leaderboard"

interface UserTeamInfo {
  teamInfo: Team
  players: PlayerWithScore[]
  swaps: Swap[]
  currentGWPoints: number
  captainName: string
  newCaptainName: string | null
}

interface HomeTabsProps {
  userTeamInfo: UserTeamInfo
  teams: Team[]
}

export default function HomeTabs({ userTeamInfo, teams }: HomeTabsProps) {
  const [tab, setTab] = useState("team")

  return (
    <Tabs value={tab} onValueChange={setTab} className="lg:w-2/3 w-full mx-auto px-4 lg:px-16">
      <TabsList className="relative flex justify-center bg-white/5 backdrop-blur-md rounded-xl shadow-sm overflow-hidden w-fit mx-auto mb-6">
        <TabsTrigger
          value="team"
          className="group relative px-6 py-2 text-sm md:text-base font-medium text-zinc-300 transition-all rounded-xl duration-300 ease-in-out hover:text-white data-[state=active]:text-white"
        >
          My Team
          <span className="absolute left-0 bottom-0 h-0.5 w-full bg-white scale-x-0 group-data-[state=active]:scale-x-100 transition-transform origin-left duration-300"></span>
        </TabsTrigger>
        <TabsTrigger
          value="leaderboard"
          className="group relative px-6 py-2 text-sm md:text-base font-medium text-zinc-300 transition-all rounded-xl duration-300 ease-in-out hover:text-white data-[state=active]:text-white"
        >
          Leaderboard
          <span className="absolute left-0 bottom-0 h-0.5 w-full bg-white scale-x-0 group-data-[state=active]:scale-x-100 transition-transform origin-left duration-300"></span>
        </TabsTrigger>
      </TabsList>


      <div className="relative min-h-[600px]">
        <AnimatePresence mode="wait">
          {tab === "team" && (
            <TabsContent value="team" forceMount>
              <motion.div
                key="team"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="flex justify-center"
              >
                <TeamDisplay userTeamInfo={userTeamInfo} />
              </motion.div>
            </TabsContent>
          )}

          {tab === "leaderboard" && (
            <TabsContent value="leaderboard" forceMount>
              <motion.div
                key="leaderboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <Leaderboard teams={teams} />
              </motion.div>
            </TabsContent>
          )}
        </AnimatePresence>
      </div>
    </Tabs>
  )
}
