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

  const [active, setActive] = React.useState(1);
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  // const [restaurant, setRestaurant] = React.useState(
  //   localStorage.getItem("restaurant") || null
  // );
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

  // const [order, setOrder] = React.useState(
  //   JSON.parse(localStorage.getItem("order") || null)
  // );
  const [order, setOrder] = React.useState(() => {
    const storedOrder = JSON.parse(localStorage.getItem("order"));
    return storedOrder && storedOrder[restaurantId]
      ? storedOrder[restaurantId]
      : null; // Lọc theo restaurantId
  });

  //  const [menu, setMenu] = React.useState(
  //    JSON.parse(localStorage.getItem("menu") || [])
  //  );
  const [menu, setMenu] = React.useState(() => {
    const storedMenu = JSON.parse(localStorage.getItem("menu")); // Lấy toàn bộ menu
    return storedMenu && storedMenu[restaurantId]
      ? storedMenu[restaurantId]
      : []; // Lọc theo restaurantId
  });

  const [method, setMethod] = React.useState("");

  const { data: user, isLoading, error } = useGetUserByIdQuery();
  const [createOrder, { isLoading: isAdded, error: addError }] =
    useCreateOrderMutation();
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
        title: error.message,
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
                  setCheck(true),
                    setName(user?.data.name),
                    setPhone(user?.data.phone),
                    setEmail(user?.data.email);
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
                            {user?.data.name}
                          </Typography>
                          <Divider variant="body" />
                          <Typography variant="body" color="blue-gray">
                            {user?.data.phone}
                          </Typography>
                        </div>
                        <div className="mt-5">
                          <Typography variant="body" color="blue-gray">
                            {user?.data.email}
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
              Sửa
            </Typography>
          </div>
          <Divider />
          <div className="grid grid-cols-3 gap-4 mt-8 mb-8">
            <Typography variant="h6" color="black">
              Nhà hàng
            </Typography>
            {/* <Typography variant="medium" color="black" className="col-span-2">
              {order.restaurantName}
            </Typography> */}
            <Typography variant="medium" color="black" className="col-span-2">
              {restaurant || "N/A"}
            </Typography>
            <Typography variant="h6" color="black">
              Ngày đặt bàn
            </Typography>
            {/* <Typography variant="medium" color="black" className="col-span-2">
              {order?.checkin.slice(0, 10)}
            </Typography> */}
            <Typography variant="medium" color="black" className="col-span-2">
              {order?.checkin
                ? new Date(order.checkin).toISOString().slice(0, 10)
                : "N/A"}
            </Typography>

            <Typography variant="h6" color="black">
              Giờ đặt bàn
            </Typography>
            {/* <Typography variant="medium" color="black" className="col-span-2">
              {order?.checkin.slice(11, 16)}
            </Typography> */}
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
          <Typography variant="h5" color="blue-gray" className="mt-2 mb-2">
            3. Phương thức thanh toán
          </Typography>
          <Divider />
          <Typography>
            <List>
              <ListItem onClick={() => setMethod("CASH")}>
                <div className="flex items-center">
                  <Radio
                    checked={method === "CASH"}
                    name="method"
                    label={<Typography>Thanh toán tiền mặt</Typography>}
                  />
                </div>
              </ListItem>
              <ListItem onClick={() => setMethod("CREDIT_CARD")}>
                <div className="flex items-center">
                  <Radio
                    checked={method === "CREDIT_CARD"}
                    name="method"
                    label={
                      <>
                        <Typography>Thanh toán qua thẻ ngân hàng</Typography>
                      </>
                    }
                  />
                </div>
              </ListItem>
              {/* <ListItem onClick={() => setCheck2(3)}>
                <div className="flex items-center">
                  <Radio
                    checked={check2 === 3}
                    name="method"
                    label={<Typography>Thanh toán qua thẻ ghi nợ</Typography>}
                  />
                </div>
              </ListItem> */}
            </List>
          </Typography>
        </CardBody>
      </Card>
      <Card className="mt-6">
        <CardBody>
          <div className="flex items-center justify-between">
            <Typography variant="h5" color="blue-gray" className="mb-2">
              4. Thực đơn
            </Typography>
            <Typography as="a" onClick={() => navigate(-1)} color="cyan">
              Sửa
            </Typography>
          </div>
          <Divider />
          <div className="flex items-center flex-col justify-between mt-4">
            {/* <Typography className="" variant="body" color="blue-gray">
              1 x{" "}
              <span className="text-cyan-300 w-[100px] text-wrap">Bò kho</span>
            </Typography>
            <div className="grid grid-cols-2 gap-4">
              <Typography variant="body" color="blue-gray">
                58000đ
              </Typography>
              <Typography className="line-through text-gray-400" variant="body">
                58000đ
              </Typography>
            </div> */}
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
                      <Typography variant="body" color="blue-gray">
                        {(
                          item.price *
                          (1 - item.discount / 100)
                        ).toLocaleString("vi-VN")}
                        đ
                      </Typography>
                      <Typography
                        className="line-through text-gray-400"
                        variant="body"
                      >
                        {item.price.toLocaleString("en-US")}đ
                      </Typography>
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
          {/* <Typography variant="body" color="blue-gray" className="mt-5 mb-3">
            Mã giảm giá
          </Typography>
          <div className="flex items-center">
            <Input
              type="text"
              size="sm"
              placeholder="Mã giảm giá"
              className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
              labelProps={{
                className: "hidden",
              }}
              containerProps={{ className: "min-w-[100px]" }}
            />
            <Button
              size="md"
              className="w-1/2"
              variant="outlined"
              color="lightBlue"
            >
              Dùng mã
            </Button>
          </div>
          <Typography variant="body" color="green">
            MX2000
          </Typography> */}
          {/* <div className="flex justify-between items-center mt-5">
            <Typography variant="body" color="blue-gray">
              Tạm tính
            </Typography>
            <Typography variant="body" color="blue-gray">
              {localStorage.getItem("total").toLocaleString("en-US")} đ
            </Typography>
          </div>
          <div className="flex justify-between items-center mt-2">
            <Typography variant="body" color="blue-gray">
              Giảm giá
            </Typography>
            <Typography variant="body" color="blue-gray">
              0 đ
            </Typography>
          </div>*/}
          <div className="mt-5 mb-5">
            <Divider />
          </div>
          <div className="flex justify-between items-center mt-2">
            <Typography variant="body" color="blue-gray">
              Tổng cộng
            </Typography>
            <Typography variant="h6" color="blue-gray">
              {Number(JSON.parse(localStorage.getItem("total")))
                .toFixed(0)
                .toLocaleString("vi-VN")}{" "}
              đ
            </Typography>
          </div>
        </CardBody>
        <CardFooter className="pt-0">
          <Button
            color="red"
            fullWidth
            onClick={handleCreateOrder}
            disabled={!name || !phone || !email || !method || !order}
          >
            Thanh toán
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
Step1Checkout.propTypes = {
  handleNext: PropTypes.func.isRequired,
};
export default Step1Checkout;

