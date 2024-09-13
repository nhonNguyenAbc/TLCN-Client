import React, { useEffect, useState } from "react";
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
      discount: menu.discount.toString() + "%",
    };
  });
  const handleAddSubmit = async () => {
    try {
      const data = await createMenuItem({
        restaurant_id: restaurant,
        name: name,
        code: code,
        category: category,
        description: description,
        unit: unit,
        price: price,
        discount: discount,
      });
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
    const data = await updateMenuItem({
      id: selectedId,
      restaurant_id: updateRestaurant,
      name: updateName,
      code: updateCode,
      category: updateCategory,
      description: updateDescription,
      unit: updateUnit,
      price: updatePrice,
      discount: updateDiscount,
    });
    return data;
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
            <Typography variant="h6">Giảm giá: </Typography>
            <Typography className="col-span-2">
              {menus?.data.find((menu) => menu._id === selectedId)?.discount} %
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
            <FormControl fullWidth>
              <InputLabel id="restaurant">Nhà hàng</InputLabel>
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
              label="Giảm giá (%)"
              placeholder="Giảm giá"
              value={updateDiscount}
              onChange={(e) =>
                setUpdateDiscount(
                  isNaN(e.target.value)
                    ? 0
                    : e.target.value < 0
                    ? 0
                    : e.target.value > 100
                    ? 100
                    : e.target.value
                )
              }
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
                  {restaurants.data.map((restaurant, index) => (
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
              <FormControl fullWidth>
                <InputLabel id="restaurant">Phân loại</InputLabel>
                <Select
                  labelId="restaurant"
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
                <InputLabel id="price">Giá thành/đơn vị khẩu phần</InputLabel>
                <OutlinedInput
                  labelId="price"
                  label="Giá thành/đơn vị khẩu phần"
                  placeholder="Giá thành/đơn vị khẩu phần"
                  endAdornment={
                    <InputAdornment position="end">đ</InputAdornment>
                  }
                  value={price}
                  onChange={(e) =>
                    setPrice(
                      isNaN(e.target.value)
                        ? 0
                        : e.target.value < 0
                        ? 0
                        : e.target.value
                    )
                  }
                />
              </FormControl>
              <TextField
                label="Đơn vị khẩu phần"
                placeholder="Đơn vị khẩu phần"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />
              <FormControl fullWidth>
                <InputLabel id="discount">Giảm giá</InputLabel>
                <OutlinedInput
                  labelId="discount"
                  label="Giảm giá"
                  value={discount}
                  endAdornment={
                    <InputAdornment position="end">%</InputAdornment>
                  }
                  onChange={(e) =>
                    setDiscount(
                      isNaN(e.target.value)
                        ? 0
                        : e.target.value < 0
                        ? 0
                        : e.target.value > 100
                        ? 100
                        : e.target.value
                    )
                  }
                />
              </FormControl>
              <TextField
                size="sm"
                label="Mô tả"
                multiline
                minRows={8}
                maxRows={10}
                placeholder="Mô tả món ăn"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-2 text-black"
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
