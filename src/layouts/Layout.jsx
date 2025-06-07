import { Outlet } from "react-router-dom";
import { Banner } from "../components/shared/Banner";
import { NavbarWithSublist } from "../components/shared/NavbarWithSublist";
import { Footer } from "../components/shared/Footer";
import Sidebar from "../components/shared/Sidebar";

const Layout = ({ showFooter = true, showSidebar = false }) => {
  return (
    <>
      <Banner />
      <NavbarWithSublist />
      {showSidebar ? (
        <div className="flex !min-h-[calc(100vh-200px)] h-auto">
          <aside className="w-64 h-screen !sticky top-20  bg-white ">
            <Sidebar />
          </aside>

          <main className="flex-grow p-6 bg-gray-50">
            <Outlet />
          </main>
        </div>

      ) : (
        <main>
          <Outlet />
        </main>
      )}

      {showFooter && <Footer />}
    </>
  );
};

export default Layout;
