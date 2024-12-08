import { Card, Typography, Input, CardBody } from "@material-tailwind/react";
import { Divider } from "@mui/material";
import { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { order, staff_order } from "../../constants/table_head";
import Pagination from "../shared/Pagination";
import {
  useGetCheckInOrdersQuery,
  useUpdateCheckInOrderMutation,
} from "../../apis/orderApi";
import { useGetAllRestaurantsQuery } from "../../apis/restaurantApi";
import { useGetMenusQuery } from "../../apis/menuApi";
import { useDispatch, useSelector } from "react-redux";
import { resetSelectedId } from "../../features/slices/selectIdSlice";
import { Toast } from "../../configs/SweetAlert2";
import Loading from "../shared/Loading";

const Checkin = () => {
  const [active, setActive] = useState(1);
  const [phone, setPhone] = useState('');

  const [subactive, setSubactive] = useState(1);
  const TABLE_ROWS = [];
  const dispatch = useDispatch();
  const TABLE_HEAD = ["Tên món ăn", "Số lượng", "Đơn vị", "Giá", "Thành tiền"];
  const {
    data: orders,
    isLoading: orderLoading,
    error: orderError,
  } = useGetCheckInOrdersQuery({active,phone});
  const [updateCheckInOrder, { isLoading: isAdded, isError: isAddError }] =
    useUpdateCheckInOrderMutation();
  const selectedId = useSelector((state) => state.selectedId.value);
  const handleUpdateCheckIn = async () => {
    try {
      const message = await updateCheckInOrder({ id: selectedId }).unwrap();
      return message;
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Checkin thất bại",
      });
    }
  };
  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };
  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    
    return date.toLocaleString('vi-VN', {
      weekday: 'long',  // Thứ trong tuần (e.g., "Thứ Hai")
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
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
    checkin: formatDateTime(order.checkin),
    total: Number(order.total).toLocaleString("en-US") + " đ",
    status: order.status,
  }));
  return (
    <>
      <AdminLayout
        updateSubmit={handleUpdateCheckIn}
        name="Danh sách bàn hôm nay"
        TABLE_HEAD={staff_order}
        TABLE_ROWS={list_order}
        pagination={orders?.info}
        page={active}
        setPage={setActive}
        updateContent="Xác nhận checkin"
        deleteContent="Xóa"
        noDelete
        noDetail
        sizeUpdate="xl"
        headerUpdate="Xác nhận checkin cho đơn #001"
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
        placeholder="Nhập số điện thoại"
        value={phone}
        onChange={handlePhoneChange}
      />
        </div>
      </AdminLayout>
    </>
  );
};

export default Checkin;
