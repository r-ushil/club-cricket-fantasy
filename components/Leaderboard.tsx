"use client"

import { Team } from "@/types/team"
import { ArrowDownCircle, ArrowUpCircle, Minus, Circle } from "lucide-react"
import { motion } from "framer-motion"

interface LeaderboardProps {
  teams: Team[]
}

export default function TeamDisplay({ teams }: LeaderboardProps) {
  const sortedTeams = teams.sort((a, b) => a.position - b.position)

  const getFormIcon = (form: boolean | null) => {
    if (form === null) return <Minus className="text-gray-500 w-4 h-4" />
    if (form === true) return <ArrowUpCircle className="text-green-500 w-4 h-4" />
    if (form === false) return <ArrowDownCircle className="text-red-500 w-4 h-4" />
    return <Circle className="text-blue-500 w-4 h-4" />
  }

  const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05 }
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-gradient-to-br from-zinc-900 via-black to-zinc-800 border border-zinc-700 shadow-2xl rounded-3xl px-6 py-6 w-full text-white space-y-4"
    >
      <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-100 text-center">
        ICUCC LEADERBOARD
      </h1>

      <ul className="max-h-[560px] overflow-y-auto space-y-2 pr-2">
        {sortedTeams.map((team, i) => (
          <motion.li
            key={team.uuid}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={i}
            className="grid grid-cols-[40px_1fr_60px] items-center px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl hover:bg-zinc-700 transition-all"
          >
            {/* Form + Position */}
            <div className="flex items-center gap-2">
              {getFormIcon(team.form)}
              <span className="font-semibold text-white text-sm lg:text-base">{team.position}</span>
            </div>

            {/* Team Name + Full Name */}
            <div className="flex flex-col px-2 text-left ml-2">
              <span className="font-bold text-white text-sm lg:text-base">{team.teamname}</span>
              <span className="italic text-zinc-400 text-xs lg:text-sm">{team.fullname}</span>
            </div>

            {/* Score */}
            <span className="font-semibold text-zinc-300 text-sm lg:text-base text-right pr-1">
              {team.total}
            </span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}
