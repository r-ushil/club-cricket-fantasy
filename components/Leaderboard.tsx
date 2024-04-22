import { Team } from "@/types/team";

interface LeaderboardProps {
  teams: Team[];
}


export default function TeamDisplay({ teams }: LeaderboardProps) {
  const sortedTeams = teams.sort((a, b) => b.total - a.total);

  return (
    <div className="bg-gray-800 text-white rounded-lg shadow-md px-6 py-4">
      <h2>Leaderboard</h2>
      <ol>
        {sortedTeams.map(team => {
          return (
            <li key={team.uuid}>
              {team.fullname} - {team.teamname} - {team.total}
            </li>
          )
        })}
      </ol>
    </div>
  )
}