import { Outlet } from "react-router-dom";
import { Banner } from "../components/shared/Banner";
import { NavbarWithSublist } from "../components/shared/NavbarWithSublist";
import { Footer } from "../components/shared/Footer";

const Layout = ({ showFooter = true }) => {
  return (
    <>
      <Banner />
      <NavbarWithSublist />
      <Outlet />
      {showFooter && <Footer />}
    </>
  );
};

export default Layout;
