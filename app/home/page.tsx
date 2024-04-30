import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { Team } from "@/types/team";
import { Swap } from "@/types/swap";
import { PlayerWithScore } from "@/types/player";
import TeamDisplay from "@/components/TeamDisplay";
import Leaderboard from "@/components/Leaderboard";
import NavBar from "@/components/NavBar";
import FAQs from "@/components/FAQs";
import Image from "next/image";
import Announcement from "@/components/Announcement";
import Footer from "@/components/Footer";

interface userTeamInfo {
  teamInfo: Team;
  players: PlayerWithScore[];
  swaps: Swap[];
  currentGWPoints: number;
  captainName: string;
  newCaptainName: string | null;
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
    const {captainName, newCaptainName} = await getCaptainName(supabase, user.id);
    const currentGWPoints = await getCurrentGWPoints(supabase, players, captainName);

    const userTeamInfo: userTeamInfo = {
      teamInfo: teams.find(team => team.uuid === user.id)!,
      players: players,
      swaps: swaps,
      currentGWPoints: currentGWPoints,
      captainName: captainName,
      newCaptainName: newCaptainName
    }

    return { userTeamInfo, teams };
  }

}

const getCurrentGWPoints = async (supabase: SupabaseClient<any, "public", any>, players: PlayerWithScore[], captainName: string): Promise<number> => {

  const { data: playersObjs } = await supabase.from("players").select("name, currentgw").in("playerid", players.map(player => player.playerid));

  if (!playersObjs || playersObjs.length === 0) {
    return 0;
  }

  // double captain points
  playersObjs.forEach(player => {
    if (player.name === captainName) {
      player.currentgw *= 2;
    }
  });

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
      nextcapt: team.nextcapt
    }
  });

  return teamsArray;
}

const getCaptainName = async (supabase: SupabaseClient<any, "public", any>, userId: string): Promise<{captainName: string, newCaptainName: string | null}> => {
  const { data: captainId } = await supabase.from("userplayers").select("playerid").eq("uuid", userId).eq("captain", true).single();

  if (!captainId) {
    return {captainName: "", newCaptainName: null};
  }

  const { data: captainNameObj } = await supabase.from("players").select("name").eq("playerid", captainId.playerid).single();

  const { data: newCaptainId } = await supabase.from("users").select("nextcapt").eq("id", userId).single();
  const { data: newCaptainNameObj } = await supabase.from("players").select("name").eq("playerid", newCaptainId!.nextcapt).single();

  if (!newCaptainNameObj) {
    return { captainName: captainNameObj!.name , newCaptainName: null};
  }

  return { captainName: captainNameObj!.name, newCaptainName: newCaptainNameObj.name };
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

const FAQsData = [
  { "title": "What are the restrictions on making my team?", "content": "You'll have £80m to play with for your squad, where you'll have to select 4 players from each squad. We'll be changing up the prices of players depending on how they do in the season. Remember to choose your captain carefully!" },
  { "title": "How are points calculated?", "content": "Batting: 1pt per run. +25pts for a half-century, +50pts for a ton. 2pts per 4, 4pts per 6. -10pts for a duck, of course.\n\nBowling: 15pts per wicket, +15pts for a 3fer, +25pts for a 5fer. \n\nFielding: 10pts for a catch, 25pts for a stumping and 15pts for a run-out." },
  { "title": "What do I do if I find a bug?", "content": "Though we're absolute keyboard warriors, there's bound to be stuff that we've not got quite right. Le Fez does that to the best of us.\n\nPlease screenshot any problems you spot and send it over to Suhas or Rushil - we'll try fix it ASAP." },
  { "title": "Should I bet against the banker?", "content": "Never. Not even once." }
]

export default async function Home() {

  const { userTeamInfo, teams } = await getSupabaseInfo();

  return (
    <div className="w-full">
      <NavBar />
      <Announcement />
      <div className="min-h-screen">
        <div className="bg-gradient-to-b from-blue-950 to-gray-900 grid lg:grid-cols-2 grid-cols-1 gap-8 px-4 pt-12 pb-10 lg:gap-16 lg:px-16 lg:pt-12 lg:pb-10">
          <TeamDisplay userTeamInfo={userTeamInfo} />
          <Leaderboard teams={teams} />
        </div>

        <div className="lg:h-screen lg:bg-cover lg:bg-bottom lg:bg-[url('/home_background.png')] bg-ic">
          <div className="w-full flex flex-col items-center">
            <h2 className="text-3xl text-gray-200 text-center font-bold py-4 my-4">Frequently Asked Questions</h2>
            <FAQs items={FAQsData}></FAQs>
          </div>

          {/* Mobile graphic */}
          <div className="lg:hidden flex w-screen">
            <Image
              src="/home_mobile.png"
              alt="Home background"
              width={1080}
              height={585}
              quality={100}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}