"use client";
import PlayerSelectGrid from "@/components/PlayerSelectGrid";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

interface Player {
  id: number;
  name: string;
  price: number;
  squad: number;
}

const EditTeamPage = () => {
  // const [modalOpen, setModalOpen] = useState(false);
  // const [selectedOldPlayerId, setSelectedOldPlayerId] = useState<number | null>(null);
  // const [selectedNewPlayerId, setSelectedNewPlayerId] = useState<number | null>(null);
  const [currentPlayers, setCurrentPlayers] = useState<(Player | null)[]>([]);
  const [selectablePlayers, setSelectablePlayers] = useState<Player[]>([]);


  // Ensure user is signed in
  const getUser = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return redirect("/login");
    }
    return user.id;
  }

  const getPlayers = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: allPlayers } = await supabase.from("players").select("*");
    const { data: currentPlayerIds } = await supabase.from("userplayers").select("playerid").eq("uuid", user!.id);
    // Initialise currentPlayers array to 16 empty objects
    let currentPlayers: (Player | null)[] = [...Array(16)].map(() => (null));
    let selectablePlayers: Player[] = allPlayers!;

    // Get current user's player objects
    if (currentPlayerIds && currentPlayerIds.length > 0) {
      selectablePlayers = allPlayers!.filter(player => !currentPlayers.find(p => p!.id === player.id));
      currentPlayers = allPlayers!.filter(player => currentPlayerIds.includes(player.id));
    }

    return {currentPlayers, selectablePlayers};
  }

  useEffect(() => {
    (async () => {
      const {currentPlayers, selectablePlayers} = await getPlayers();
      setCurrentPlayers(currentPlayers);
      setSelectablePlayers(selectablePlayers);
    })();
  }, []);



  let swaps: { oldPlayerId: number; newPlayerId: number }[] = [];

  return (
    <div className="w-full h-screen flex flex-col items-center bg-gradient-to-b from-blue-950 to-gray-900">
      <h1 className="text-white font-bold text-4xl mt-20">Edit Team</h1>
      <PlayerSelectGrid selectedPlayers={currentPlayers} allPlayers={selectablePlayers} />
    </div>
  );
};

export default EditTeamPage;