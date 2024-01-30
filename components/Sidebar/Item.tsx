import { IconType } from "react-icons";

interface SidebarItemProps {
  href?: string;
  icon: IconType;
}

// const Item: React.FC<SidebarItemProps> = ({ href, icon: Icon }) => {
//   return (
//     <li>
//       <a
//         href={href}
//         className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
//       >
//         <Icon></Icon>
//         <span className="ms-3">Dashboard</span>
//       </a>
//     </li>
//   );
// };

// export default Item;

function Item({ href, icon: Icon }: SidebarItemProps) {
  return (
    <li>
      <a
        href={href}
        className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
      >
        <Icon></Icon>
        <span className="ms-3">Dashboard</span>
      </a>
    </li>
  );
}

export default Item;