// import React from "react";
// import {
//   Button,
//   Card,
//   CardBody,
//   CardFooter,
//   Input,
//   List,
//   ListItem,
//   Radio,
//   Typography,
// } from "@material-tailwind/react";
// import { Divider } from "@mui/material";
// import { useLocation, useNavigate } from "react-router-dom";
// import PropTypes from "prop-types";
// import Pagination from "../shared/Pagination";
// import { useGetUserByIdQuery } from "../../apis/userApi";
// import { useCreateOrderMutation } from "../../apis/orderApi";
// import { Toast } from "../../configs/SweetAlert2";

// const Step1Checkout = ({ restaurantId, handleNext }) => {
//   const [check, setCheck] = React.useState(
//     localStorage.getItem("token") ? true : false
//   );
//   const [active, setActive] = React.useState(1);
//   const [name, setName] = React.useState("");
//   const [phone, setPhone] = React.useState("");
//   const [email, setEmail] = React.useState("");
//   // const [restaurant, setRestaurant] = React.useState(() => {
//   //   // Lấy thông tin nhà hàng từ localStorage
//   //   const order = JSON.parse(localStorage.getItem("order"));
//   //   console.log("abcde:", order);
//   //   return order ? order.restaurantName : null;
//   // });
//   const [restaurant, setRestaurant] = React.useState(() => {
//     // Lấy thông tin order từ localStorage
//     const order = JSON.parse(localStorage.getItem("order"));
//     console.log("abcde:", order);

