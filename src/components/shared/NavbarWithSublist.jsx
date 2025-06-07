import React, { useState } from "react";
import {
  Navbar,
  Collapse,
  Typography,
  IconButton,
  List,
  ListItem,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import SearchBarComponent from "../restaurant/SearchBarComponent";

import { useLocation } from "react-router-dom";

function NavList() {
  const location = useLocation();
  console.log("pathname >>>", location.pathname);

  return (
    <List className="mt-4 mb-6 p-0 lg:mt-0 lg:mb-0 lg:flex-row lg:p-1">
    {[
      { name: "Nhà hàng", path: "/restaurant" },
      { name: "Khuyến mãi", path: "/restaurants/promotion" },
      { name: "Góc Video", path: "/restaurants/review" },
      { name: "Về chúng tôi", path: "/about-us" },
    ].map((item, index) => {
      const isActive = location.pathname === item.path;
  
      return (
        <Typography
          key={index}
          as="a"
          href={item.path}
          variant="h5"
          color="blue-gray"
          className={`relative font-bold px-3 py-2 transition-colors text-gray-800
          ${isActive ? "text-red-600" : ""}
          `}
        >
          <span className="hover:text-red-600">{item.name}</span>
        </Typography>
      );
    })}
  </List>
  

  );
}


export const NavbarWithSublist = () => {
  const [openNav, setOpenNav] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  return (

    <Navbar className="mx-auto max-w-screen-3xl rounded-none px-4 py-2 sticky top-0 z-50 bg-[#F5F5DC]">
      <div className="flex items-center justify-between text-blue-gray-900">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="https://img.freepik.com/premium-vector/hn-custom-letter-logo-design-initials-logo-letter-logo-modern-2023_290562-784.jpg"
            alt="Logo"
            className="mr-2 h-9 w-9"
          />
          <span className="text-lg font-bold">TableHive H&N</span>
        </div>
        <div className="hidden lg:block">
          <NavList />
        </div>
        <div className="hidden lg:block">
          <SearchBarComponent />
        </div>
        <IconButton
          variant="text"
          onClick={() => setOpenNav(!openNav)}
          className="ml-auto lg:hidden"
        >
          {openNav ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </IconButton>
      </div>
      <Collapse open={openNav}>
        <NavList />
      </Collapse>
    </Navbar>
  );
};
