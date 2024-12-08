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
      <Typography
        as="a"
        href="/contact"
        variant="h5"
        color="blue-gray"
        className="font-medium"
      >
        <ListItem className="flex items-center gap-2 py-2 pr-4">Liên hệ</ListItem>
      </Typography>
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
            src="https://mindxschool.gitbook.io/~gitbook/image?url=https%3A%2F%2F2763219643-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FbApz6rKK01BWUpp5sM0n%252Ficon%252FTW0u7G4eX3NYfEpPqzqW%252Flogo.png%3Falt%3Dmedia%26token%3D3b580b4c-805c-47d5-bde5-9023a590e7a5&width=32&dpr=4&quality=100&sign=975a9163111fdc2e62e7d70701c224f6620d130c61f209c61dc0cd301c370ad"
            alt="Logo"
            className="mr-2 h-9 w-9"
          />
          <span className="text-lg font-bold">Nhà hàng ABC</span>
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
