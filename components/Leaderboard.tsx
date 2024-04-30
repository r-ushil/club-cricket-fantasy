import { Team } from "@/types/team";
import { FaArrowAltCircleUp } from "react-icons/fa";
import { FaArrowAltCircleDown } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { FaCircle } from "react-icons/fa";

interface LeaderboardProps {
  teams: Team[];
}


export default function TeamDisplay({ teams }: LeaderboardProps) {
  const sortedTeams = teams.sort((a, b) => a.position - b.position);

  const getFormIcon = (form: boolean | null) => {

    // If form is null, return grey hyphen
    if (form === null) {
      return <FaMinus className="text-gray-500 text-sm" />;
    }

    if (form === true) {
      return <FaArrowAltCircleUp className="text-green-500 text-sm" />;
    }

    if (form === false) {
      return <FaArrowAltCircleDown className="text-red-500 text-sm" />;
    }

    // should never happen - this is an error.
    return <FaCircle className="text-blue-500 text-sm" />;
  };

  return (
    <div className="bg-gradient-to-bl from-black to-red-950 text-white rounded-lg shadow-lg shadow-gray-600/50 px-6 pt-4 text-center"> {/* TODO: add lg:h-1/2 */}
      <h1 className="lg:text-3xl text-lg font-extrabold text-gray-200 lg:mb-4 mb-2">ICUCC LEADERBOARD</h1>

      <ul className="overflow-y-auto max-h-[560px] pr-4 bg-gray-500 bg-opacity-20 rounded-lg p-4 mb-6">
        {sortedTeams.map((team) => (
          <li key={team.uuid} className="grid lg:grid-cols-[50px_250px_50px] grid-cols-[40px_130px_40px] items-center py-1 px-2 justify-between border rounded-md">
            <div className="flex items-center">
              {getFormIcon(team.form)}
              <span className="font-semibold ml-2 text-white text-center lg:text-base text-sm">{team.position}</span>
            </div>
            <div className="flex flex-col px-2 text-left">
              <span className="font-bold lg:text-base text-sm text-white">{team.teamname}</span>
              <span className="italic lg:text-base text-sm text-gray-300">{team.fullname}</span>
            </div>
            <span className="font-semibold lg:text-base text-sm text-gray-300 lg:pr-2 pr-2">{team.total}</span>
          </li>
        ))}
      </ul>
    </div >
  )
}