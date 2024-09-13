import { Tab, Tabs, TabsHeader } from "@material-tailwind/react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { setTab } from "../../features/slices/tabSlice";

const Tablist = ({ TABS }) => {
  const tab = useSelector((state) => state.tab.value);
  const dispatch = useDispatch();
  return (
    <div className="flex flex-col items-center justify-between gap-4 md:flex-row mb-3">
      <Tabs value={tab} className="w-full" as="div">
        <TabsHeader>
          {TABS.map(({ label, value }) => (
            <Tab
              key={value}
              value={value}
              onClick={() => {
                dispatch(setTab(value));
              }}
            >
              &nbsp;&nbsp;{label}&nbsp;&nbsp;
            </Tab>
          ))}
        </TabsHeader>
      </Tabs>
    </div>
  );
};

Tablist.propTypes = {
  TABS: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.any.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  tab: PropTypes.string.isRequired,
  setTab: PropTypes.func.isRequired,
};

export default Tablist;