//     // Kiểm tra xem 'order' có tồn tại hay không và lấy tên nhà hàng từ ID
//     if (order) {
//       // Giả sử bạn muốn lấy thông tin nhà hàng của ID "66db0f980ebea594b6672b98"
//       const id = restaurantId;
//       return order[id] ? order[id].restaurantName : null;
//     }
//     return null;
//   });
//   // const [order, setOrder] = React.useState(
//   //   JSON.parse(localStorage.getItem("order") || null)
//   // );
//   const [order, setOrder] = React.useState(() => {
//     const storedOrder = JSON.parse(localStorage.getItem("order"));
//     return storedOrder && storedOrder[restaurantId]
//       ? storedOrder[restaurantId]
//       : null; // Lọc theo restaurantId
//   });
//   // const [menu, setMenu] = React.useState(() => {
//   //   const storedMenu = localStorage.getItem("menu");
//   //   return storedMenu ? JSON.parse(storedMenu) : []; // Nếu không có dữ liệu, trả về mảng rỗng
//   // });
//   const [menu, setMenu] = React.useState(() => {
//     const storedMenu = JSON.parse(localStorage.getItem("menu")); // Lấy toàn bộ menu
//     return storedMenu && storedMenu[restaurantId]
//       ? storedMenu[restaurantId]
//       : []; // Lọc theo restaurantId
//   });
//   const [method, setMethod] = React.useState("");

//   const { data: user, isLoading, error } = useGetUserByIdQuery();
//   const [createOrder, { isLoading: isAdded, error: addError }] =
//     useCreateOrderMutation();

//   const handleCreateOrder = async () => {
//     try {
//       const message = await createOrder({
//         total_people: order.totalPeople,
//         name: name,
//         phone_number: phone,
//         email: email,
//         payment: method,
//         menu_list: menu,
//         checkin: order.checkin,
//         restaurant_id: order.restaurantId,
//         total: Number(JSON.parse(localStorage.getItem("total"))),
//       }).unwrap();
//       if (message.data.paymentLinkRes) {
//         window.location.replace(message.data.paymentLinkRes.checkoutUrl);
//       } else {
//         navigate(
//           "/checkout?step=1&status=PAID&orderCode=" + message.data.orderCode
//         );
//         handleNext();
//       }
//     } catch (error) {
//       Toast.fire({
//         icon: "error",
//         title: error.message,
//       });
//     }
//   };

