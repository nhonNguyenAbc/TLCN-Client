import React from "react";
import { staff_sidebar } from "../constants/sidebar_search";
import SidebarWithSearch from "../components/shared/SidebarWithSearch";
import StaffNavbar from "../components/shared/StaffNavbar";
import { useSelector } from "react-redux";

const Staffpage = () => {
  const selectedTab = useSelector((state) => state.selectedTab.value);
  if (!localStorage.getItem("token")) {
    window.location.href = "/loginAD";
  }
  return (
    <div>
      <StaffNavbar />
      <div className="grid grid-cols-12">
        <div className="col-span-2">
          <SidebarWithSearch SIDEBAR_SEARCH={staff_sidebar} />
        </div>
        <div className="col-span-10">
          {staff_sidebar.map((item) =>
            item.sublist.map(
              (subitem) => subitem.label === selectedTab && subitem.elements
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Staffpage;
