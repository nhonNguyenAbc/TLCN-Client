import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Input,
  List,
  ListItem,
  Radio,
  Typography,
} from "@material-tailwind/react";
import { Divider } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Pagination from "../shared/Pagination";
import { useGetUserByIdQuery } from "../../apis/userApi";
import { useCreateOrderMutation } from "../../apis/orderApi";
import { Toast } from "../../configs/SweetAlert2";
const Step1Checkout = ({ restaurantId, handleNext }) => {
  const [check, setCheck] = React.useState(
    localStorage.getItem("token") ? true : false
  );

  const total = React.useMemo(() => {
    return Number(JSON.parse(localStorage.getItem("total")) || 0);
  }, []);
  const [active, setActive] = React.useState(1);
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [restaurant, setRestaurant] = React.useState(() => {
    // Lấy thông tin order từ localStorage
    const order = JSON.parse(localStorage.getItem("order"));
    // Kiểm tra xem 'order' có tồn tại hay không và lấy tên nhà hàng từ ID
    if (order) {
      const id = restaurantId;
      return order[id] ? order[id].restaurantName : null;
    }
    return null;
  });


  const [order, setOrder] = React.useState(() => {
    const storedOrder = JSON.parse(localStorage.getItem("order"));
    return storedOrder && storedOrder[restaurantId]
      ? storedOrder[restaurantId]
      : null;
  });


  const [menu, setMenu] = React.useState(() => {
    const storedOrders = JSON.parse(localStorage.getItem("order")); // Lấy toàn bộ orders
    return storedOrders && storedOrders[restaurantId]
      ? storedOrders[restaurantId].menu // Lấy menu theo restaurantId
      : []; // Nếu không có, trả về mảng rỗng
  });

  const [promotionValue, setPromotionValue] = React.useState(() => {
    const storedOrders = JSON.parse(localStorage.getItem("order")); // Lấy toàn bộ orders
    return storedOrders && storedOrders[restaurantId]
      ? storedOrders[restaurantId].promotionValue // Lấy promotionValue theo restaurantId
      : 0; // Nếu không có, mặc định là 0
  });

  const [method, setMethod] = React.useState("");

  const { data: user, isLoading, error } = useGetUserByIdQuery();

  React.useEffect(() => {
    // Tự động chọn phương thức thanh toán dựa trên giá trị của total
    if (total === 0) {
      setMethod("CASH");
    } else if (total > 0) {
      setMethod("CREDIT_CARD");
    }
  }, [total]);

  const [createOrder, { isLoading: isAdded, error: addError }] =
    useCreateOrderMutation();
  React.useEffect(() => {
    if (localStorage.getItem("token") && user?.data) {
      setCheck(true);
      setName(user.data.name);
      setPhone(user.data.phone);
      setEmail(user.data.email);
    } else {
      setCheck(false);
      setName("");
      setPhone("");
      setEmail("");
    }
  }, [user]);
  const handleCreateOrder = async () => {
    try {
      const message = await createOrder({
        total_people: order.totalPeople,
        name: name,
        phone_number: phone,
        email: email,
        payment: method,
        menu_list: menu,
        checkin: order.checkin,
        restaurant_id: order.restaurantId,
        total: Number(JSON.parse(localStorage.getItem("total"))),
      }).unwrap();
      if (message.data.paymentLinkRes) {
        window.location.replace(message.data.paymentLinkRes.checkoutUrl);
      } else {
        navigate(
          "/checkout?step=1&status=PAID&orderCode=" + message.data.orderCode
        );
        handleNext();
      }
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Không còn bàn trống vào thời gian này",
        width: "auto"
      });
    }
  };
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-3 mb-1">
      <Card className="mt-6">
        <CardBody>
          <Typography variant="h5" color="blue-gray" className="mb-2">
            1. Thông tin người đặt
          </Typography>
          <Divider />
          <List>
            {localStorage.getItem("token") ? (
              <ListItem
                onClick={() => {
                  setCheck(true);
                  setName(user?.data?.name || "");
                  setPhone(user?.data?.phone || "");
                  setEmail(user?.data?.email || "");
                }}
              >
                <div className="flex items-center">
                  <Radio
                    checked={check}
                    name="type"
                    label={
                      <div className="ms-3">
                        <div className="flex justify-around gap-4 items-center">
                          <Typography variant="body" color="blue-gray">
                            {user?.data?.name || "N/A"}
                          </Typography>
                          <Divider variant="body" />
                          <Typography variant="body" color="blue-gray">
                            {user?.data?.phone || "N/A"}
                          </Typography>
                        </div>
                        <div className="mt-5">
                          <Typography variant="body" color="blue-gray">
                            {user?.data?.email || "N/A"}
                          </Typography>
                        </div>
                      </div>
                    }
                  />
                </div>
              </ListItem>

            ) : (
              <ListItem onClick={() => navigate("/login")}>
                <div className="flex items-center">
                  <Radio
                    name="address"
                    label={
                      <Typography>
                        Đăng nhập để chọn thông tin đã lưu
                      </Typography>
                    }
                  />
                </div>
              </ListItem>
            )}
            <ListItem
              onClick={() => {
                setCheck(false);
                setName(""), setPhone(""), setEmail("");
              }}
            >
              <div className="flex items-center">
                <Radio
                  checked={!check}
                  name="address"
                  label={<Typography>Thông tin mới</Typography>}
                />
              </div>
            </ListItem>
          </List>
          {!check && (
            <form className="mb-2 w-full mx-auto">
              <div className="mb-1 flex flex-col gap-6">
                <Typography variant="h6" color="blue-gray" className="-mb-3">
                  Họ và tên người đặt bàn
                </Typography>
                <Input
                  size="lg"
                  placeholder="Nguyễn Văn A"
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Typography variant="h6" color="blue-gray" className="-mb-3">
                  Số điện thoại
                </Typography>
                <Input
                  size="lg"
                  placeholder="000000000"
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Typography variant="h6" color="blue-gray" className="-mb-3">
                  Email
                </Typography>
                <Input
                  className="min-h-full border-1 focus:!border-gray-900"
                  containerProps={{
                    className: "grid h-full",
                  }}
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </form>
          )}
        </CardBody>
      </Card>
      <Card className="mt-6">
        <CardBody>
          <div className="flex items-center justify-between">
            <Typography variant="h5" color="blue-gray" className="mb-2">
              2. Thông tin đặt bàn
            </Typography>
            <Typography as="a" onClick={() => navigate(-1)} color="cyan">
              Thay đổi
            </Typography>
          </div>
          <Divider />
          <div className="grid grid-cols-3 gap-4 mt-8 mb-8">
            <Typography variant="h6" color="black">
              Nhà hàng
            </Typography>

            <Typography variant="medium" color="black" className="col-span-2">
              {restaurant || "N/A"}
            </Typography>
            <Typography variant="h6" color="black">
              Ngày đặt bàn
            </Typography>

            <Typography variant="medium" color="black" className="col-span-2">
              {order?.checkin
                ? new Date(order.checkin).toISOString().slice(0, 10)
                : "N/A"}
            </Typography>

            <Typography variant="h6" color="black">
              Giờ đặt bàn
            </Typography>

            <Typography variant="medium" color="black" className="col-span-2">
              {typeof order?.checkin === "string"
                ? order.checkin.slice(11, 16)
                : "Không có giờ checkin"}
            </Typography>

            <Typography variant="h6" color="black">
              Số lượng người
            </Typography>
            <Typography variant="medium" color="black" className="col-span-2">
              {order?.totalPeople}
            </Typography>
          </div>
          <Typography variant="h5" color="blue-gray" className="mb-2">
            3. Phương thức thanh toán
          </Typography>
          <Divider />
          <List>
            <ListItem onClick={() => setMethod("CASH")} disabled={total > 0}>
              <div className="flex items-center">
                <Radio
                  checked={method === "CASH"}
                  name="method"
                  label={<Typography>Thanh toán tiền mặt</Typography>}
                />
              </div>
            </ListItem>
            <ListItem onClick={() => setMethod("CREDIT_CARD")} disabled={total === 0}>
              <div className="flex items-center">
                <Radio
                  checked={method === "CREDIT_CARD"}
                  name="method"
                  label={<Typography>Thanh toán qua thẻ ngân hàng</Typography>}
                />
              </div>
            </ListItem>
          </List>
        </CardBody>
      </Card>
      <Card className="mt-6">
        <CardBody>
          <div className="flex items-center justify-between">
            <Typography variant="h5" color="blue-gray" className="mb-2">
              4. Thực đơn
            </Typography>
            <Typography as="a" onClick={() => navigate(-1)} color="cyan">
              Thay đổi
            </Typography>
          </div>
          <Divider />
          <div className="flex items-center flex-col justify-between mt-4">

            {menu &&
              menu?.length > 0 &&
              menu?.slice((active - 1) * 6, active * 6).map((item) => (
                <>
                  <div className="flex justify-between w-full">
                    <Typography variant="body" color="blue-gray">
                      {item.quantity} x{" "}
                      <span className="text-cyan-300 w-[100px] text-wrap">
                        {item.name}
                      </span>
                    </Typography>
                    <div className="grid grid-cols-2 gap-4">
                      {promotionValue > 0 ? (
                        <>
                          <Typography variant="body" color="blue-gray">
                            {(
                              item.price *
                              (1 - promotionValue / 100)
                            ).toLocaleString("vi-VN")}
                            đ
                          </Typography>
                          <Typography
                            className="line-through text-gray-400"
                            variant="body"
                          >
                            {item.price.toLocaleString("en-US")}đ
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Typography
                            variant="body"
                          >
                            {item.price.toLocaleString("en-US")}đ
                          </Typography>
                        </>
                      )}
                    </div>
                  </div>
                </>
              ))}
            <Pagination
              page={Math.ceil(menu.length / 6)}
              active={active}
              setActive={setActive}
            />
          </div>

          <div className="mt-5 mb-5">
            <Divider />
          </div>
          <div className="flex justify-between items-center mt-2">
            <Typography variant="body" color="blue-gray">
              Tổng cộng
            </Typography>
            <Typography variant="h6" color="blue-gray">
              {Number(JSON.parse(localStorage.getItem("total")))
                .toLocaleString("vi-VN")}{" "}
              đ
            </Typography>
          </div>
        </CardBody>
        <CardFooter className="pt-0">
          {method === "CASH" ? (
            <Button
            color="red"
            fullWidth
            onClick={handleCreateOrder}
            disabled={!name || !phone || !email || !method || !order}
          >
            Xác nhận
          </Button>
          ):(
            <Button
            color="red"
            fullWidth
            onClick={handleCreateOrder}
            disabled={!name || !phone || !email || !method || !order}
          >
            Thanh toán
          </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};
Step1Checkout.propTypes = {
  handleNext: PropTypes.func.isRequired,
};
export default Step1Checkout;
