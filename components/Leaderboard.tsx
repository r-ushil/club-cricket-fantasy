import { Team } from "@/types/team";

interface LeaderboardProps {
    teams: Team[];
}


export default function TeamDisplay({ teams }: LeaderboardProps) {
    const sortedTeams = teams.sort((a, b) => b.total - a.total);

    return (
        <div>
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