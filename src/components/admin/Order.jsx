import { Card, Typography, Input, CardBody, Button } from "@material-tailwind/react";
import { Toast } from "../../configs/SweetAlert2";
import { Divider, Modal } from "@mui/material";
import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { order_tab } from "../../constants/tab";
import { order } from "../../constants/table_head";
import Pagination from "../shared/Pagination";
import {
  useGetAllOrdersByUserIdQuery,
  useUpdateOrderStatusMutation,
} from "../../apis/orderApi";
import { useSelector } from "react-redux";
import Loading from "../shared/Loading";

const Order = () => {
  const [active, setActive] = useState(1);
  const [subactive, setSubactive] = useState(1);
  const [status, setStatus] = useState(""); // Giá trị mặc định là "ALL"
  const [updateOrderStatus, { isLoading: isUpdated, error: updateError }] = useUpdateOrderStatusMutation(); // Khởi tạo hook mutation

  useEffect(() => {
    setActive(1)
}, [status]);
  const {
    data: orders,
    isLoading,
    error,
    refetch
  } = useGetAllOrdersByUserIdQuery({page:active, status });
  const selectedId = useSelector((state) => state.selectedId.value);
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
  const mapStatusToLabel = (status) => {
    const tab = order_tab.find((tab) => tab.value === status);
    return tab ? tab.label : "Không xác định"; // Nếu không khớp, trả về "Không xác định"
  };
  const list_order = orders?.data.map((order, index) => ({
    id: order._id,
    orderCode: order.orderCode,
    checkin: formatDateTime(order.checkin),
    //phone: order.phone_number,
    total: Number(order.total.toFixed(0)).toLocaleString("en-US") + " đ",
    status: mapStatusToLabel(order.status),
    peopleAmount: order.total_people,
  }));
  const updateSubmit = async () => {
    try {
      const selectedOrder = orders?.data.find((order) => order._id === selectedId);
      if (selectedOrder?.status !== "PENDING") {
        Toast.fire({
          icon: "warning",
          title: "Chỉ có thể cập nhật đơn hàng có trạng thái 'Chờ xác nhận'",
        });
        return;
      }
      const orderId = selectedId;
      const newStatus = "SUCCESS"; 
      const data = await updateOrderStatus({ orderId, newStatus }).unwrap();
      if (data?.status === 200) {
        Toast.fire({
          icon: "success",
          title: "Cập nhật đơn hàng thành công",
        }).then(() => {
          refetch();
        });
      }
    } catch (err) {
      console.error("err", err);
      Toast.fire({
        icon: "error",
        title: "Cập nhật đơn hàng thất bại",
      });
    }
  };
  
  const rejectOrderSubmit = async () => {
    try {
      const selectedOrder = orders?.data.find((order) => order._id === selectedId);
      if (selectedOrder?.status !== "PENDING") {
        Toast.fire({
          icon: "warning",
          title: "Chỉ có thể hủy đơn hàng có trạng thái 'Chờ xác nhận'",
        });
        return;
      }
      const orderId = selectedId;
      const newStatus = "CANCELLED";
      const data = await updateOrderStatus({ orderId, newStatus }).unwrap();
      if (data?.status === 200) {
        Toast.fire({
          icon: "success",
          title: "Hủy đơn hàng thành công",
        }).then(() => {
          refetch();
        });
      }
    } catch (err) {
      console.error("err", err);
      Toast.fire({
        icon: "error",
        title: "Hủy đơn hàng thất bại",
      });
    }
  };
  
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
        tablist={order_tab}
        TABLE_HEAD={order}
        TABLE_ROWS={list_order}
        page={active}
        setPage={setActive}
        setStatus={setStatus}
        pagination={orders?.info}
        updateContent="Chỉnh sửa"
        isOrder={true}
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
                 {
                      orders?.data.find((order) => order._id === selectedId)
                        ?.restaurant.name
                    }
                </Typography>
                
              </div>
              <Divider />

              <div className="grid grid-cols-3 mb-5 mt-5">
              
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
                        ?.total
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
                    ?.menuList?.slice((subactive - 1) * 5, subactive * 5)
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
                  
                </tbody>
              </table>
              <Pagination
                page={Math.ceil(
                  orders?.data?.find((order) => order._id === selectedId)
                    ?.menuList?.length / 5
                )}
                active={subactive}
                setActive={setSubactive}
              />
            </CardBody>
          </Card>
        }
        headerUpdate="Xác nhận đơn hàng"
        bodyUpdate={
          <div>
            Bạn có muốn xác nhận đơn đặt bàn này?
          </div>
        }
        updateSubmit={updateSubmit}
        rejectSubmit={rejectOrderSubmit}
        isUpdated={isUpdated}
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

export default Order;
