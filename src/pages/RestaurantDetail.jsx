import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  IconButton,
  Input,
  Option,
  Select,
  Typography,
} from "@material-tailwind/react";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useGetAllTablesQuery,
  useGetTableByAnyFieldQuery,
} from "../apis/tableApi";
import { useGetMenuItemsByAnyFieldQuery } from "../apis/menuApi";
import { useGetRestaurantByIdQuery } from "../apis/restaurantApi";
import Loading from "../components/shared/Loading";
import { TextField } from "@mui/material";
// const restaurants? = [
//   {
//     id: 1,
//     name: "Hương Sen",
//     address: "123 Nguyễn Văn Linh",
//     imageUrl:
//       "https://images.unsplash.com/photo-1540553016722-983e48a2cd10?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
//     rating: 4.5,
//     numReviews: 100,
//     price: 100000,
//   },
//   {
//     id: 2,
//     name: "Hương Sen",
//     address: "123 Nguyễn Văn Linh",
//     imageUrl:
//       "https://images.unsplash.com/photo-1540553016722-983e48a2cd10?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
//     rating: 4.5,
//     numReviews: 100,
//     price: 100000,
//   },
//   {
//     id: 3,
//     name: "Hương Sen",
//     address: "123 Nguyễn Văn Linh",
//     imageUrl:
//       "https://images.unsplash.com/photo-1540553016722-983e48a2cd10?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
//     rating: 4.5,
//     numReviews: 100,
//     price: 100000,
//   },
//   {
//     id: 4,
//     name: "Hương Sen",
//     address: "123 Nguyễn Văn Linh",
//     imageUrl:
//       "https://images.unsplash.com/photo-1540553016722-983e48a2cd10?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
//     rating: 4.5,
//     numReviews: 100,
//     price: 100000,
//   },
//   {
//     id: 5,
//     name: "Hương Sen",
//     address: "123 Nguyễn Văn Linh",
//     imageUrl:
//       "https://images.unsplash.com/photo-1540553016722-983e48a2cd10?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
//     rating: 4.5,
//     numReviews: 100,
//     price: 100000,
//   },
//   {
//     id: 6,
//     name: "Hương Sen",
//     address: "123 Nguyễn Văn Linh",
//     imageUrl:
//       "https://images.unsplash.com/photo-1540553016722-983e48a2cd10?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
//     rating: 4.5,
//     numReviews: 100,
//     price: 100000,
//   },
//   {
//     id: 6,
//     name: "Hương Sen",
//     address: "123 Nguyễn Văn Linh",
//     imageUrl:
//       "https://images.unsplash.com/photo-1540553016722-983e48a2cd10?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
//     rating: 4.5,
//     numReviews: 100,
//     price: 100000,
//   },
// ];
// const menuItem = [
//   {
//     name: "Bò hầm",
//     price: 100000,
//   },
//   {
//     name: "Hủ tiếu",
//     price: 50000,
//   },
//   {
//     name: "Phở",
//     price: 70000,
//   },
//   {
//     name: "Bún bò",
//     price: 80000,
//   },
//   {
//     name: "Bún riêu",
//     price: 60000,
//   },
//   {
//     name: "Bún mắm",
//     price: 90000,
//   },
//   {
//     name: "Bún chả",
//     price: 100000,
//   },
//   {
//     name: "Bún đậu",
//     price: 120000,
//   },
//   {
//     name: "Bún thịt nướng",
//     price: 110000,
//   },
//   {
//     name: "Bún ốc",
//     price: 130000,
//   },
// ];
const RestaurantDetail = () => {
  const { id } = useParams();
  const {
    data: restaurants,
    isLoading: restaurantLoading,
    error: restaurantError,
  } = useGetRestaurantByIdQuery(id);
  // const {
  //   data: tables,
  //   isLoading: tableLoading,
  //   error: tableError,
  // } = useGetTableByAnyFieldQuery(id);
  // const {
  //   data: menus,
  //   isLoading: menuLoading,
  //   error: menuError,
  // } = useGetMenuItemsByAnyFieldQuery(id);
  const navigate = useNavigate();
  const [table, setTable] = React.useState(0);
  const [people, setPeople] = React.useState(
    JSON.parse(localStorage.getItem("order"))?.totalPeople || 0
  );
  const [date, setDate] = React.useState(
    JSON.parse(localStorage.getItem("order"))?.checkin.split("T")[0] ||
      new Date().toISOString().split("T")[0]
  );
  const [time, setTime] = React.useState(
    JSON.parse(localStorage.getItem("order"))
      ? JSON.parse(localStorage.getItem("order"))
          .checkin.split("T")[1]
          .split(".")[0]
          .split(":")
          .slice(0, 2)
          .join(":")
      : null
  );
  const [menu, setMenu] = React.useState(
    JSON.parse(localStorage.getItem("menu")) || []
  );
  const [total, setTotal] = React.useState(
    JSON.parse(localStorage.getItem("total")) || 0
  );
  React.useEffect(() => {
    localStorage.setItem("total", JSON.stringify(total));
  }, [total]);
  if (restaurantLoading)
    return (
      <div>
        <Loading />
      </div>
    );
  if (restaurantError) return <div>Error</div>;

  const handleAddToCart = (item) => {
    const newMenu = [...menu];
    const index = newMenu.findIndex((i) => i._id === item._id);
    if (index === -1) {
      newMenu.push({ ...item, quantity: 1 });
      setTotal(total + item.price * (1 - item.discount / 100));
    } else {
      newMenu[index].quantity++;
      setTotal(total + item.price * (1 - newMenu[index].discount / 100));
    }
    setMenu(newMenu);
    localStorage.setItem("menu", JSON.stringify(newMenu));
  };
  const handleRemoveFromCart = (item) => {
    const newMenu = [...menu];
    const index = newMenu.findIndex((i) => i._id === item._id);
    if (index === -1) return;
    if (newMenu[index].quantity === 1) {
      newMenu.splice(index, 1);
      setTotal(total - item.price * (1 - item.discount / 100));
    } else {
      newMenu[index].quantity--;
      setTotal(total - item.price * (1 - newMenu[index].discount / 100));
    }
    setMenu(newMenu);

    localStorage.setItem("menu", JSON.stringify(newMenu));
    localStorage.setItem("total", JSON.stringify(total));
  };
  const handleCheckout = () => {
    const result = {
      restaurantName: restaurants.data.restaurant.name,
      totalPeople: people,
      total: total,
      menu: menu,
      checkin: date + "T" + time + ":00.000Z",
      restaurantId: id,
    };
    localStorage.setItem("order", JSON.stringify(result));
    navigate("/checkout");
  };

  return (
    <>
      <div className="mb-5"></div>
      <div className="grid grid-cols-3 gap-8 m-4">
        <img
          src={restaurants.data.restaurant.image_url}
          className="w-full h-80 object-cover rounded-lg col-span-2"
          alt="restaurant"
        />
        <div className="grid grid-cols-2 gap-8">
          <img
            src={restaurants?.data.restaurant.slider1}
            className="h-36 object-cover rounded-lg "
            alt="restaurant"
          />
          <img
            src={restaurants?.data.restaurant.slider2}
            className="h-36 object-cover rounded-lg"
            alt="restaurant"
          />
          <img
            src={restaurants?.data.restaurant.slider3}
            className="h-36 object-cover rounded-lg "
            alt="restaurant"
          />
          <img
            src={restaurants?.data.restaurant.slider4}
            className="h-36 object-cover rounded-lg"
            alt="restaurant"
          />
        </div>
        <div className="col-span-2">
          <Card>
            <CardBody>
              <Typography variant="h3" color="black">
                {restaurants?.data.restaurant.name}
              </Typography>
              <div className="grid grid-cols-4 my-4">
                <Typography variant="h6">Thời gian hoạt động:</Typography>
                <Typography variant="medium" className="col-span-3">
                  {restaurants.data.restaurant.openTime} -{" "}
                  {restaurants.data.restaurant.closeTime}
                </Typography>
              </div>
              <div className="grid grid-cols-4 my-4">
                <Typography variant="h6">Địa chỉ:</Typography>
                <Typography variant="medium" className="col-span-3">
                  {restaurants.data.restaurant.address}
                </Typography>
              </div>
              <div className="grid grid-cols-4 my-4">
                <Typography variant="h6">Giá:</Typography>
                <Typography variant="medium" className="col-span-3">
                  {Number(
                    restaurants.data.restaurant.price_per_table
                  ).toLocaleString("en-US")}{" "}
                  đ/ người
                </Typography>
              </div>
            </CardBody>
          </Card>
          <Card className="mt-5">
            <CardBody>
              <Typography variant="h3" color="black">
                Chi tiết về {restaurants.data.restaurant.name}
              </Typography>
              <Typography variant="medium" color="black" className="my-5">
                {restaurants?.data.restaurant.description}
              </Typography>
            </CardBody>
          </Card>
          <Card className="mt-5">
            <CardBody>
              <Typography variant="h3" color="black">
                Thực đơn
              </Typography>
              <div className="grid grid-cols-4 my-3">
                <Typography variant="h6" className="my-auto">
                  Tên món
                </Typography>
                <Typography variant="h6" className="my-auto">
                  Giá tiền
                </Typography>
                <Typography variant="h6" className="my-auto">
                  Đơn vị
                </Typography>
              </div>
              {restaurants.data.menus.map((item) => (
                <div key={item} className="grid grid-cols-4 my-3">
                  <Typography variant="medium" className="my-auto">
                    {item.name}
                  </Typography>
                  <Typography
                    variant="medium"
                    color="black"
                    className="my-auto"
                  >
                    {(item.price * (1 - item.discount / 100)).toLocaleString(
                      "en-US"
                    )}
                    {"   "}
                    <span className="line-through opacity-30">
                      {item.price.toLocaleString("en-US")}
                    </span>{" "}
                    đ
                  </Typography>
                  <Typography variant="medium" className="my-auto">
                    {item.unit}
                  </Typography>
                  <Button
                    variant="outlined"
                    className="border-[#FF333a] text-[#FF333a]"
                    color="red"
                    onClick={() => handleAddToCart(item)}
                  >
                    Thêm vào giỏ hàng
                  </Button>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
        <div className="">
          <Card>
            <CardBody>
              <Typography variant="h5" color="black" className="text-center">
                Đặt chỗ
              </Typography>
              <div className="grid grid-cols-2 gap-4 mt-5">
                <Typography variant="h6" className="my-auto">
                  Số người
                </Typography>
                {/* <Select
                  value={table}
                  placeholder="Số bàn"
                  className="border-black rounded-lg"
                  labelProps={{
                    className: "hidden",
                  }}
                  onChange={(e) => setTable(e)}
                >
                  {[...Array(tableCount + 1)].map((_, index) => (
                    <Option key={index} value={index}>
                      {index}
                    </Option>
                  ))}
                </Select> */}
                <TextField
                  size="small"
                  value={people}
                  onChange={(e) => {
                    setTotal(
                      e.target.value < 0 || isNaN(e.target.value)
                        ? total
                        : total +
                            (e.target.value - Number(people)) *
                              restaurants.data.restaurant.price_per_table
                    ),
                      setPeople(
                        e.target.value < 0 || isNaN(e.target.value)
                          ? 0
                          : e.target.value > restaurants.data.totalPeople
                          ? restaurants.data.totalPeople
                          : e.target.value
                      );
                  }}
                />
                <Typography variant="h6" className="my-auto">
                  Ngày nhận bàn
                </Typography>
                <TextField
                  size="small"
                  type="date"
                  value={date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDate(e.target.value)}
                />
                <Typography variant="h6" className="my-auto">
                  Thời gian đến
                </Typography>
                <TextField
                  size="small"
                  type="time"
                  value={time}
                  min={new Date().toISOString().split("T")[1].split(".")[0]}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
              <Typography variant="h6" className="my-auto mt-5">
                Thực đơn
              </Typography>
              {/* <div className="flex items-center justify-between gap-4 mt-5">
                <Typography variant="medium" className="my-auto w-[125px] ">
                  Bò kho xào nấm kim châm
                </Typography>
                <Typography variant="medium" className="my-auto">
                  1x
                </Typography>
                <Typography variant="medium" className="my-auto">
                  {Number(100000).toLocaleString("en-US")} VNĐ
                </Typography>
                <IconButton color="red">
                  <DeleteIcon />
                </IconButton>
              </div> */}
              {menu &&
                menu.length > 0 &&
                menu.map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between gap-4 mt-5"
                  >
                    <Typography variant="medium" className="my-auto w-[125px] ">
                      {item.name}
                    </Typography>
                    <Typography variant="medium" className="my-auto">
                      {item.quantity}x
                    </Typography>
                    <Typography variant="medium" className="my-auto">
                      {Number(
                        item.price * (1 - item.discount / 100)
                      ).toLocaleString("en-US")}{" "}
                      đ
                    </Typography>
                    <IconButton
                      color="red"
                      onClick={() => handleRemoveFromCart(item)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                ))}
              <div className="flex items-center justify-between gap-4 mt-5">
                <Typography variant="h6" className="my-auto">
                  Tổng cộng
                </Typography>
                <Typography variant="h6" className="my-auto">
                  {Number(total.toFixed(0)).toLocaleString("en-US")} đ
                </Typography>
              </div>
              <Button
                variant="outlined"
                className="mt-5 w-full"
                color="blue"
                onClick={handleCheckout}
              >
                Đặt chỗ
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
};

export default RestaurantDetail;