import { TbShirtFilled } from "react-icons/tb";

interface TshirtIconProps {
  shirtText: string;
  shirtColour: string;
}

const TshirtIcon = ({ shirtText, shirtColour }: TshirtIconProps) => {
  return (
    <div className="relative">
      <TbShirtFilled className={`text-${shirtColour} text-6xl`} />
      <span
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-md font-bold flex items-center justify-center"
      >{shirtText}
      </span>
    </div>
  );
};

export default TshirtIcon;