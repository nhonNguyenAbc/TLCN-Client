import { Outlet } from "react-router-dom";
import { Banner } from "../components/shared/Banner";
import { NavbarWithSublist } from "../components/shared/NavbarWithSublist";
import { Footer } from "../components/shared/Footer";

const Layout = () => {
  return (
    <>
      <Banner />
      <NavbarWithSublist />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
