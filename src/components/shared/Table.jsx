import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  Card,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from "@material-tailwind/react";
import TableHeader from "./TableHeader";
import Pagination from "./Pagination";
import SettingButton from "./SettingButton";
import { useDispatch } from "react-redux";
import { setSelectedId } from "../../features/slices/selectIdSlice";
const Table = ({
  TABLE_HEAD,
  TABLE_ROWS,
  active,
  setActive,
  handleDetailOpen,
  handleUpdateOpen,
  handleDeleteOpen,
  updateContent,
  deleteContent,
  noUpdate,
  noDelete,
  maxPage,
}) => {
  const dispatch = useDispatch();
  return (
    <Card>
      <table className="w-full table-auto text-center">
        <TableHeader
          TABLE_HEAD={TABLE_HEAD}
          noUpdate={noUpdate}
          noDelete={noDelete}
        />
        <tbody>
          {TABLE_ROWS.length > 0 ? (
            TABLE_ROWS.map((row, index) => (
              <tr key={index} className="border-b border-gray-200">
                {Object.values(row)
                  .slice(1)
                  .map((value, index) => (
                    <td
                      key={index}
                      className="p-4 break-normal text-center"
                      onClick={() => {
                        handleDetailOpen();
                        dispatch(setSelectedId(row.id));
                      }}
                      colSpan={TABLE_HEAD[index].col}
                    >
                      {TABLE_HEAD[index].label === "Hình ảnh" ? (
                        <img
                          src={value}
                          alt="avatar"
                          className="w-[50px] h-[50px] mx-auto object-cover"
                        />
                      ) : (
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal max-w-[300px]"
                        >
                          {value}
                        </Typography>
                      )}
                    </td>
                  ))}
                {(!noDelete || !noUpdate) && (
                  <SettingButton
                    id={row.id}
                    handleDeleteOpen={handleDeleteOpen}
                    handleUpdateOpen={handleUpdateOpen}
                    updateContent={updateContent}
                    deleteContent={deleteContent}
                    noUpdate={noUpdate}
                    noDelete={noDelete}
                  />
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={TABLE_HEAD.reduce(
                  (total, column) => total + column.col,
                  1
                )}
                className="p-4"
              >
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {maxPage > 1 && (
        <Pagination page={maxPage} active={active} setActive={setActive} />
      )}
    </Card>
  );
};

Table.propTypes = {
  TABLE_HEAD: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      col: PropTypes.number.isRequired,
    })
  ).isRequired,
  TABLE_ROWS: PropTypes.array.isRequired,
  active: PropTypes.number.isRequired,
  setActive: PropTypes.func.isRequired,
  handleDetailOpen: PropTypes.func.isRequired,
  handleUpdateOpen: PropTypes.func.isRequired,
  handleDeleteOpen: PropTypes.func.isRequired,
  updateContent: PropTypes.string.isRequired,
  deleteContent: PropTypes.string.isRequired,
  noUpdate: PropTypes.bool,
  noDelete: PropTypes.bool,
  data: PropTypes.object.isRequired,
  handleData: PropTypes.func.isRequired,
};
export default Table;
