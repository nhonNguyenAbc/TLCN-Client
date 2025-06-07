import { NavLink } from "react-router-dom";
import {
  HeartIcon,
  UserIcon,
  ClockIcon
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const links = [
    { name: "Tài khoản", to: "/profile", icon: UserIcon },
    { name: "Lịch sử đặt bàn", to: "/history", icon: ClockIcon },    
    { name: "Nhà hàng yêu thích", to: "/favourite-restaurant", icon: HeartIcon },
  ];

  return (
    <div className="h-screen w-64 bg-white flex flex-col">
      <nav className="flex-1 p-4 space-y-2">
        {links.map(({ name, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-md transition-colors
               ${isActive ? "bg-red-500 text-white" : "text-gray-700 hover:bg-gray-100"}`
            }
          >
            <Icon className="h-6 w-6" />
            <span>{name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
