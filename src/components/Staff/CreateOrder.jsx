import {
  Button,
  Typography,
  Select,
  Option,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useGetMenuByRestaurantForStaffQuery, useGetMenusQuery } from "../../apis/menuApi";
import Loading from "../shared/Loading";
import { useCreateWalkinOrderMutation } from "../../apis/orderApi";

const CreateOrder = () => {
  const [menuName, setMenuName] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [menu, setMenu] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const restaurantId = localStorage.getItem("restaurant_id")
  const { data: menus, isLoading, error } = useGetMenuByRestaurantForStaffQuery(restaurantId);
  const [createOrder, { isLoading: isSaving }] = useCreateWalkinOrderMutation();

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;

  const addMenuItem = () => {
    if (!menuName) return;
    const selectedMenu = menus?.data?.menuItems?.find((m) => m._id === menuName);
    const existingItem = menu.find((item) => item._id === menuName);

    if (existingItem) {
      setMenu((prev) =>
        prev.map((item) =>
          item._id === menuName
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setMenu((prev) => [
        ...prev,
        { ...selectedMenu, quantity, total: selectedMenu.price * quantity },
      ]);
    }

    setMenuName(null);
    setQuantity(1);
  };

  const removeMenuItem = (id) => {
    setMenu((prev) => prev.filter((item) => item._id !== id));
  };

  const totalAmount = menu.reduce((acc, item) => acc + item.total, 0);

  const saveOrder = async () => {
    // Gọi hàm lưu đơn hàng từ API với các thông tin cần thiết
    const orderData = {
      menu_list: menu,
      total: totalAmount,
    };

    try {
      const result = await createOrder({ ...orderData }).unwrap();
      setMenu([]);
      setMenuName(null);
      setQuantity(1);
      console.log("Đơn hàng đã được tạo: ", result);
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng: ", error);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-8 mx-5">
      {/* Phần chọn món */}
      <div>
        <Typography variant="h4" className="mb-5">
          Đặt món
        </Typography>
        <div className="grid grid-cols-2 gap-4">
      <Typography variant="h5" className="font-bold">
        Tên món
      </Typography>
      <div className="relative">
        <div
          onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Khi click mở/đóng dropdown
          className="cursor-pointer border p-2 rounded"
        >
          {menuName ? menus.data.menuItems.find((menu) => menu._id === menuName)?.name : "Chọn món"}
        </div>
        {isDropdownOpen && (
          <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 max-h-48 overflow-y-auto">
            {menus?.data.menuItems?.map((menu) => (
              <div
                key={menu._id}
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setMenuName(menu._id); // Cập nhật giá trị đã chọn
                  setIsDropdownOpen(false); // Đóng dropdown khi chọn món
                }}
              >
                {menu.name}
              </div>
            ))}
          </div>
        )}
      </div>

      <Typography variant="h5" className="font-bold">
        Số lượng
      </Typography>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outlined"
          onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
        >
          -
        </Button>
        <Typography>{quantity}</Typography>
        <Button
          size="sm"
          variant="outlined"
          onClick={() => setQuantity((prev) => prev + 1)}
        >
          +
        </Button>
      </div>
    </div>
        <Button
          variant="gradient"
          color="green"
          className="mt-5 w-full"
          onClick={addMenuItem}
        >
          Thêm món
        </Button>
      </div>

      {/* Phần danh sách thanh toán */}
      <div className="col-span-2">
        <Typography variant="h4" className="mb-5">
          Danh sách thanh toán
        </Typography>
        <table className="w-full table-auto text-center">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên món</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {menu.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.price.toLocaleString("en-US")} đ</td>
                <td>{item.quantity}</td>
                <td>{item.total.toLocaleString("en-US")} đ</td>
                <td>
                  <Tooltip content="Xóa món">
                    <IconButton
                      color="red"
                      onClick={() => removeMenuItem(item._id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={4} className="text-right font-bold">
                Tổng cộng
              </td>
              <td colSpan={2} className="text-left font-bold">
                {totalAmount.toLocaleString("en-US")} đ
              </td>
            </tr>
          </tbody>
        </table>

        <Button
          variant="gradient"
          color="blue"
          className="mt-5 w-full"
          onClick={saveOrder}
          disabled={isSaving} // Disable khi đang lưu đơn
        >
          {isSaving ? "Đang lưu..." : "Hoàn tất"}
        </Button>
      </div>
    </div>
  );
};

export default CreateOrder;
