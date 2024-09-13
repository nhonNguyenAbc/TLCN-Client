import React from "react";
import { admin_sidebar } from "../constants/sidebar_search";
import SidebarWithSearch from "../components/shared/SidebarWithSearch";
import AdminNavbar from "../components/shared/AdminNavbar";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const Adminpage = () => {
  const selectedTab = useSelector((state) => state.selectedTab.value);

  // if (!localStorage.getItem("token")) {
  //   window.location.href = "/loginAD";
  // }
  return (
    <div>
      <AdminNavbar />
      <div className="grid grid-cols-12">
        <div className="col-span-2">
          <SidebarWithSearch SIDEBAR_SEARCH={admin_sidebar} />
        </div>
        <div className="col-span-10">
          {admin_sidebar.map((item) =>
            item.sublist.map(
              (subitem) => subitem.label === selectedTab && subitem.elements
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Adminpage;
