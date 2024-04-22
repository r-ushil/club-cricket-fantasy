import { Team } from "@/types/team";
import { Swap } from "@/types/swap";
import { Player } from "@/types/player";

interface TeamDisplayProps {
    userTeamInfo: Team;
    players: Player[];
    swaps: Swap[];
}


export default function TeamDisplay({ userTeamInfo, players, swaps }: TeamDisplayProps) {
    return (
        <div>
            <h2>{userTeamInfo.fullname}</h2>
            <h3>{userTeamInfo.teamname}</h3>
            <h4>{userTeamInfo.total}</h4>
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
                        <li key={swap.oldplayerid}>
                            {swap.oldplayerid} - {swap.newplayerid}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}