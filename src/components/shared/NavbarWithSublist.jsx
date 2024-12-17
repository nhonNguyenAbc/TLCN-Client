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
import SearchBarComponent from "../restaurant/SearchBarComponent";
import { useNavigate } from "react-router-dom";

function NavList() {
  return (
    <List className="mt-4 mb-6 p-0 lg:mt-0 lg:mb-0 lg:flex-row lg:p-1">
      <Typography
        as="a"
        href="/restaurant"
        variant="h5"
        color="blue-gray"
        className="font-medium"
      >
        <ListItem className="flex items-center gap-2 py-2 pr-4">Nhà hàng</ListItem>
      </Typography>
      <Typography
        as="a"
        href="/restaurants/promotion"
        variant="h5"
        color="blue-gray"
        className="font-medium"
      >
        <ListItem className="flex items-center gap-2 py-2 pr-4">Khuyến mãi</ListItem>
      </Typography>
      <Typography
        as="a"
        href="/restaurants/review"
        variant="h5"
        color="blue-gray"
        className="font-medium"
      >
        <ListItem className="flex items-center gap-2 py-2 pr-4">Review</ListItem>
      </Typography>
      <Typography
        as="a"
        href="/about-us"
        variant="h5"
        color="blue-gray"
        className="font-medium"
      >
        <ListItem className="flex items-center gap-2 py-2 pr-4">Về chúng tôi</ListItem>
      </Typography>
      {/* <Typography
        as="a"
        href="/contact"
        variant="h5"
        color="blue-gray"
        className="font-medium"
      >
        <ListItem className="flex items-center gap-2 py-2 pr-4">Liên hệ</ListItem>
      </Typography> */}
    </List>
  );
}

export const NavbarWithSublist = () => {
  const [openNav, setOpenNav] = useState(false);
  const navigate = useNavigate()
  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  return (
    <Navbar className="mx-auto max-w-screen-3xl rounded-none px-4 py-2 sticky top-0 z-50">
      <div className="flex items-center justify-between text-blue-gray-900">
        <div className="flex items-center cursor-pointer" onClick={()=>navigate('/')}>
          <img
            src="https://img.freepik.com/premium-vector/hn-custom-letter-logo-design-initials-logo-letter-logo-modern-2023_290562-784.jpg"
            alt="Logo"
            className="mr-2 h-9 w-9"
          />
          <span className="text-lg font-bold">TableHive H&N</span>
        </div>
        <div className="hidden lg:block">
          <NavList /> {/* Sử dụng SearchBar */}
        </div>
        <div className="hidden lg:block">
          <SearchBarComponent/> {/* Sử dụng SearchBar */}
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
