import { Card, Typography, Input, CardBody, Select, Option, Button } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { staff_order } from "../../constants/table_head";
import {
  useDeleteItemFromOrderMutation,
  useGetCheckOutOrdersQuery,
  useUpdateCheckOutOrderMutation,
  useUpdateOrderMutation,
  useUpdatePaymentStatusMutation,
} from "../../apis/orderApi";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "../../configs/SweetAlert2";
import Loading from "../shared/Loading";
import { useDeleteMenuItemMutation, useGetMenuByRestaurantForStaffQuery, useGetMenusQuery } from "../../apis/menuApi";
import { Divider } from "@mui/material";
import Pagination from "../shared/Pagination";
import { useGetEmployeeByIdQuery } from "../../apis/employeeApi";
import { order_tab } from "../../constants/tab";

const Checkout = () => {
  const [active, setActive] = useState(1);
  const [phone, setPhone] = useState('');
  const [subactive, setSubactive] = useState(1);
  const restaurantId = localStorage.getItem("restaurant_id")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { data: menus, isLoading, error } = useGetMenuByRestaurantForStaffQuery(restaurantId);
  const [updateOrder] = useUpdateOrderMutation();
  const [deleteOrder] = useDeleteItemFromOrderMutation();
  const [updatePaymentStatus] = useUpdatePaymentStatusMutation();
  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };

  const TABLE_ROWS = [];
  const TABLE_HEAD = ["Tên món ăn", "Số lượng", "Đơn vị", "Giá", "Thành tiền", "Hành động"];
  const { data: orders, isLoading: orderLoading, error: orderError, refetch } = useGetCheckOutOrdersQuery({ page: active, phone: phone });

  const [updateCheckOutOrder, { isLoading: isAdded, isError: isAddError }] =
    useUpdateCheckOutOrderMutation();
  const selectedId = useSelector((state) => state.selectedId.value);

  const [selectedMenu, setSelectedMenu] = useState(null);
  const [quantity, setQuantity] = useState(1);

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
  const handlePaymentOrder = async () => {
    try {
      const paymentMethod = "CREDIT_CARD"; // Hoặc lấy từ form người dùng nếu cần
      const totalAmount = orders?.data.find(order => order._id === selectedId)?.total; // Tổng tiền đơn hàng
      const amount_received = orders?.data.find(order => order._id === selectedId)?.amount_received; // Tổng tiền đơn hàng
      const amount_due = totalAmount - amount_received
      const response = await updatePaymentStatus({
        orderId: selectedId,
        paymentMethod,
        amount_due

      }).unwrap();
      if (response.data.paymentLinkRes?.checkoutUrl) {
        // Mở liên kết thanh toán trong tab mới
        window.open(response.data.paymentLinkRes?.checkoutUrl, "_blank");
      }
      Toast.fire({
        icon: "success",
        title: "Thanh toán thành công!",
      });

      // Mở link thanh toán nếu có trong response
      if (response.paymentUrl) {
        window.open(response.paymentUrl, "_blank");
      }
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Thanh toán thất bại!",
      });
    }
  };
  useEffect(() => {
    if (phone) {
      refetch();
    }
  }, [phone, active]);

  const handleUpdateOrder = async () => {
    try {
      const updatedOrder = {
        newListMenu: [
          {
            ...selectedMenu,  // Lấy toàn bộ thuộc tính của selectedMenu
            quantity: quantity,  // Thêm thuộc tính số lượng vào menu
            totalPrice: (selectedMenu.price * quantity * (1 - selectedMenu.discount / 100)) // Tính toán tổng giá
          }
        ],
        total: 0, // Tổng số tiền sẽ được cập nhật trong backend nếu cần.
      };

      // Cập nhật đơn hàng với newListMenu đã được thay đổi
      await updateOrder({ id: selectedId, updatedOrder });

      Toast.fire({
        icon: "success",
        title: "Cập nhật đơn hàng thành công!",
      });
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Cập nhật đơn hàng thất bại!",
      });
    }
  };


  const handleDeleteOrderItem = async (menuId) => {
    try {
      console.log("id", menuId)
      // Gọi API xóa món ăn khỏi đơn hàng
      await deleteOrder({ orderId: selectedId, id: menuId });
      Toast.fire({
        icon: "success",
        title: "Xóa món ăn thành công!",
      });
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Xóa món ăn thất bại!",
      });
    }
  };
  // Khai báo hàm formatDateTime sử dụng const
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
  const mapStatusToLabel = (status) => {
    const tab = order_tab.find((tab) => tab.value === status);
    return tab ? tab.label : "Không xác định"; // Nếu không khớp, trả về "Không xác định"
  };
  const list_order = orders?.data.map((order, index) => ({
    id: order._id,
    order: order.orderCode,
    checkin: formatDateTime(order.checkin),
    total: order.total,
    status: mapStatusToLabel(order.status),
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
                        ?.name || "WALK IN CUSTORMER"
                    }
                  </Typography>
                  {!orders?.data.find((order) => order._id === selectedId)?.is_walk_in && (
                    <>
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
                      </Typography></>
                  )}
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
                  {!orders?.data.find((order) => order._id === selectedId)?.is_walk_in && (

                    <>
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
                      </Typography></>
                  )}
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
                  {!orders?.data.find((order) => order._id === selectedId)?.is_walk_in && (
                    <>
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
                    </>
                  )}
                  <Typography variant="h6" color="blue-gray">
                    Đã nhận:
                  </Typography>
                  <Typography
                    variant="body"
                    className="col-span-2"
                    color="blue-gray"
                  >
                    {Number(
                      orders?.data.find((order) => order._id === selectedId)
                        ?.amount_received
                    ).toLocaleString("en-US")}{" "}
                    đ
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
              <Typography variant="h5" color="blue-gray" className="font-bold mt-5">
                Danh sách thực đơn
              </Typography>

              {/* Form cập nhật món ăn */}
              <div className="mt-5 flex justify-center gap-8">
                <div className="w-1/4">
                  <div className="relative">
                    <Input
                      label="Chọn món ăn"
                      value={selectedMenu ? selectedMenu.name : ''}
                      readOnly
                      className="mb-4"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Tạo hiệu ứng mở dropdown
                    />
                    {isDropdownOpen && (
                      <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 max-h-48 overflow-y-auto">
                        {menus && menus.data.menuItems.map(menu => (
                          <div
                            key={menu._id}
                            className="p-2 cursor-pointer hover:bg-gray-100"
                            onClick={() => {
                              setSelectedMenu(menu);
                              setIsDropdownOpen(false); // Đóng dropdown khi chọn món
                            }}
                          >
                            {menu.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-1/4">
                  <Input
                    label="Số lượng"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    min={1}
                    className="mb-4"
                  />
                </div>

                <div className="w-1/8">
                  <Button
                    color="blue"
                    onClick={handleUpdateOrder}
                    className="w-full"
                  >
                    Thêm món
                  </Button>
                </div>
              </div>

              {/* Hiển thị danh sách món trong đơn hàng */}
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
                    .map(({ name, price, discount, quantity, unit, _id }, index) => {
                      const isLast = index === TABLE_ROWS.length - 1;
                      const classes = isLast
                        ? "p-4"
                        : "p-4 border-b border-blue-gray-50 text-center";

                      return (
                        <tr key={_id}>
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
                          <td className={classes}>
                            <Button
                              color="red"
                              onClick={() => handleDeleteOrderItem(_id)}
                            >
                              Xóa
                            </Button>
                          </td>
                        </tr>

                      );
                    })}

                </tbody>
              </table>
              <Divider />

              <div className="flex justify-end mx-10 my-4">
                <Button
                  color="green"
                  onClick={handlePaymentOrder} // Gọi hàm xử lý thanh toán
                >
                  Thanh toán
                </Button>
              </div>
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

export default Checkout;
