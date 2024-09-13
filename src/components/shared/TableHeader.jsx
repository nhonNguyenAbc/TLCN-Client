import { Typography } from "@material-tailwind/react";
import SettingsIcon from "@mui/icons-material/Settings";
import PropTypes from "prop-types";
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";
const TableHeader = ({ TABLE_HEAD, noUpdate, noDelete }) => {
  return (
    <>
      <thead>
        <tr className="text-gray-900  uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          {TABLE_HEAD.map(({ label, col }, index) => (
            <th
              key={index}
              className=" border-blue-gray-100 cursor-pointer bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
              colSpan={col}
            >
              <Typography className="flex items-center justify-center font-bold text-sm leading-none opacity-70">
                {label}{" "}
                <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
              </Typography>
            </th>
          ))}
          {(!noDelete || !noUpdate) && (
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography className="font-bold text-sm leading-none opacity-70">
                <SettingsIcon key={-1} />
              </Typography>
            </th>
          )}
        </tr>
      </thead>
    </>
  );
};

TableHeader.propTypes = {
  TABLE_HEAD: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      col: PropTypes.number.isRequired,
    })
  ).isRequired,
  noUpdate: PropTypes.bool,
  noDelete: PropTypes.bool,
};

export default TableHeader;
