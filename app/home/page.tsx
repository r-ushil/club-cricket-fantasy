import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { Team } from "@/types/team";
import { Swap } from "@/types/swap";
import { Player } from "@/types/player";
import TeamDisplay from "@/components/TeamDisplay";
import Leaderboard from "@/components/Leaderboard";

interface userTeamInfo {
  teamInfo: Team;
  players: Player[];
  swaps: Swap[];
  currentGWPoints: number;
}

const getSupabaseInfo = async () => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  } else {
    const players: Player[] = await getTeamPlayers(supabase, user.id);
    const swaps: Swap[] = await getSwaps(supabase, user.id);
    const teams: Team[] = await getTeams(supabase, user.id);
    const currentGWPoints = await getCurrentGWPoints(supabase, players);

    const userTeamInfo: userTeamInfo = {
      teamInfo: teams.find(team => team.uuid === user.id)!,
      players: players,
      swaps: swaps,
      currentGWPoints: currentGWPoints
    }
    
    return { userTeamInfo, teams };
  }

}

const getCurrentGWPoints = async (supabase: SupabaseClient<any, "public", any>, players: Player[]): Promise<number> => {

  const { data: playersObjs } = await supabase.from("players").select("currentgw").in("playerid", players.map(player => player.playerid));

  if (!playersObjs || playersObjs.length === 0) {
    return 0;
  }

  const points = playersObjs.reduce((acc, player) => acc + player.currentgw, 0);

  return points;

}

const getTeamPlayers = async (supabase: SupabaseClient<any, "public", any>, userId: string): Promise<Player[]> => {
  const { data: playerIds } = await supabase.from("userplayers").select("playerid").eq("uuid", userId);

  // get player objects from playerIds
  if (!playerIds || playerIds.length === 0) {
    return [];
  }
  const { data: players } = await supabase.from("players").select("*").in("playerid", playerIds.map(player => player.playerid));

  // convert players to an array of Player objects
  if (!players || players.length === 0) {
    return [];
  }
  const playersArray = players.map(player => {
    return {
      playerid: player.playerid,
      name: player.name,
      price: player.price,
      squad: player.squad
    }
  });


  return playersArray;
}

const getTeams = async (supabase: SupabaseClient<any, "public", any>, userId: string): Promise<Team[]> => {
  const { data: teams } = await supabase.from("users").select("*")

  const teamsArray = teams!.map(team => {
    return {
      uuid: team.id,
      fullname: team.fullname,
      teamname: team.teamname,
      total: team.total
    }
  });
  
  return teamsArray;
}

 const getSwaps = async (supabase: SupabaseClient<any, "public", any>, userId: string): Promise<Swap[]> => {
  const { data: swaps } = await supabase.from("swaps").select("oldplayerid, newplayerid").eq("uuid", userId);

  // convert swaps to an array of Swap objects
  if (!swaps || swaps.length === 0) {
    return [];
  }

  const swapsArray = swaps.map(swap => {
    return {
      oldplayerid: swap.oldplayerid,
      newplayerid: swap.newplayerid
    }
  });

  return swapsArray;
 } 

export default async function Home() {

  const { userTeamInfo, teams } = await getSupabaseInfo();

  return (
    <div>
      <h1>Home</h1>
      <TeamDisplay userTeamInfo={userTeamInfo} />
      <Leaderboard teams={teams} />
    </div>
  );
}