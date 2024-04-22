"use client";
import PlayerSelectGrid from "@/components/PlayerSelectGrid";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Player } from "@/types/player";


const EditTeamPage = () => {
  const [currentPlayers, setCurrentPlayers] = useState<(Player | null)[]>([]);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);

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
    const { data: currentPlayerIds } = await supabase.from("userplayers").select("playerid").eq("uuid", user!.id);

    // Initialise currentPlayers array to 16 empty objects
    let currentPlayers: (Player | null)[] = [...Array(16)].map(() => (null));

    // Get current user's player objects
    if (currentPlayerIds && currentPlayerIds.length > 0) {
      currentPlayers = allPlayers!.filter(player => currentPlayerIds.includes(player.id));
    }

    return { currentPlayers, allPlayers };
  }

  useEffect(() => {
    (async () => {
      await authenticateUser();
      const { currentPlayers, allPlayers } = await getPlayers();
      setCurrentPlayers(currentPlayers);
      setAllPlayers(allPlayers as Player[]);
    })();
  }, []);

  const onTeamSubmit = async (newPlayers: Player[]) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Get current user's player objects
    const { data: currentUserPlayerIds } = await supabase.from("userplayers").select("playerid").eq("uuid", user!.id);
    const currentPlayerIds = currentUserPlayerIds?.map(row => row.playerid) as number[];



    // Get the new player IDs 
    const newPlayerIds = newPlayers.map(player => player.playerid);

    if (!currentPlayerIds || currentPlayerIds.length === 0) {
      // Add the new players to the userplayers table
      const newPlayerRows = newPlayerIds.map(playerId => ({ uuid: user!.id, playerid: playerId }));
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
      if (removedPlayers.length !== 2 && addedPlayers.length !== 2) {
        alert("You can only swap 2 players from your previous team.");
        return;
      }

      const swapRows = removedPlayers.map(playerId => ({ uuid: user!.id, oldplayerid: playerId, newplayerid: 0}));
      addedPlayers.forEach((playerId, i) => {
        swapRows[i].newplayerid = playerId;
      });

      // push swaps and userplayers updates to supabase
      try {
        await supabase.from("userplayers").delete().eq("uuid", user!.id);
        await supabase.from("userplayers").insert(newPlayerIds.map(playerId => ({ uuid: user!.id, playerid: playerId })));
        await supabase.from("swaps").insert(swapRows);
        window.location.href = "/";
        // return router.push("/home");
      } catch (error) {
        console.error("Error updating userplayers table:", error);
      }
    }

  }

  return (
    <div className="w-full h-screen flex flex-col items-center bg-gradient-to-b from-blue-950 to-gray-900">
      <h1 className="text-white font-bold text-4xl mt-20">Edit Team</h1>
      <PlayerSelectGrid
        selectedPlayers={currentPlayers}
        allPlayers={allPlayers}
        onSelect={(newPlayers) => {
          setCurrentPlayers(newPlayers);
        }}
        onSubmit={onTeamSubmit}
      />
    </div>
  );
};

export default EditTeamPage;