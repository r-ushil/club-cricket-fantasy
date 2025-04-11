import { TbShirtFilled } from "react-icons/tb";

interface TshirtIconProps {
  shirtText: string;
  selected: boolean;
}

const TshirtIcon = ({ shirtText, selected}: TshirtIconProps) => {
  return (
    <div className="relative">
      <TbShirtFilled className={`text-6xl ${selected ? 'text-ic' : 'text-gray-800'} drop-shadow-[0_0_2px_white]`} />
      <span
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-md font-bold flex items-center justify-center"
      >{shirtText}
      </span>
    </div>
  );
};

export default TshirtIcon;