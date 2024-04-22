import { Team } from "@/types/team";
import { Swap } from "@/types/swap";
import { Player } from "@/types/player";

interface UserTeamInfo {
    teamInfo: Team;
    players: Player[];
    swaps: Swap[];
    currentGWPoints: number;
}

interface TeamDisplayProps {
    userTeamInfo: UserTeamInfo;
}


export default function TeamDisplay({ userTeamInfo }: TeamDisplayProps) {

    const { teamInfo, players, swaps, currentGWPoints } = userTeamInfo;

    return (
        <div>
            <h2>{teamInfo.fullname}</h2>
            <h3>{teamInfo.teamname}</h3>
            <h4>{teamInfo.total}</h4>
            <h5>Players</h5>
            <ul>
                {players.map(player => {
                    return (
                        <li key={player.playerid}>
                            {player.name} - {player.price} - {player.squad}
                        </li>
                    )
                })}
            </ul>
            <h5>Swaps</h5>
            <ul>
                {swaps.map(swap => {
                    return (
                        <li key={swap.oldplayername}>
                            {swap.oldplayername} -{">"} {swap.oldplayername}
                        </li>
                    )
                })}
            </ul>

            <h5>Current GW Points</h5>
            <p>{currentGWPoints}</p>

        </div>
    )
}