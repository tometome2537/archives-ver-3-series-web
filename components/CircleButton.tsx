import { IconType } from "react-icons";

interface ButtonProps {
  icon: IconType;
}

export default function CircleButton({ icon: Icon }: ButtonProps) {
  return (
    <button
      type="submit"
      className="ms-2 rounded-full border border-primary-800 bg-primary-default p-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-1 focus:ring-primary-800"
    >
      <Icon />
    </button>
  );
}
