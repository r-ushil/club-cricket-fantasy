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
    <div className="bg-gradient-to-bl from-indigo-950 to-red-950 text-white rounded-lg shadow-lg shadow-gray-600/50 px-6 pt-4 text-center"> {/* TODO: add lg:h-1/2 */}
      <h1 className="lg:text-4xl text-lg font-extrabold text-blue-700">ICUCC LEADERBOARD</h1>

      <ul className="overflow-y-auto pr-4 bg-gray-500 bg-opacity-20 rounded-lg p-4 mb-6 mt-4">
        {sortedTeams.map((team) => (
          <li key={team.uuid} className="grid lg:grid-cols-[50px_250px_50px] grid-cols-[30px_150px_30px] items-center py-1 px-2 justify-between border rounded-md">
            <div className="flex items-center">
              {getFormIcon(team.form)}
              <span className="font-semibold ml-2 text-center">{team.position}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-left">{team.teamname}</span>
              <span className="italic text-left">{team.fullname}</span>
            </div>
            <span className="font-semibold text-center">{team.total}</span>
          </li>
        ))}
      </ul>
    </div >
  )
}