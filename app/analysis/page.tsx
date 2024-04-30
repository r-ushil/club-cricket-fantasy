import { PlayerWithScore } from "@/types/player";
import { Team } from "@/types/team";
import { UserPlayer } from "@/types/userplayer";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

// Dream Team -> Players With Score -> Players with 16 highest currentgw (4 from each squad)
// Scout -> UserPlayers (highest picks) -> Players most picked by users

const getDreamTeam = (players: PlayerWithScore[]) => {

    const ones = players.filter(player => player.squad === 1).sort((a, b) => b.currentgw - a.currentgw).slice(0, 4);
    const twos = players.filter(player => player.squad === 2).sort((a, b) => b.currentgw - a.currentgw).slice(0, 4);
    const threes = players.filter(player => player.squad === 3).sort((a, b) => b.currentgw - a.currentgw).slice(0, 4);
    const womans = players.filter(player => player.squad === 4).sort((a, b) => b.currentgw - a.currentgw).slice(0, 4);

    return ones.concat(twos, threes, womans);

}

const getScout = (userplayers: UserPlayer[], players: PlayerWithScore[]): {player: PlayerWithScore, count: number}[] => {

  const scout = userplayers.map(player => player.playerid).reduce((acc, playerid) => {
        const player = players.find(player => player.playerid === playerid)!;
        const existing = acc.find(p => p.player.playerid === playerid);
        if (existing) {
            existing.count++;
        } else {
            acc.push({ player, count: 1 });
        }
        return acc;
    }, [] as {player: PlayerWithScore, count: number}[]);
    // sort the scout by count
    return scout.sort((a, b) => b.count - a.count).slice(0, 10);

}

const getSupabaseInfo = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    } else {

        const { data: playersObj } = await supabase.from("players").select("*");

        const players: PlayerWithScore[] = playersObj!.map(player => {
            return {
                playerid: player.playerid,
                name: player.name,
                price: player.price,
                squad: player.squad,
                currentgw: player.currentgw,
                total: player.total
            }
        }
        );

        const { data: userplayersObj } = await supabase.from("userplayers").select("*");

        const userplayers: UserPlayer[] = userplayersObj!.map(player => {
            return {
                uuid: player.uuid,
                playerid: player.playerid,
                captain: player.captain
            }
        });

        
        const { data: teamsObj } = await supabase.from("users").select("*");

        const teams: Team[] = teamsObj!.map(team => {
            return {
                uuid: team.uuid,
                fullname: team.fullname,
                teamname: team.teamname,
                total: team.total,
                position: team.position,
                form: team.form,
                nextcapt: team.nextcapt
            }
        });

        return { players, userplayers, teams };1
    }
}   


export default async function Analysis() {

    const { players, userplayers, teams } = await getSupabaseInfo();

    const dreamTeam = getDreamTeam(players);
    const playersWithCount = getScout(userplayers, players);
    
    return (
        <div>
            <h1>Analysis</h1>
            <h2>Dream Team</h2>
            <ul>
                {dreamTeam.map(player => <li key={player.playerid}>{player.name} - {player.currentgw}</li>)}
            </ul>

            <h2>Scout</h2>
            <ul>
                {playersWithCount.map(scout => <li key={scout.player.playerid}>{scout.player.name} - {scout.count}</li>)}
            </ul>

        </div>
    )
}