//   const navigate = useNavigate();
//   return (
//     <div className="grid grid-cols-3 mb-1">
//       <Card className="mt-6">
//         <CardBody>
//           <Typography variant="h5" color="blue-gray" className="mb-2">
//             1. Thông tin người đặt
//           </Typography>
//           <Divider />
//           <List>
//             {localStorage.getItem("token") ? (
//               <ListItem
//                 onClick={() => {
//                   setCheck(true),
//                     setName(user?.data.name),
//                     setPhone(user?.data.phone),
//                     setEmail(user?.data.email);
//                 }}
//               >
//                 <div className="flex items-center">
//                   <Radio
//                     checked={check}
//                     name="type"
//                     label={
//                       <div className="ms-3">
//                         <div className="flex justify-around gap-4 items-center">
//                           <Typography variant="body" color="blue-gray">
//                             {user?.data.name}
//                           </Typography>
//                           <Divider variant="body" />
//                           <Typography variant="body" color="blue-gray">
//                             {user?.data.phone}
//                           </Typography>
//                         </div>
//                         <div className="mt-5">
//                           <Typography variant="body" color="blue-gray">
//                             {user?.data.email}
//                           </Typography>
//                         </div>
//                       </div>
//                     }
//                   />
//                 </div>
//               </ListItem>
//             ) : (
//               <ListItem onClick={() => navigate("/login")}>
//                 <div className="flex items-center">
//                   <Radio
//                     name="address"
//                     label={
//                       <Typography>
//                         Đăng nhập để chọn thông tin đã lưu
//                       </Typography>
//                     }
//                   />
//                 </div>
//               </ListItem>
//             )}
//             <ListItem
//               onClick={() => {
//                 setCheck(false);
//                 setName(""), setPhone(""), setEmail("");
//               }}
//             >
//               <div className="flex items-center">
//                 <Radio
//                   checked={!check}
//                   name="address"
//                   label={<Typography>Thông tin mới</Typography>}
//                 />
//               </div>
//             </ListItem>
//           </List>
//           {!check && (
//             <form className="mb-2 w-full mx-auto">
//               <div className="mb-1 flex flex-col gap-6">
//                 <Typography variant="h6" color="blue-gray" className="-mb-3">
//                   Họ và tên người đặt bàn
//                 </Typography>
//                 <Input
//                   size="lg"
//                   placeholder="Nguyễn Văn A"
//                   className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
//                   labelProps={{
//                     className: "before:content-none after:content-none",
//                   }}
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                 />
//                 <Typography variant="h6" color="blue-gray" className="-mb-3">
//                   Số điện thoại
//                 </Typography>
//                 <Input
//                   size="lg"
//                   placeholder="000000000"
//                   className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
//                   labelProps={{
//                     className: "before:content-none after:content-none",
//                   }}
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value)}
//                 />
//                 <Typography variant="h6" color="blue-gray" className="-mb-3">
//                   Email
//                 </Typography>
//                 <Input
//                   className="min-h-full border-1 focus:!border-gray-900"
//                   containerProps={{
//                     className: "grid h-full",
//                   }}
//                   labelProps={{
//                     className: "before:content-none after:content-none",
//                   }}
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//               </div>
//             </form>
//           )}
//         </CardBody>
//       </Card>
//       <Card className="mt-6">
//         <CardBody>
//           <div className="flex items-center justify-between">
//             <Typography variant="h5" color="blue-gray" className="mb-2">
//               2. Thông tin đặt bàn
//             </Typography>
//             <Typography as="a" onClick={() => navigate(-1)} color="cyan">
//               Sửa
//             </Typography>
//           </div>
//           <Divider />
//           <div className="grid grid-cols-3 gap-4 mt-8 mb-8">
//             <Typography variant="h6" color="black">
//               Nhà hàng
//             </Typography>
//             <Typography variant="medium" color="black" className="col-span-2">
//               {restaurant || "N/A"}
//             </Typography>
//             <Typography variant="h6" color="black">
//               Ngày đặt bàn
//             </Typography>
//             <Typography variant="medium" color="black" className="col-span-2">
//               {order?.checkin
//                 ? new Date(order.checkin).toISOString().slice(0, 10)
//                 : "N/A"}
//             </Typography>

//             <Typography variant="h6" color="black">
//               Giờ đặt bàn
//             </Typography>
//             <Typography variant="medium" color="black" className="col-span-2">
//               {typeof order?.checkin === "string"
//                 ? order.checkin.slice(11, 16)
//                 : "Không có giờ checkin"}
//             </Typography>

//             <Typography variant="h6" color="black">
//               Số lượng người
//             </Typography>
//             <Typography variant="medium" color="black" className="col-span-2">
//               {order?.totalPeople}
//             </Typography>
//           </div>
//         </CardBody>
//       </Card>
//       <Card className="mt-6">
//         <CardBody>
//           <Typography variant="h5" color="blue-gray" className="mb-2">
//             3. Chọn phương thức thanh toán
//           </Typography>
//           <Divider />
//           <div className="mt-8">
//             <Radio
//               checked={method === "credit"}
//               onChange={() => setMethod("credit")}
//               label="Thẻ tín dụng"
//             />
//             <Radio
//               checked={method === "cash"}
//               onChange={() => setMethod("cash")}
//               label="Tiền mặt"
//             />
//           </div>
//         </CardBody>
//       </Card>
//       <div className="mt-4">
//         <button
//           className="btn btn-primary w-full"
//           onClick={handleCreateOrder}
//           disabled={isAdded}
//         >
//           {isAdded ? "Đang xử lý..." : "Tiến hành thanh toán"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Step1Checkout;
