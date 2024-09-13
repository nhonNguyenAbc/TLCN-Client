import React from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import PublicIcon from "@mui/icons-material/Public";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedTab } from "../../features/slices/selectedTabSlice";
const SidebarWithSearch = ({ SIDEBAR_SEARCH }) => {
  const [open, setOpen] = React.useState(0);
  const selectedTab = useSelector((state) => state.selectedTab.value);
  const dispatch = useDispatch();
  const handleOpen = (value) => {
    setOpen(open === value ? -1 : value);
  };
  return (
    <div>
      <Card className="relative h-[92vh] overflow-y-auto overflow-x-hidden w-full max-w-[20rem] py-4 shadow-xl shadow-blue-gray-900/5 z-10 bg-gray-100">
        {/* <div className="mb-2 flex items-center gap-4 p-4">
          <img
          src="https://d1.awsstatic.com/partner-network/partner_marketing_web_team/600x400_VTI.d8eba650f439bfec6d3eef0034c2e59a323353c1.png"
          alt="brand"
          className="h-16 w-auto"
        />
        </div> */}
        {/* <div className="p-4">
          <Input
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            label="Search"
          />
        </div> */}
        <List className="p-0">
          {SIDEBAR_SEARCH.map((item, index) =>
            item.title ? (
              <>
                <Accordion
                  open={true}
                  // icon={
                  //   <ChevronDownIcon
                  //     strokeWidth={2.5}
                  //     className={`mx-auto h-4 w-4 transition-transform ${
                  //       open === index ? "rotate-180" : ""
                  //     }`}
                  //   />
                  // }
                >
                  <ListItem className="p-0" selected={open === index}>
                    <AccordionHeader
                      onClick={() => handleOpen(index)}
                      className="border-b-0 px-5"
                    >
                      <ListItemPrefix>{item.title.icon}</ListItemPrefix>
                      <Typography
                        color="blue-gray"
                        className="mr-auto font-normal"
                      >
                        {item.title.label}
                      </Typography>
                    </AccordionHeader>
                  </ListItem>
                  <AccordionBody
                    className="py-1"
                    key={"accord-body-" + item.title.label}
                  >
                    <List className="p-0 " key={"list-" + item.title.label}>
                      {item.sublist.map((subitem) => (
                        <ListItem
                          style={{
                            backgroundColor:
                              selectedTab === subitem.label
                                ? "white"
                                : "transparent",
                            color:
                              selectedTab === subitem.label
                                ? "#FF333A"
                                : "inherit",
                          }}
                          selected={selectedTab == subitem.label}
                          key={subitem.label}
                          onClick={() =>
                            dispatch(setSelectedTab(subitem.label))
                          }
                        >
                          <ListItemPrefix>
                            <ChevronRightIcon
                              strokeWidth={3}
                              className="h-3 w-5"
                            />
                          </ListItemPrefix>
                          {subitem.label}
                        </ListItem>
                      ))}
                    </List>
                  </AccordionBody>
                </Accordion>
              </>
            ) : (
              <>
                <ListItem
                  key={item.sublist[0].label}
                  selected={selectedTab == item.sublist[0].label}
                  onClick={() =>
                    dispatch(setSelectedTab(item.sublist[0].label))
                  }
                  style={{
                    backgroundColor:
                      selectedTab === item.sublist[0].label
                        ? "white"
                        : "transparent",
                    color:
                      selectedTab === item.sublist[0].label
                        ? "#FF333A"
                        : "inherit",
                  }}
                >
                  <ListItemPrefix>
                    <PublicIcon strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>
                  {item.sublist[0].label}
                </ListItem>
              </>
            )
          )}
        </List>
      </Card>
    </div>
  );
};

SidebarWithSearch.propTypes = {
  SIDEBAR_SEARCH: PropTypes.array.isRequired,
};
export default SidebarWithSearch;
