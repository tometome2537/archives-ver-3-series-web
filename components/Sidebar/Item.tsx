import type { IconType } from "react-icons";

interface SidebarItemProps {
    href?: string;
    icon: IconType;
}

export default function Item({ href, icon: Icon }: SidebarItemProps) {
    return (
        <li>
            <a
                href={href}
                className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
            >
                <Icon />
                <span className="ms-3">Dashboard</span>
            </a>
        </li>
    );
}
