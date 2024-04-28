import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { Team } from "@/types/team";
import { Swap } from "@/types/swap";
import { PlayerWithScore } from "@/types/player";
import TeamDisplay from "@/components/TeamDisplay";
import Leaderboard from "@/components/Leaderboard";
import NavBar from "@/components/NavBar";
import { Suspense } from "react";
import Loading from "@/components/Loading";
import Announcement from "@/components/Announcement";

interface userTeamInfo {
  teamInfo: Team;
  players: PlayerWithScore[];
  swaps: Swap[];
  currentGWPoints: number;
}

const getSupabaseInfo = async () => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  } else {
    const players: PlayerWithScore[] = await getTeamPlayers(supabase, user.id);
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

const getCurrentGWPoints = async (supabase: SupabaseClient<any, "public", any>, players: PlayerWithScore[]): Promise<number> => {

  const { data: playersObjs } = await supabase.from("players").select("currentgw").in("playerid", players.map(player => player.playerid));

  if (!playersObjs || playersObjs.length === 0) {
    return 0;
  }

  const points = playersObjs.reduce((acc, player) => acc + player.currentgw, 0);

  return points;

}

const getTeamPlayers = async (supabase: SupabaseClient<any, "public", any>, userId: string): Promise<PlayerWithScore[]> => {
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
      squad: player.squad,
      currentgw: player.currentgw,
      total: player.total
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
      total: team.total,
      position: team.position,
      form: team.form,
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

  // get player names from oldplayerids and newplayerids (from supabase)

  const swapsArray = swaps.map(swap => {
    return {
      oldplayerid: swap.oldplayerid,
      newplayerid: swap.newplayerid
    }
  });

  const swapsNames: Swap[] = await Promise.all(swapsArray.map(async swap => {
    const { data: oldPlayer } = await supabase.from("players").select("name").eq("playerid", swap.oldplayerid);
    const { data: newPlayer } = await supabase.from("players").select("name").eq("playerid", swap.newplayerid);

    return {
      oldplayername: oldPlayer![0].name,
      newplayername: newPlayer![0].name
    }
  }
  ));

  return swapsNames;
}

export default async function Home() {

  // display loading spinner while fetching data

  const { userTeamInfo, teams } = await getSupabaseInfo();

  return (
    <div className="w-full">
      <NavBar />
      <Announcement />
      <Suspense fallback={<Loading />}>
        <div className="bg-gradient-to-b from-blue-950 to-gray-900 pb-10 min-h-screen">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-8 px-10 pt-12 md:gap-16 md:px-16 md:pt-12 ">
            <TeamDisplay userTeamInfo={userTeamInfo} />
            <Leaderboard teams={teams} />
          </div>
      </div>
      </Suspense>
    </div >
  );
}