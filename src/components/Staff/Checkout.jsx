import { Card, Typography, Input, CardBody } from "@material-tailwind/react";
import { Divider } from "@mui/material";
import { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { staff_order } from "../../constants/table_head";
import Pagination from "../shared/Pagination";
import {
  useGetCheckOutOrdersQuery,
  useUpdateCheckOutOrderMutation,
} from "../../apis/orderApi";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "../../configs/SweetAlert2";
import { resetSelectedId } from "../../features/slices/selectIdSlice";
import Loading from "../shared/Loading";

const Checkout = () => {
  const [active, setActive] = useState(1);
  const [subactive, setSubactive] = useState(1);
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
  const dispatch = useDispatch();
  const TABLE_HEAD = ["Tên món ăn", "Số lượng", "Đơn vị", "Giá", "Thành tiền"];
  const {
    data: orders,
    isLoading: orderLoading,
    error: orderError,
  } = useGetCheckOutOrdersQuery(active);
  const [updateCheckOutOrder, { isLoading: isAdded, isError: isAddError }] =
    useUpdateCheckOutOrderMutation();
  const selectedId = useSelector((state) => state.selectedId.value);
  const handleUpdateCheckOut = async () => {
    try {
      const message = await updateCheckOutOrder({ id: selectedId }).unwrap();
      return message;
    } catch (e) {
      Toast.fire({
        icon: "error",
        title: "Checkout thất bại",
      });
    }
  };

  if (orderLoading)
    return (
      <div>
        <Loading />
      </div>
    );
  if (orderError) return <div>Error: {orderError}</div>;
  const list_order = orders?.data.map((order, index) => ({
    id: order._id,
    order: order.orderCode,
    name: order.name,
    phone: order.phone_number,
    total: order.total,
    status: order.status,
    peopleAmount: order.total_people,
  }));
  return (
    <>
      <AdminLayout
        name="Danh sách bàn hôm nay"
        TABLE_HEAD={staff_order}
        TABLE_ROWS={list_order}
        updateSubmit={handleUpdateCheckOut}
        page={active}
        setPage={setActive}
        pagination={orders?.info}
        updateContent="Xác nhận trả bàn"
        deleteContent="Xóa"
        noDelete
        noDetail
        sizeUpdate="xl"
        headerUpdate="Xác nhận trả bàn cho đơn"
        bodyUpdate={
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
                        ?.total_people
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
                        ?.total
                    ).toLocaleString("en-US")}{" "}
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
                    ?.list_menu?.slice((subactive - 1) * 5, subactive * 5)
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
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {(price * (1 - discount / 100)).toLocaleString(
                                "en-US"
                              )}{" "}
                              đ
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {(
                                quantity *
                                price *
                                (1 - discount / 100)
                              ).toLocaleString("en-US")}{" "}
                              đ
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
                    ?.list_menu.length / 5
                )}
                active={subactive}
                setActive={setSubactive}
              />
            </CardBody>
          </Card>
        }
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
    </>
  );
};

export default Checkout;
