import React from "react";
import {
  Navbar,
  Typography,
  Avatar,
  IconButton,
  Button,
} from "@material-tailwind/react";
import { Bars2Icon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

const StaffNavbar = () => {
  const [isNavOpen, setIsNavOpen] = React.useState(false);
  const navigate = useNavigate(); // Hook để chuyển hướng trang

  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);

  React.useEffect(() => {
    const handleResize = () => window.innerWidth >= 960 && setIsNavOpen(false);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");

    navigate("/loginAD");
  };

  return (
    <Navbar className="mx-auto max-w-screen-3xl rounded-none px-4 py-2 sticky top-0 z-50">
      <div className="relative mx-auto flex items-center justify-between text-blue-gray-900">
        <Typography variant="h3" className="ms-5" color="blue-gray">
          <span className="text-[#FF333A]">TableHive H&N</span> Staff
        </Typography>
        {/* <div className="hidden lg:block">
          <NavList />
        </div> */}
        <IconButton
          size="sm"
          color="blue-gray"
          variant="text"
          onClick={toggleIsNavOpen}
          className="ml-auto mr-2 lg:hidden"
        >
          <Bars2Icon className="h-6 w-6" />
        </IconButton>
        <div className="flex items-center space-x-4">
          <Button
            color="red"
            variant="text"
            onClick={handleLogout}
            className="hidden lg:inline-flex items-center"
          >
            <ArrowLeftOnRectangleIcon className="h-6 w-6 mr-2" />
            Logout
          </Button>
          {/* <Avatar
            variant="circular"
            size="sm"
            alt="User Profile"
            className="border border-gray-900 p-0.5"
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
          /> */}
        </div>
      </div>
      {/* <Collapse open={isNavOpen} className="overflow-scroll">
        <NavList />
      </Collapse> */}
    </Navbar>
  );
};

export default StaffNavbar;
