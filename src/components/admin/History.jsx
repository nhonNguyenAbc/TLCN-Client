import {
  Button,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

import React, { useState } from "react";
import { history } from "../../constants/table_head";
import AdminLayout from "../../layouts/AdminLayout";
import { useGetAllLogsQuery } from "../../apis/logApi";
import Loading from "../shared/Loading";
import { useNavigate } from "react-router-dom";

const TABLE_ROWS = [
  {
    name: "001",
    role: "USER",
    action: "Tạo tài khoản",
    date: "23/04/18",
  },
];
const History = () => {
  const [active, setActive] = React.useState(1);
  const [size, setSize] = React.useState(10);
  const [sort, setSort] = useState("");
  const navigate = useNavigate();
  const {
    data: logs,
    isLoading,
    error,
  } = useGetAllLogsQuery({
    page: active,
    size,
    sort: sort,
  });

  if (isLoading) return <Loading />;
  if (error && (error.status === 401 || error.status === 403))
    return navigate("/login");
  if (error) return <div>Error: {error.message || JSON.stringify(error)}</div>;

  const list_logs = logs?.data?.map((log) => ({
    _id: log._id,
    name: log.user[0].username,
    role: log.user[0].role,
    action: log.activity,
    date: new Date(log.created_at).toLocaleDateString("en-GB"),
  }));
  return (
    <>
      <AdminLayout
        name="Lịch sử hoạt động"
        TABLE_HEAD={history}
        TABLE_ROWS={list_logs.length > 0 ? list_logs : []}
        pagination={logs?.info}
        page={active}
        setPage={setActive}
        noUpdate
        noDelete
        noDetail
      >
        <div className="flex items-center justify-between gap-4">
          <div className="shrink-0">
            <Menu>
              <MenuHandler>
                <Button
                  color="gray"
                  variant="outlined"
                  className="flex items-center gap-1 !border-gray-300"
                >
                  {sort === ""
                    ? "all time"
                    : sort === "hour"
                    ? "last hour"
                    : sort === "day"
                    ? "last 24 hours"
                    : sort === "week"
                    ? "last week"
                    : "last month"}
                  <ChevronDownIcon
                    strokeWidth={4}
                    className="w-3 h-3 text-gray-900"
                  />
                </Button>
              </MenuHandler>
              <MenuList>
                <MenuItem onClick={() => setSort("hour")}>last hour</MenuItem>
                <MenuItem onClick={() => setSort("day")}>
                  last 24 hours
                </MenuItem>
                <MenuItem onClick={() => setSort("week")}>last week</MenuItem>
                <MenuItem onClick={() => setSort("month")}>last month</MenuItem>
                <MenuItem onClick={() => setSort("")}>all time</MenuItem>
              </MenuList>
            </Menu>
          </div>
        </div>
      </AdminLayout>
    </>
    // <Container className="mt-5">
    //   <div className="flex items-center justify-between mb-5">
    //     <Typography variant="h3" color="blue-gray" className="font-bold">
    //       Lịch sử
    //     </Typography>
    //     <div className="flex items-center justify-between gap-4">
    //       <div className="shrink-0">
    //         <Menu>
    //           <MenuHandler>
    //             <Button
    //               color="gray"
    //               variant="outlined"
    //               className="flex items-center gap-1 !border-gray-300"
    //             >
    //               last 24h
    //               <ChevronDownIcon
    //                 strokeWidth={4}
    //                 className="w-3 h-3 text-gray-900"
    //               />
    //             </Button>
    //           </MenuHandler>
    //           <MenuList>
    //             <MenuItem>last hour</MenuItem>
    //             <MenuItem>last 24 hours</MenuItem>
    //             <MenuItem>last week</MenuItem>
    //             <MenuItem>last month</MenuItem>
    //             <MenuItem>all time</MenuItem>
    //           </MenuList>
    //         </Menu>
    //       </div>
    //       <Button className=" !border-gray-300" color="gray" variant="outlined">
    //         Export
    //       </Button>
    //     </div>
    //   </div>
    //   {
    //     <Table
    //       TABLE_HEAD={history}
    //       TABLE_ROWS={TABLE_ROWS}
    //       active={active}
    //       setActive={setActive}
    //       noUpdate={true}
    //       noDelete={true}
    //       handleDeleteOpen={handleDeleteOpen}
    //       handleUpdateOpen={handleUpdateOpen}
    //       handleDetailOpen={handleDetailOpen}
    //       updateOpen={updateOpen}
    //       deleteOpen={deleteOpen}
    //       deleteContent="Xóa"
    //       updateContent="Chỉnh sửa"
    //     />
    //   }
    //   {/* <Card>
    //     <table className="w-full min-w-max table-auto text-center">
    //       <TableHeader TABLE_HEAD={history} />
    //       <tbody>
    //         {TABLE_ROWS.map(({ name, role, action, date }, index) => (
    //           <tr key={name} className="even:bg-blue-gray-50/50">
    //             <td className="p-4">
    //               <Typography
    //                 variant="small"
    //                 color="blue-gray"
    //                 className="font-normal"
    //               >
    //                 {name}
    //               </Typography>
    //             </td>
    //             <td className="p-4">
    //               <Typography
    //                 variant="small"
    //                 color="blue-gray"
    //                 className="font-normal"
    //               >
    //                 {role}
    //               </Typography>
    //             </td>
    //             <td className="p-4">
    //               <Typography
    //                 variant="small"
    //                 color="blue-gray"
    //                 className="font-normal"
    //               >
    //                 {action}
    //               </Typography>
    //             </td>
    //             <td className="p-4">
    //               <Typography
    //                 variant="small"
    //                 color="blue-gray"
    //                 className="font-normal"
    //               >
    //                 {date}
    //               </Typography>
    //             </td>
    //           </tr>
    //         ))}
    //       </tbody>
    //     </table>
    //   </Card> */}
    // </Container>
  );
};

export default History;
