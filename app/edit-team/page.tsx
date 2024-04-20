"use client";
import PlayerButton from "@/components/PlayerButton";

const EditTeamPage = () => {
  const playerButtons = [...Array(16)].map((_, i) => (
    <PlayerButton key={i} index={i} onClick={() => { console.log("Selected") }} />
  ));
  return (
    <div className="w-full h-screen flex flex-col items-center bg-gradient-to-b from-blue-950 to-gray-900">
      <h1 className="text-white font-bold text-4xl mt-20">Edit Team</h1>
      <div className="grid grid-cols-4 gap-4 mt-8 sm-grid-cols-2">
        {playerButtons}
      </div>
    </div>
  );
};

export default EditTeamPage;