import React, { useEffect, useRef, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { menu } from "../../constants/table_head";
import {
  Container,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import {
  Button,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Input,
  Typography,
  Option,
  Textarea,
} from "@material-tailwind/react";
import CloseIcon from "@mui/icons-material/Close";
import {
  useCreateMenuItemMutation,
  useDeleteMenuItemMutation,
  useGetMenusByUserIdQuery,
  useGetMenusQuery,
  useUpdateMenuItemMutation,
} from "../../apis/menuApi";
import {
  useGetAllRestaurantsByUserIdQuery,
  useGetAllRestaurantsQuery,
} from "../../apis/restaurantApi";
import { useDispatch, useSelector } from "react-redux";
import { resetSelectedId } from "../../features/slices/selectIdSlice";
import { Toast } from "../../configs/SweetAlert2";
import Loading from "../shared/Loading";
const Menu = () => {
  const selectedId = useSelector((state) => state.selectedId.value);
  const [imageFile, setImageFile] = useState(null); // Lưu ảnh từ user chọn
  const [imagePreview, setImagePreview] = useState(null); // Hiển thị ảnh xem trước
  const [active, setActive] = React.useState(1);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [restaurant, setRestaurant] = useState();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [unit, setUnit] = useState("");
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [updateRestaurant, setUpdateRestaurant] = useState();
  const [updateName, setUpdateName] = useState("");
  const [updateCategory, setUpdateCategory] = useState("");
  const [updateDescription, setUpdateDescription] = useState("");
  const [updateUnit, setUpdateUnit] = useState("");
  const [updatePrice, setUpdatePrice] = useState(0);
  const [updateDiscount, setUpdateDiscount] = useState(0);
  const [updateCode, setUpdateCode] = useState("");
  const fileInputRef = useRef(null);
  const {
    data: menus,
    isLoading: menuLoading,
    error: menuError,
  } = useGetMenusByUserIdQuery(active);
  const {
    data: restaurants,
    isLoading: restaurantLoading,
    error: restaurantError,
  } = useGetAllRestaurantsByUserIdQuery();
  const [createMenuItem, { isLoading: isAdded, error: addError }] =
    useCreateMenuItemMutation();
  const [updateMenuItem, { isLoading: isUpdated, error: updateError }] =
    useUpdateMenuItemMutation();
  const [deleteMenuItem, { isLoading: isDeleted, error: deleteError }] =
    useDeleteMenuItemMutation();

  const dispatch = useDispatch();
  useEffect(() => {
    if (!menus?.data.find((item) => item._id === selectedId)) {
      dispatch(resetSelectedId());
    } else {
      const searchMenu = menus?.data.find((item) => item._id === selectedId);
      setUpdateRestaurant(searchMenu?.restaurant._id);
      setUpdateName(searchMenu?.name);
      setUpdateCategory(searchMenu?.category);
      setUpdateDescription(searchMenu?.description);
      setUpdateUnit(searchMenu?.unit);
      setUpdatePrice(searchMenu?.price);
      setUpdateDiscount(searchMenu?.discount);
      setUpdateCode(searchMenu?.code);
    }
  }, [selectedId, menus, restaurants, dispatch]);
  if (menuLoading || restaurantLoading) return <Loading />;
  if (menuError || restaurantError) return <div>Error</div>;
  const list_menu = menus?.data.map((menu) => {
    return {
      id: menu._id,
      restaurant_name: menu.restaurant.name,
      code: menu.code,
      name: menu.name,
      price: Number(menu.price).toLocaleString("en-US") + " đ",
      unit: menu.unit,
      image: menu?.image?.url
    };
  });
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // Lưu file
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result); // Hiển thị ảnh xem trước
      reader.readAsDataURL(file);
    }
  };
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const handleAddSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("restaurant_id", restaurant);
      formData.append("name", name);
      formData.append("code", code);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("unit", unit);
      formData.append("price", price);
      formData.append("discount", discount);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const data = await createMenuItem(formData);

      if (data.data.status === 201) {
        Toast.fire({
          icon: "success",
          title: "Thêm món ăn thành công",
        }).then(() => {
          handleClose();
          setName("");
          setCode("");
          setCategory("");
          setDescription("");
          setUnit("");
          setPrice(0);
          setDiscount(0);
          setImageFile(null);
          setImagePreview(null);
        });
      }
    } catch (err) {
      Toast.fire({
        icon: "error",
        title: "Thêm món ăn thất bại",
      });
    }
  };
  const updateSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("id", selectedId); // ID của món ăn cần cập nhật
      formData.append("restaurant_id", updateRestaurant);
      formData.append("name", updateName);
      formData.append("code", updateCode);
      formData.append("category", updateCategory);
      formData.append("description", updateDescription);
      formData.append("unit", updateUnit);
      formData.append("price", updatePrice);
      formData.append("discount", updateDiscount);

      // Kiểm tra xem có hình ảnh mới không
      if (imageFile) {
        formData.append("image", imageFile); // Thêm hình ảnh vào FormData
      }

      // Gửi dữ liệu cập nhật
      const data = await updateMenuItem(formData);
      if (data?.data?.status === 200) {
        Toast.fire({
          icon: "success",
          title: "Cập nhật món ăn thành công",
        }).then(() => {
          handleClose();
          setUpdateName("");
          setUpdateCode("");
          setUpdateCategory("");
          setUpdateDescription("");
          setUpdateUnit("");
          setUpdatePrice(0);
          setUpdateDiscount(0);
          setImageFile(null);
          setImagePreview(null);
        });
      }
    } catch (err) {
      Toast.fire({
        icon: "error",
        title: "Cập nhật món ăn thất bại",
      });
    }
  };


  const handleDeleteSubmit = async () => {
    const data = await deleteMenuItem(selectedId);
    if (data.data.status === 200) {
      Toast.fire({
        icon: "success",
        title: "Xóa món ăn thành công",
      });
    } else {
      Toast.fire({
        icon: "error",
        title: "Xóa món ăn thất bại",
      });
    }
  };
  return (
    <AdminLayout
      name="Thực đơn"
      TABLE_HEAD={menu}
      TABLE_ROWS={list_menu}
      page={active}
      setPage={setActive}
      pagination={menus?.info}
      updateContent="Chỉnh sửa món ăn"
      deleteContent="Xóa món ăn"
      size="md"
      headerDetail="Chi tiết món"
      bodyDetail={
        <Container>
          <div className="grid grid-cols-3 gap-4">
            <Typography variant="h6">Nhà hàng: </Typography>
            <Typography className="col-span-2">
              {
                menus?.data.find((menu) => menu._id === selectedId)?.restaurant
                  .name
              }
            </Typography>
            <Typography variant="h6">Tên: </Typography>
            <Typography className="col-span-2">
              {menus?.data.find((menu) => menu._id === selectedId)?.name}
            </Typography>
            <Typography variant="h6">Phân loại: </Typography>
            <Typography className="col-span-2">
              {menus?.data.find((menu) => menu._id === selectedId)?.category ===
                "Dish"
                ? "Đồ ăn"
                : category === "Beverage"
                  ? "Đồ uống"
                  : "Tráng miệng"}
            </Typography>
            <Typography variant="h6">Mô tả: </Typography>
            <Typography className="col-span-2">
              {menus?.data.find((menu) => menu._id === selectedId)?.description}
            </Typography>
            <Typography variant="h6">Đơn vị khẩu phần: </Typography>
            <Typography className="col-span-2">
              {menus?.data.find((menu) => menu._id === selectedId)?.unit}
            </Typography>
            <Typography variant="h6">Giá thành/đơn vị khẩu phần:</Typography>
            <Typography className="col-span-2">
              {Number(
                menus?.data.find((menu) => menu._id === selectedId)?.price
              ).toLocaleString("en-US") + " đ"}
            </Typography>

          </div>
        </Container>
      }
      headerUpdate="Chỉnh sửa món ăn"
      bodyUpdate={
        <Container className="mt-2">
          <div className="grid grid-cols-2 gap-4">
            <FormControl fullWidth>
              <InputLabel id="restaurant">Nhà hàng</InputLabel>
              <Select
                labelId="restaurant"
                label="Nhà hàng"
                value={updateRestaurant}
                onChange={(e) => setUpdateRestaurant(e.target.value)}
              >
                {restaurants.data.map((restaurant, index) => (
                  <MenuItem key={index} value={restaurant._id}>
                    {restaurant.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              size="sm"
              label="Tên"
              placeholder="Tên món ăn"
              value={updateName}
              onChange={(e) => setUpdateName(e.target.value)}
            />
            <div>
              <TextField
                type="file"
                label=""
                inputRef={fileInputRef} // Thêm ref vào input
                onChange={handleImageChange} // Gọi hàm xử lý thay đổi ảnh
              />
              {imagePreview && (
                <div className="relative mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover border"
                  />
                  {/* Dấu 'X' xoá ảnh */}
                  <button
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    onClick={handleRemoveImage}
                  >
                    &#10005;
                  </button>
                </div>
              )}
            </div>
            <FormControl fullWidth>
              <InputLabel id="restaurant">Phân loại</InputLabel>
              <Select
                labelId="restaurant"
                label="Phân loại"
                value={updateCategory}
                onChange={(e) => setUpdateCategory(e.target.value)}
              >
                <MenuItem value="Dish">Đồ ăn</MenuItem>
                <MenuItem value="Beverage">Đồ uống</MenuItem>
                <MenuItem value="Dessert">Tráng miệng</MenuItem>
              </Select>
            </FormControl>

            <TextField
              size="sm"
              label="Mã thức ăn"
              placeholder="Mã thức ăn"
              value={updateCode}
              onChange={(e) => setUpdateCode(e.target.value)}
            />
            <TextField
              type="number"
              size="sm"
              label="Giá thành/đơn vị khẩu phần"
              placeholder="Giá thành/đơn vị khẩu phần"
              value={isNaN(updatePrice) ? 0 : updatePrice}
              onChange={(e) =>
                setUpdatePrice(
                  isNaN(e.target.value)
                    ? 0
                    : e.target.value < 0
                      ? 0
                      : e.target.value
                )
              }
            />
            <TextField
              size="sm"
              label="Đơn vị khẩu phần"
              placeholder="Đơn vị khẩu phần"
              value={updateUnit}
              onChange={(e) => setUpdateUnit(e.target.value)}
            />

            <TextField
              size="sm"
              label="Mô tả"
              multiline
              minRows={8}
              maxRows={10}
              placeholder="Mô tả món ăn"
              value={updateDescription}
              onChange={(e) => setUpdateDescription(e.target.value)}
              className="col-span-2 text-black"
            />
          </div>
        </Container>
      }
      sizeUpdate="lg"
      updateSubmit={updateSubmit}
      isUpdated={isUpdated}
      handleDeleteSubmit={handleDeleteSubmit}
    >
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outlined"
          className="w-full"
          size="regular"
          onClick={handleOpen}
        >
          Thêm mới
        </Button>
        <Input
          size="sm"
          label="Tìm kiếm"
          iconFamily="material-icons"
          iconName="search"
          placeholder="Tìm kiếm sản phẩm"
        />
      </div>
      <Dialog maxWidth="md" open={open} onClose={handleClose}>
        <DialogTitle className="pb-0 flex justify-between">
          <Typography variant="h4">Thêm món</Typography>
          <IconButton
            className="border-none"
            variant="outlined"
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Container>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <FormControl fullWidth>
                <InputLabel id="restaurant">Nhà hàng</InputLabel>
                <Select
                  labelId="restaurant"
                  label="Nhà hàng"
                  value={restaurant}
                  onChange={(e) => setRestaurant(e.target.value)}
                >
                  {restaurants?.data?.map((restaurant, index) => (
                    <MenuItem key={index} value={restaurant._id}>
                      {restaurant.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Tên"
                placeholder="Tên món ăn"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <div>
                <TextField
                  type="file"
                  label=""
                  inputRef={fileInputRef} // Thêm ref vào input
                  onChange={handleImageChange} // Gọi hàm xử lý thay đổi ảnh
                />
                {imagePreview && (
                  <div className="relative mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover border"
                    />
                    {/* Dấu 'X' xoá ảnh */}
                    <button
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      onClick={handleRemoveImage}
                    >
                      &#10005;
                    </button>
                  </div>
                )}
              </div>
              <FormControl fullWidth>
                <InputLabel id="category">Phân loại</InputLabel>
                <Select
                  labelId="category"
                  label="Phân loại"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <MenuItem value="Dish">Đồ ăn</MenuItem>
                  <MenuItem value="Beverage">Đồ uống</MenuItem>
                  <MenuItem value="Dessert">Tráng miệng</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Mã thức ăn"
                placeholder="Mã thức ăn"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <FormControl fullWidth>
                <OutlinedInput
                  placeholder="Giá thành/đơn vị khẩu phần"
                  endAdornment={<InputAdornment position="end">đ</InputAdornment>}
                  value={price}
                  onChange={(e) =>
                    setPrice(isNaN(e.target.value) ? 0 : Number(e.target.value))
                  }
                />
              </FormControl>
              <TextField
                label="Đơn vị khẩu phần"
                placeholder="Đơn vị khẩu phần"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />
              <TextField
                label="Mô tả"
                multiline
                minRows={8}
                maxRows={10}
                placeholder="Mô tả món ăn"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-2"
              />

            </div>
          </Container>
        </DialogContent>

        <DialogActions>
          <Button variant="gradient" color="green" onClick={handleAddSubmit}>
            <span>Thêm mới</span>
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default Menu;
