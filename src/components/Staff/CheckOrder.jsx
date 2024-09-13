import {
  Button,
  Card,
  DialogBody,
  DialogHeader,
  IconButton,
  Typography,
  Dialog,
  Tooltip,
  Select,
  Option,
  CardBody,
  Stepper,
  Step,
} from "@material-tailwind/react";
import { Container, Divider } from "@mui/material";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { order_tab } from "../../constants/tab";
import { order } from "../../constants/table_head";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from "../shared/Pagination";
import TableHeader from "../shared/TableHeader";
import Step1Checkout from "./Step1Checkout";
import Step2Checkout from "../restaurant/Step2Checkout";
import Step3Checkout from "./Step3Checkout";
import CloseIcon from "@mui/icons-material/Close";
import {
  useGetAllOrdersByStaffIdQuery,
  useGetAllOrdersQuery,
  useGetCheckInOrdersQuery,
  useUpdateCheckInOrderMutation,
  useUpdateOrderMutation,
} from "../../apis/orderApi";
import { useGetAllRestaurantsQuery } from "../../apis/restaurantApi";
import { useGetMenusQuery } from "../../apis/menuApi";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "../../configs/SweetAlert2";
import { resetSelectedId } from "../../features/slices/selectIdSlice";
const CheckOrder = () => {
  const [active, setActive] = useState(1);
  const [subactive, setSubactive] = useState(1);
  const TABLE_ROWS = [
    {
      name: "001",
      quantity: 1,
      price: 1000000,
    },
    {
      name: "001",
      quantity: 1,
      price: 1000000,
    },
    {
      name: "001",
      quantity: 1,
      price: 1000000,
    },
    {
      name: "001",
      quantity: 1,
      price: 1000000,
    },
    {
      name: "001",
      quantity: 1,
      price: 1000000,
    },
    {
      name: "001",
      quantity: 1,
      price: 1000000,
    },
    {
      name: "001",
      quantity: 1,
      price: 1000000,
    },
    {
      name: "001",
      quantity: 1,
      price: 1000000,
    },
  ];
  const TABLE_HEAD = [
    { label: "Tên món ăn", col: 1 },
    { label: "Giá", col: 1 },
    { label: "Số lượng", col: 1 },
    { label: "Đơn vị", col: 1 },
    { label: "Tổng tiền", col: 1 },
  ];
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = React.useState(0);
  const [isLastStep, setIsLastStep] = React.useState(false);
  const [isFirstStep, setIsFirstStep] = React.useState(false);

  const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);
  // const {data: orders, isLoading: orderLoading, error: orderError} = useGetAllOrdersQuery();
  // if (orderLoading) return <div>Loading...</div>;
  // if (orderError) return <div>Error: {orderError}</div>;
  const {
    data: restaurants,
    isLoading: restaurantLoading,
    error: restaurantError,
  } = useGetAllRestaurantsQuery({
    page: active,
    sort: "new",
    upper: 100000000,
    lower: 0,
  });
  const {
    data: menus,
    isLoading: menuLoading,
    error: menuError,
  } = useGetMenusQuery(active);
  const {
    data: orders,
    isLoading: orderLoading,
    error: orderError,
  } = useGetAllOrdersByStaffIdQuery(active);
  const [updateOrder, { isLoading: updateLoading }] = useUpdateOrderMutation();
  const [
    updateCheckInOrder,
    { isLoading: updateCheckinOrderLoading, error: updateCheckinOrderError },
  ] = useUpdateCheckInOrderMutation();
  const selectedId = useSelector((state) => state.selectedId.value);
  const handleUpdateCheckIn = async () => {
    const message = await updateCheckInOrder({ id: selectedId });
    if (message.data.statusCode === 200) {
      Toast.fire({
        icon: "success",
        title: "Checkin thành công",
      }).then(() => {
        dispatch(resetSelectedId());
      });
    } else {
      Toast.fire({
        icon: "error",
        title: "Checkin thất bại",
      });
    }
  };
  const [quantity, setQuantity] = useState(1);
  if (orderLoading) return <div>Loading...</div>;
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
        name="Danh sách đơn hàng"
        TABLE_HEAD={order}
        TABLE_ROWS={list_order}
        pagination={orders?.info}
        page={active}
        setPage={setActive}
        updateContent="Chỉnh sửa"
        deleteContent="Xóa"
        noDelete
        size="xl"
        headerDetail="Chi tiết đơn hàng #001"
        // overflow
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
        updateOverflow
        sizeUpdate="xxl"
        headerUpdate="Chỉnh sửa thực đơn"
        bodyUpdate={
          <Card>
            <CardBody>
              <div className="grid grid-cols-3 gap-8 ">
                <div>
                  <Typography variant="h4" className="mb-5">
                    Danh sách thực đơn
                  </Typography>
                  <div className="grid grid-cols-2 gap-8">
                    <Typography
                      variant="h5"
                      color="blue-gray"
                      className="font-bold"
                    >
                      Tên món
                    </Typography>
                    <div>
                      <Select
                        className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                        labelProps={{
                          className: "hidden",
                        }}
                      >
                        {menus?.data
                          .filter((menu) => menu.restaurant._id === selectedId)
                          .map((menu) => (
                            <Option key={menu._id} value={menu._id}>
                              {menu.name}
                            </Option>
                          ))}
                      </Select>
                    </div>
                    <Typography
                      variant="h5"
                      color="blue-gray"
                      className="font-bold"
                    >
                      Số lượng
                    </Typography>
                    <div className="flex h-fit gap-4">
                      <Button
                        size="sm"
                        variant="outlined"
                        onClick={() =>
                          setQuantity(quantity - 1 < 1 ? 1 : quantity - 1)
                        }
                      >
                        -
                      </Button>
                      <Typography className="my-auto">{quantity}</Typography>
                      <Button
                        size="sm"
                        variant="outlined"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                    <Typography
                      variant="h5"
                      color="blue-gray"
                      className="font-bold my-auto"
                    >
                      Thành tiền
                    </Typography>
                    <div className="flex justify-start gap-4">
                      <Typography className="my-auto">
                        {Number(100000).toLocaleString("en-US")} đ
                      </Typography>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <Typography variant="h4">Danh sách thực đơn</Typography>
                  <table className="w-full table-auto text-left mt-5">
                    <TableHeader TABLE_HEAD={TABLE_HEAD} />
                    <tbody>
                      {/* {TABLE_ROWS.slice((subactive - 1) * 4, subactive * 4).map(
                        ({ name, job, date }, index) => {
                          const isLast = index === TABLE_ROWS.length - 1;
                          const classes = isLast
                            ? "p-4"
                            : "p-4 border-b border-blue-gray-50";

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
                                  {job}
                                </Typography>
                              </td>
                              <td className={classes}>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  {date}
                                </Typography>
                              </td>
                              <td className={classes}>
                                <Tooltip content="Xóa món ăn">
                                  <IconButton color="red">
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </td>
                            </tr>
                          );
                        }
                      )} */}
                      {TABLE_ROWS.slice((subactive - 1) * 5, subactive * 5).map(
                        ({ name, quantity, price }, index) => {
                          const isLast = index === TABLE_ROWS.length - 1;
                          const classes = isLast
                            ? "p-4"
                            : "p-4 border-b border-blue-gray-50";

                          return (
                            <tr key={name}>
                              <td className={classes}>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  {index + (subactive - 1) * 5 + 1}
                                </Typography>
                              </td>
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
                                  {price.toLocaleString("en-US")} đ
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
                                  {Number(quantity * price).toLocaleString(
                                    "en-US"
                                  )}{" "}
                                  đ
                                </Typography>
                              </td>
                              <td className={classes}>
                                <Tooltip content="Xóa món ăn">
                                  <IconButton color="red">
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </td>
                            </tr>
                          );
                        }
                      )}
                      <tr className="bg-blue-gray-50/50">
                        <td className="p-4">Tổng cộng</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className="p-4">1000000</td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                  <Pagination
                    page={Math.ceil(TABLE_ROWS.length / 4)}
                    active={subactive}
                    setActive={setSubactive}
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        }
      >
        <div className="flex items-center justify-between gap-4">
          <Button variant="outlined" onClick={handleOpen}>
            Thêm mới
          </Button>
        </div>
      </AdminLayout>
      <Dialog
        open={open}
        handler={handleOpen}
        size="xxl"
        className="h-screen overflow-y-auto"
      >
        <DialogHeader className="pb-0 flex justify-between">
          <Typography variant="h4">Đặt bàn</Typography>
          <IconButton
            className="border-none"
            variant="outlined"
            onClick={handleOpen}
          >
            <CloseIcon />
          </IconButton>
        </DialogHeader>
        <DialogBody>
          <Container className="mb-5">
            <Stepper
              activeStep={activeStep}
              isLastStep={(value) => setIsLastStep(value)}
              isFirstStep={(value) => setIsFirstStep(value)}
              activeLineClassName="bg-[#FF333A]"
            >
              <Step
                onClick={() => setActiveStep(0)}
                activeClassName="ring-0 !bg-[#FF333A] text-white"
                completedClassName="!bg-[#FF333A] text-white"
              >
                1
              </Step>
              <Step
                onClick={() => setActiveStep(1)}
                activeClassName="ring-0 !bg-[#FF333A] text-white"
                completedClassName="!bg-[#FF333A] text-white"
              >
                2
              </Step>
              <Step
                onClick={() => setActiveStep(2)}
                activeClassName="ring-0 !bg-[#FF333A] text-white"
                completedClassName="!bg-[#FF333A] text-white"
              >
                3
              </Step>
            </Stepper>
          </Container>
          {activeStep === 0 && <Step1Checkout handleNext={handleNext} />}
          {activeStep === 1 && (
            <Step2Checkout handleNext={handleNext} handlePrev={handlePrev} />
          )}
          {activeStep === 2 && <Step3Checkout handleOpen={handleOpen} />}
        </DialogBody>
      </Dialog>
    </>
  );
};

export default CheckOrder;
