"use client";
import PlayerSelectGrid from "@/components/PlayerSelectGrid";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Player } from "@/types/player";
import Loading from "@/components/Loading";
import BackButton from "@/components/BackButton";
import { Team } from "@/types/team";


const EditTeamPage = () => {
  const [currentPlayers, setCurrentPlayers] = useState<(Player | null)[]>([]);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const [currentCaptain, setCaptain] = useState<Player | null>(null);

  const [loading, setLoading] = useState(true);

  // Ensure user is signed in
  const authenticateUser = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/login";
      return;
    }
  }

  const getPlayers = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: allPlayers } = await supabase.from("players").select("*");
    const { data: currentPlayerIds } = await supabase.from("userplayers").select("playerid, captain").eq("uuid", user!.id);

    // Initialise currentPlayers array to 16 empty objects
    let currentPlayers: (Player | null)[] = [...Array(16)].map(() => (null));

    // Get current user's player objects
    if (currentPlayerIds && currentPlayerIds.length > 0) {
      currentPlayers = currentPlayerIds.map(row => allPlayers!.find(player => player.playerid === row.playerid) || null);
    }

    // Set the captain player
    const currentCaptain = currentPlayers.find(player => player?.playerid === currentPlayerIds?.find(row => row.captain)?.playerid) || null;    
    return { currentPlayers, allPlayers, currentCaptain };
  }

  useEffect(() => {
    (async () => {
      await authenticateUser();
      const { currentPlayers, allPlayers, currentCaptain } = await getPlayers();
      setCaptain(currentCaptain);
      setCurrentPlayers(currentPlayers);
      setAllPlayers(allPlayers as Player[]);
      setSelectedPrice(currentPlayers.reduce((acc, player) => acc + (player?.price || 0), 0));
      setLoading(false);

    })();
  }, []);

  const onTeamSubmit = async (newPlayers: Player[], captain: Player) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Get current user's player objects
    const { data: currentUserPlayerIds } = await supabase.from("userplayers").select("playerid, captain").eq("uuid", user!.id);
    const currentPlayerIds = currentUserPlayerIds?.map(row => row.playerid) as number[];

    // Could be null, if user has no players
    const currentCaptainPlayerId = currentUserPlayerIds?.find(row => row.captain)?.playerid as number;
    // Get the new player IDs 
    const newPlayerIds = newPlayers.map(player => player.playerid);


    if ((!currentPlayerIds || currentPlayerIds.length === 0)) {
      // Add the new players to the userplayers table
      const newPlayerRows = newPlayerIds.map(playerId => ({ uuid: user!.id, playerid: playerId, captain: false }));

      // For the captain player, set captain to true
      const captainRow = newPlayerRows.find(row => row.playerid === captain.playerid);
      if (captainRow) {
        captainRow.captain = true;
      } else {
        // should never happen
        console.error("Error: Captain player not found in newPlayerRows");
      }

      try {
        await supabase.from("userplayers").insert(newPlayerRows);
        window.location.href = "/";
        // return router.push("/home");
      } catch (error) {
        console.error("Error adding new players to userplayers table:", error);
      }
    } else {

      // Get players that were removed

      const removedPlayers = currentPlayerIds.filter(playerId => !newPlayerIds.includes(playerId));
      const addedPlayers = newPlayerIds.filter(playerId => !currentPlayerIds.includes(playerId));

      // Sanity check - should never happen
      if (removedPlayers.length !== addedPlayers.length) {
        console.error("Error: removedPlayers and addedPlayers arrays are not the same length");
        return;
      }

      // More than 2 players were swapped
      if (removedPlayers.length > 2 && addedPlayers.length > 2) {

        const removedPlayersNames = removedPlayers.map(playerId => allPlayers.find(player => player.playerid === playerId)?.name);
        const addedPlayersNames = addedPlayers.map(playerId => allPlayers.find(player => player.playerid === playerId)?.name);

        alert("You can only swap 2 players from your previous team. Currently removed players are: " + removedPlayersNames + ". Added players are: " + addedPlayersNames);
        return;
      }

      const swapRows = removedPlayers.map(playerId => ({ uuid: user!.id, oldplayerid: playerId, newplayerid: 0 }));
      addedPlayers.forEach((playerId, i) => {
        swapRows[i].newplayerid = playerId;
      });

      // Update the captain player on the user object
      if (captain.playerid !== currentCaptainPlayerId) {
        const { data: team } = await supabase.from("users").select("*").eq("id", user!.id).single();

        const updatedTeam = {
          ...team,
          nextcapt: captain.playerid
        };

        try {
          await supabase.from("users").upsert(updatedTeam);
        } catch (error) {
          console.error("Error updating user team:", error);
        }
      }

      // push swaps and userplayers updates to supabase
      try {
        await supabase.from("swaps").delete().eq("uuid", user!.id);
        await supabase.from("swaps").insert(swapRows);
        window.location.href = "/";
        // return router.push("/home");
      } catch (error) {
        console.error("Error updating userplayers table:", error);
      }
    }

  }

  return (
    <div className="w-full">
      {/* NavBar */}
      <nav className="w-full flex items-center justify-between bg-gray-800 border-b border-b-foreground/10 h-16 py-4 px-10">
        <div className="flex items-center">
          <img src="/icucc_logo.png" alt="ICUCC Logo" className="h-12" />
          <h3 className="text-white text-xl font-bold pl-4">ICUCC Fantasy</h3>
        </div>
      </nav>

      {/* Main Content */}
      <div className="w-full min-h-screen flex flex-col items-center bg-gradient-to-b from-blue-900 to-red-950">
        {loading ? <Loading /> : <>
          <h2 className="text-gray-300 font-bold text-3xl mt-8">EDIT TEAM</h2>
          <h2 className="text-gray-400 text-lg mt-2">Budget Remaining: <span className={`font-semibold ${selectedPrice < 80 ? "text-green-500" : "text-red-500"}`}>{`£${80 - selectedPrice}m`}</span></h2>
          <BackButton href="/home" />
          <PlayerSelectGrid
            selectedPlayers={currentPlayers}
            allPlayers={allPlayers}
            captainPlayer={currentCaptain}
            onSelect={(newPlayers) => {
              setCurrentPlayers(newPlayers);
              setSelectedPrice(newPlayers.reduce((acc, player) => acc + (player?.price || 0), 0));
            }}
            onSubmit={onTeamSubmit}
          />
        </>}
      </div>
    </div>
  );
};

export default EditTeamPage;