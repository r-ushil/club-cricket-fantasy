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
    const { data: currentPlayerIds } = await supabase.from("userplayers").select("playerid").eq("uuid", user!.id);

    // Get the player IDs that have changed
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
      console.log("Swaps:", swaps);
      // const oldPlayerIds = currentPlayerIds.map(player => player.playerid);

      // // Get the player IDs that have been removed
      // const removedPlayerIds = oldPlayerIds.filter(id => !newPlayerIds.includes(id));

      // // Get the player IDs that have been added
      // const addedPlayerIds = newPlayerIds.filter(id => !oldPlayerIds.includes(id));

      // // Remove the removed players from the userplayers table
      // if (removedPlayerIds.length > 0) {
      //   await supabase.from("userplayers").delete().eq("uuid", user!.id).in("playerid", removedPlayerIds);
      // }

      // // Add the added players to the userplayers table
      // if (addedPlayerIds.length > 0) {
      //   const newPlayerRows = addedPlayerIds.map(playerId => ({ uuid: user!.id, playerid: playerId }));
      //   await supabase.from("userplayers").insert(newPlayerRows);
      // }

      // // Update the currentPlayers state
      // setCurrentPlayers(newPlayers);
    }

  }

  let swaps: { oldPlayerId: number; newPlayerId: number }[] = [];

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