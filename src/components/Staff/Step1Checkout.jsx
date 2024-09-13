import {
  Button,
  IconButton,
  Typography,
  Tooltip,
  Input,
  Select,
  Option,
  Radio,
} from "@material-tailwind/react";
import { Divider } from "@mui/material";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from "../shared/Pagination";
import TableHeader from "../shared/TableHeader";
import PropTypes from "prop-types";
import { useGetAllRestaurantsQuery } from "../../apis/restaurantApi";
import { useGetMenusQuery } from "../../apis/menuApi";
import { useGetAllTablesQuery } from "../../apis/tableApi";
import Loading from "../shared/Loading";
const TABLE_ROWS = [
  {
    name: "Bàn",
    quantity: 1,
    price: 1000000,
  },
  {
    name: "001",
    quantity: 1,
    price: 1000000,
  },
  {
    name: "002",
    quantity: 1,
    price: 1000000,
  },
  {
    name: "003",
    quantity: 1,
    price: 1000000,
  },
  {
    name: "004",
    quantity: 1,
    price: 1000000,
  },
  {
    name: "005",
    quantity: 1,
    price: 1000000,
  },
  {
    name: "006",
    quantity: 1,
    price: 1000000,
  },
  {
    name: "007",
    quantity: 1,
    price: 1000000,
  },
  {
    name: "008",
    quantity: 1,
    price: 1000000,
  },
];
const TABLE_HEAD = [
  { label: "STT", col: 1 },
  { label: "Tên", col: 1 },
  { label: "Giá", col: 1 },
  { label: "Số lượng", col: 1 },
  { label: "Tổng tiền", col: 1 },
];
const Step1Checkout = ({ handleNext }) => {
  const [active, setActive] = useState(1);
  const [subactive, setSubactive] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState("CASH");
  const [quantity, setQuantity] = useState(1);
  const [menuName, setMenuName] = useState();
  const [menu, setMenu] = useState([]);
  const [restaurant, setRestaurant] = useState();
  const [peopleAmount, setPeopleAmount] = useState(1);
  const [total, setTotal] = useState(0);
  const {
    data: restaurants,
    isLoading: restaurantLoading,
    error: restaurantError,
  } = useGetAllRestaurantsQuery({
    page: 1,
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
    data: tables,
    isLoading: tableLoading,
    error: tableError,
  } = useGetAllTablesQuery(active);
  if (restaurantLoading || menuLoading || tableLoading) return <Loading />;
  if (restaurantError || menuError || tableError)
    return (
      <div>
        Error:{" "}
        {restaurantError.message || menuError.message || tableError.message}
      </div>
    );
  return (
    <div className="grid grid-cols-3 gap-8 mx-5">
      <div>
        <Typography variant="h4" className="mb-1">
          Thông tin liên lạc
        </Typography>
        <Divider />
        <div className="grid grid-cols-2 gap-4 mt-5">
          <Typography
            variant="h5"
            color="blue-gray"
            className="font-bold my-auto"
          >
            Người đặt bàn
          </Typography>
          <div>
            <Input
              type="text"
              className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
              labelProps={{
                className: "hidden",
              }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <Typography
            variant="h5"
            color="blue-gray"
            className="font-bold my-auto"
          >
            Số điện thoại
          </Typography>
          <div>
            <Input
              type="text"
              className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
              labelProps={{
                className: "hidden",
              }}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <Typography
            variant="h5"
            color="blue-gray"
            className="font-bold my-auto"
          >
            Thanh toán
          </Typography>
          <div className="w-full">
            <Radio
              name="method"
              value="CASH"
              checked={method === "CASH"}
              onChange={(e) => setMethod(e.target.value)}
              label="Tiền mặt"
            />
            <Radio
              name="method"
              value="CREDIT_CARD"
              checked={method === "CREDIT_CARD"}
              onChange={(e) => setMethod(e.target.value)}
              label="Thẻ"
            />
          </div>
          <Typography
            variant="h5"
            color="blue-gray"
            className="font-bold my-auto"
          >
            Nhà hàng
          </Typography>
          <div>
            <Select
              className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
              labelProps={{
                className: "hidden",
              }}
              value={restaurant}
              onChange={(e) => setRestaurant(e)} // Ensure the correct value is set
            >
              {restaurants?.data.map((restaurant) => (
                <Option key={restaurant._id} value={restaurant}>
                  {restaurant.name}
                </Option>
              ))}
            </Select>
          </div>
          <Typography variant="h5" color="blue-gray" className="font-bold">
            Số người
          </Typography>
          <div>
            <Input
              type="number"
              className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
              labelProps={{
                className: "hidden",
              }}
              value={peopleAmount}
              onChange={(e) =>
                setPeopleAmount(e.target.value < 1 ? 1 : e.target.value)
              }
            />
          </div>
        </div>
        {restaurant &&
        menus?.data?.filter((menu) => menu.restaurant === restaurant).length >
          0 &&
        tables?.data?.filter((table) => table.restaurant === restaurant)
          .length > 0 ? (
          <>
            <Typography variant="h4" className="mb-1 mt-5">
              Đặt món
            </Typography>
            <Divider />
            <div className="grid grid-cols-2 gap-4 mt-5">
              <Typography variant="h5" color="blue-gray" className="font-bold">
                Tên món
              </Typography>
              <div>
                <Select
                  className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                  labelProps={{
                    className: "hidden",
                  }}
                  value={menuName}
                  onChange={(e) => setMenuName(e.target.value)}
                >
                  {menus?.data?.filter((menu) => menu.restaurant === restaurant)
                    .length > 0 ? (
                    menus?.data
                      .filter((menu) => menu.restaurant === restaurant)
                      .map((menu) => (
                        <Option key={menu._id} value={menu}>
                          {menu.name}
                        </Option>
                      ))
                  ) : (
                    <Option value={null} disabled>
                      Không có món ăn
                    </Option>
                  )}
                </Select>
              </div>
              <Typography variant="h5" color="blue-gray" className="font-bold">
                Số lượng
              </Typography>
              <div className="flex h-fit gap-2">
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
              <div className="flex justify-start gap-2">
                <Typography className="my-auto">
                  {Number(100000).toLocaleString("en-US")} đ
                </Typography>
              </div>
            </div>
            <Button
              variant="gradient"
              color="green"
              className="mt-5 w-full col-span-2"
            >
              Đặt món
            </Button>
          </>
        ) : (
          <></>
        )}
      </div>
      <div className="col-span-2">
        <Typography variant="h4">Danh sách thanh toán</Typography>
        <table className="w-full table-auto text-center mt-5">
          <TableHeader TABLE_HEAD={TABLE_HEAD} />
          <tbody>
            {restaurant && (
              <tr>
                <td className="p-2">1</td>
                <td>Bàn</td>
                <td>{restaurant?.price}</td>
                <td>{peopleAmount}</td>
                <td className="p-2">{restaurant?.price * peopleAmount}</td>
                <td></td>
              </tr>
            )}
            {menu
              .slice((subactive < 1 ? 1 : subactive - 1) * 5, subactive * 5)
              .map(({ name, quantity, price }, index) => {
                return (
                  <tr key={name}>
                    <td className="p-2">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {index + (subactive - 1) * 5 + 1}
                      </Typography>
                    </td>
                    <td className="p-2">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {name}
                      </Typography>
                    </td>
                    <td className="p-2">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {price.toLocaleString("en-US")} đ
                      </Typography>
                    </td>
                    <td className="p-2">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {quantity}
                      </Typography>
                    </td>
                    <td className="p-2">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {Number(quantity * price).toLocaleString("en-US")} đ
                      </Typography>
                    </td>
                    <td className="p-2">
                      <Tooltip content="Xóa món ăn">
                        <IconButton color="red">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                );
              })}
            <tr className="bg-blue-gray-50/50">
              <td className="p-2">Tổng cộng</td>
              <td></td>
              <td></td>
              <td></td>
              <td className="p-2">{total.toLocaleString("vi-VN")}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <Pagination
          page={Math.ceil(menu.length / 5)}
          active={subactive}
          setActive={setSubactive}
        />
        <div className="text-right">
          <Button
            variant="gradient"
            color="green"
            disabled={!restaurant && menu.length === 0}
            onClick={handleNext}
          >
            Xác nhận
          </Button>
        </div>
      </div>
    </div>
  );
};
Step1Checkout.propTypes = {
  handleNext: PropTypes.func.isRequired,
};
export default Step1Checkout;
