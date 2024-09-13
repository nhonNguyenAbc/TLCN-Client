import { Card, Typography, Input, CardBody } from "@material-tailwind/react";
import { Divider } from "@mui/material";
import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { order_tab } from "../../constants/tab";
import { order } from "../../constants/table_head";
import Pagination from "../shared/Pagination";
import {
  useGetAllOrdersByUserIdQuery,
  useGetAllOrdersQuery,
} from "../../apis/orderApi";
import { useSelector } from "react-redux";
import Loading from "../shared/Loading";

const Order = () => {
  const [active, setActive] = useState(1);
  const [subactive, setSubactive] = useState(1);
  const {
    data: orders,
    isLoading,
    error,
  } = useGetAllOrdersByUserIdQuery(active);
  const selectedId = useSelector((state) => state.selectedId.value);
  const TABLE_ROWS = [
    {
      name: "001",
      role: "USER",
      action: "Tạo tài khoản",
      date: "23/04/18",
    },
    {
      name: "001",
      role: "USER",
      action: "Tạo tài khoản",
      date: "23/04/18",
    },
    {
      name: "001",
      role: "USER",
      action: "Tạo tài khoản",
      date: "23/04/18",
    },
    {
      name: "001",
      role: "USER",
      action: "Tạo tài khoản",
      date: "23/04/18",
    },
    {
      name: "001",
      role: "USER",
      action: "Tạo tài khoản",
      date: "23/04/18",
    },
    {
      name: "001",
      role: "USER",
      action: "Tạo tài khoản",
      date: "23/04/18",
    },
  ];
  const tab = useSelector((state) => state.tab.value);
  const list_order = orders?.data.map((order, index) => ({
    id: order._id,
    orderCode: order.orderCode,
    name: order.name,
    phone: order.phone_number,
    total: Number(order.total.toFixed(0)).toLocaleString("en-US") + " đ",
    status: order.status,
    peopleAmount: order.total_people,
  }));
  const TABLE_HEAD = ["STT", "Tên món ăn", "Số lượng", "Giá", "Tổng tiền"];
  if (isLoading)
    return (
      <div>
        <Loading />
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <AdminLayout
        name="Danh sách đơn hàng"
        // tablist={order_tab}
        TABLE_HEAD={order}
        TABLE_ROWS={list_order}
        active={active}
        setActive={setActive}
        pagination={orders?.info}
        updateContent="Chỉnh sửa"
        deleteContent="Xóa"
        noUpdate
        noDelete
        size="xl"
        headerDetail="Chi tiết đơn hàng"
        overflow
        bodyDetail={
          <Card>
            <CardBody>
              <div className="grid grid-cols-3 mb-5">
                <Typography
                  variant="h5"
                  color="blue-gray"
                  className="font-bold"
                >
                  Thông tin liên hệ
                </Typography>
                <div className="col-span-2 grid grid-cols-3">
                  <Typography variant="h6" color="blue-gray">
                    Người nhận bàn:
                  </Typography>
                  <Typography
                    variant="body"
                    className="col-span-2"
                    color="blue-gray"
                  >
                    {
                      orders?.data.find((order) => order._id === selectedId)
                        ?.name
                    }
                  </Typography>
                  <Typography variant="h6" color="blue-gray">
                    Số điện thoại:
                  </Typography>
                  <Typography
                    variant="body"
                    className="col-span-2"
                    color="blue-gray"
                  >
                    {
                      orders?.data.find((order) => order._id === selectedId)
                        ?.phone_number
                    }
                  </Typography>
                </div>
              </div>
              <Divider />
              <div className="grid grid-cols-3 mt-5 mb-5">
                <Typography
                  variant="h5"
                  color="blue-gray"
                  className="font-bold"
                >
                  Phương thức thanh toán
                </Typography>
                <div className="col-span-2 grid grid-cols-3">
                  <Typography variant="h6" color="blue-gray">
                    Hình thức thanh toán
                  </Typography>
                  <Typography
                    variant="body"
                    className="col-span-2"
                    color="blue-gray"
                  >
                    {
                      orders?.data.find((order) => order._id === selectedId)
                        ?.payment
                    }
                  </Typography>
                  <Typography variant="h6" color="blue-gray">
                    Trạng thái
                  </Typography>
                  <Typography
                    variant="body"
                    className="col-span-2"
                    color="blue-gray"
                  >
                    {
                      orders?.data.find((order) => order._id === selectedId)
                        ?.status
                    }
                  </Typography>
                </div>
              </div>
              <Divider />
              <div className="grid grid-cols-3 mt-5 mb-5">
                <Typography
                  variant="h5"
                  color="blue-gray"
                  className="font-bold"
                >
                  Thông tin đơn hàng
                </Typography>
                <div className="col-span-2 grid grid-cols-3">
                  <Typography variant="h6" color="blue-gray">
                    Số người
                  </Typography>
                  <Typography
                    variant="body"
                    className="col-span-2"
                    color="blue-gray"
                  >
                    {
                      orders?.data.find((order) => order._id === selectedId)
                        ?.totalPeople
                    }
                  </Typography>
                  <Typography variant="h6" color="blue-gray">
                    Tổng cộng:
                  </Typography>
                  <Typography
                    variant="body"
                    className="col-span-2"
                    color="blue-gray"
                  >
                    {Number(
                      orders?.data.find((order) => order._id === selectedId)
                        ?.totalOrder
                    )
                      .toFixed(0)
                      .toLocaleString("en-US")}
                    đ
                  </Typography>
                </div>
              </div>
              <Divider />
              <Typography
                variant="h5"
                color="blue-gray"
                className="font-bold mt-5"
              >
                Danh sách thực đơn
              </Typography>
              <table className="w-full table-auto text-center mt-5">
                <thead>
                  <tr>
                    {TABLE_HEAD.map((head) => (
                      <th
                        key={head}
                        className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal leading-none opacity-70"
                        >
                          {head}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders?.data
                    .find((order) => order._id === selectedId)
                    ?.menuList.slice((subactive - 1) * 5, subactive * 5)
                    .map(({ name, price, discount, quantity, unit }, index) => {
                      const isLast = index === TABLE_ROWS.length - 1;
                      const classes = isLast
                        ? "p-4"
                        : "p-4 border-b border-blue-gray-50 text-center";

                      return (
                        <tr key={name}>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {name}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {(price * (1 - discount / 100))
                                .toFixed(0)
                                .toLocaleString("vi-VN")}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {quantity}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {unit}
                            </Typography>
                          </td>
                        </tr>
                      );
                    })}
                  {/* <tr className="bg-blue-gray-50/50">
                    <td className="p-4">Tổng cộng</td>
                    <td></td>
                    <td></td>
                    <td className="p-4">1000000</td>
                  </tr> */}
                </tbody>
              </table>
              <Pagination
                page={Math.ceil(
                  orders?.data?.find((order) => order._id === selectedId)
                    ?.menuList.length / 5
                )}
                active={subactive}
                setActive={setSubactive}
              />
            </CardBody>
          </Card>
        }
        headerUpdate=""
        bodyUpdate=""
      >
        <div className="flex items-center justify-between gap-4">
          <Input
            size="sm"
            label="Tìm kiếm"
            iconFamily="material-icons"
            iconName="search"
            placeholder="Tìm kiếm sản phẩm"
          />
        </div>
      </AdminLayout>

      {/* <Container className="mt-5">
        <div className="flex items-center justify-between mb-5">
          <Typography variant="h3" color="blue-gray" className="font-bold">
            Danh sách đơn hàng
          </Typography>
          <div className="flex items-center justify-between gap-4">
            <Input
              size="sm"
              label="Tìm kiếm"
              iconFamily="material-icons"
              iconName="search"
              placeholder="Tìm kiếm sản phẩm"
            />
          </div>
        </div>

        <Tablist TABS={allorder_tab} tab={tab} setTab={setTab} />

        <Table
          TABLE_HEAD={allorder}
          TABLE_ROWS={TABLE_ROWS}
          active={active}
          setActive={setActive}
          handleUpdateOpen={handleUpdateOpen}
          handleDeleteOpen={handleDeleteOpen}
          handleDetailOpen={handleDetailOpen}
          updateContent="Chỉnh sửa"
          deleteContent="Xóa"
        >
          {TABLE_ROWS.map(
            ({ id, name, address, phone, sum, status }, index) => (
              <tr key={name} className="even:bg-blue-gray-50/50">
                <td className="p-4 cursor-pointer" onClick={handleDetailOpen}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {id}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {name}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {address}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {phone}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {sum}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {status}
                  </Typography>
                </td>
              </tr>
            )
          )}
        </Table>
      </Container>
      <Dialog open={detailOpen} handler={handleDetailOpen}>
        <DialogHeader>Its a simple dialog.</DialogHeader>
        <DialogBody>
          The key to more success is to have a lot of pillows. Put it this way,
          it took me twenty five years to get these plants, twenty five years of
          blood sweat and tears, and I&apos;m never giving up, I&apos;m just
          getting started. I&apos;m up to something. Fan luv.
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleDetailOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="green" onClick={handleDetailOpen}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog> */}
    </>
  );
};

export default Order;
