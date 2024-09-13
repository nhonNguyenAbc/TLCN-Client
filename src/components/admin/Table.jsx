import React, { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { menu, table } from "../../constants/table_head";
import {
  Container,
  TextField,
  Dialog,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  tab,
} from "@material-tailwind/react";
import CloseIcon from "@mui/icons-material/Close";
import useOpen from "../../hooks/useOpen";
import {
  useGetAllTablesOwnerQuery,
  useGetAllTablesQuery,
} from "../../apis/tableApi";
import {
  useGetAllRestaurantsByUserIdQuery,
  useGetAllRestaurantsQuery,
} from "../../apis/restaurantApi";
import { useDispatch, useSelector } from "react-redux";
import { resetSelectedId } from "../../features/slices/selectIdSlice";
import {
  useCreateTableMutation,
  useDeleteTableMutation,
  useUpdateTableMutation,
} from "../../apis/tableApi";
import { Toast } from "../../configs/SweetAlert2";
import Loading from "../shared/Loading";
const TABLE_ROWS = [
  {
    restaurantId: "001",
    id: "001",
    name: "Áo thun nam",
    // category: "Áo thun",
    // description: "Áo thun đẹp, chất lượng tốt, giá hợp lý",
    price: Number(100000).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    }),
    unit: "Cái",

    discount: "10%",
  },
];

const Table = () => {
  const selectedId = useSelector((state) => state.selectedId.value);
  const [active, setActive] = React.useState(1);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [restaurant, setRestaurant] = useState();
  const [tableNumber, setTableNumber] = useState(0);
  const [peopleAmount, setPeopleAmount] = useState(0);
  const [price, setPrice] = useState(0);
  const [updateRestaurant, setUpdateRestaurant] = useState(-1);
  const [updateTableNumber, setUpdateTableNumber] = useState(0);
  const [updatePrice, setUpdatePrice] = useState(0);
  const [updatePeopleAmount, setUpdatePeopleAmount] = useState(0);
  const {
    data: restaurants,
    isLoading: restaurantLoading,
    error: restaurantError,
  } = useGetAllRestaurantsByUserIdQuery();
  const {
    data: tables,
    isLoading: tableLoading,
    error: tableError,
  } = useGetAllTablesOwnerQuery(active);
  const dispatch = useDispatch();
  const [createTable, { isLoading: isAdded, error: addError }] =
    useCreateTableMutation();
  const [updateTable, { isLoading: isUpdated, error: updateError }] =
    useUpdateTableMutation();
  const [deleteTable, { isLoading: isDeleted, error: deleteError }] =
    useDeleteTableMutation();
  const handleAddSubmit = async () => {
    try {
      const result = await createTable({
        restaurant_id: restaurant,
        number_of_tables: tableNumber,
        people_per_table: peopleAmount,
      });
      if (result.data.status === 201) {
        Toast.fire({
          icon: "success",
          title: "Thêm bàn thành công",
        }).then(() => {
          handleClose();
          setRestaurant();
          setTableNumber(0);
          setPeopleAmount(0);
          setPrice(0);
        });
      }
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Thêm bàn thất bại",
      });
    }
  };
  const updateSubmit = async () => {
    const result = await updateTable({
      id: selectedId,
      tableData: {
        restaurant_id: updateRestaurant,
        number_of_tables: updateTableNumber,
        people_per_table: updatePeopleAmount,
      },
    });
    return result;
  };
  const handleDeleteSubmit = async () => {
    try {
      const result = await deleteTable(selectedId);
      Toast.fire({
        icon: "success",
        title: "Xóa bàn thành công",
      }).then(() => {
        dispatch(resetSelectedId());
      });
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Xóa bàn thất bại",
      });
    }
  };
  useEffect(() => {
    if (!tables?.data?.find((table) => table._id === selectedId)) {
      dispatch(resetSelectedId());
    } else {
      const table = tables?.data?.find((table) => table._id === selectedId);
      setUpdateRestaurant(table?.restaurant._id);
      setUpdateTableNumber(table?.number_of_tables);
      setUpdatePeopleAmount(table?.people_per_table);
      setUpdatePrice(table?.restaurant.price_per_table);
    }
  }, [tables, selectedId, dispatch]);

  if (tableLoading || restaurantLoading)
    return (
      <div>
        <Loading />
      </div>
    );
  if (tableError || restaurantError) return <div>Error</div>;
  const list_table = tables?.data.map((table) => ({
    id: table._id,
    name: table.restaurant.name,
    number: table.number_of_tables,
    people: table.people_per_table,
    price:
      Number(table.restaurant.price_per_table).toLocaleString("en-US") + " đ",
  }));
  return (
    <AdminLayout
      name="Bàn nhà hàng"
      TABLE_HEAD={table}
      TABLE_ROWS={list_table}
      pagination={tables?.info}
      page={active}
      setPage={setActive}
      updateContent="Chỉnh sửa bàn"
      deleteContent="Xóa bàn"
      size="md"
      headerDetail="Chi tiết bàn"
      bodyDetail={
        <Container>
          <div className="grid grid-cols-2 gap-4">
            <Typography variant="h6">Nhà hàng: </Typography>
            <Typography variant="body1">
              {
                tables?.data?.find((item) => item._id === selectedId)
                  ?.restaurant.name
              }
            </Typography>
            <Typography variant="h6">Số bàn: </Typography>
            <Typography variant="body1">
              {
                tables?.data?.find((table) => table._id === selectedId)
                  ?.number_of_tables
              }
            </Typography>
            <Typography variant="h6">Số người/ bàn: </Typography>
            <Typography variant="body1">
              {
                tables?.data?.find((table) => table._id === selectedId)
                  ?.people_per_table
              }
            </Typography>
            <Typography variant="h6">Giá tiền/ bàn: </Typography>
            <Typography variant="body1">
              {Number(
                tables?.data?.find((table) => table._id === selectedId)
                  ?.restaurant.price_per_table
              ).toLocaleString("en-US") + " đ"}
            </Typography>
          </div>
        </Container>
      }
      headerUpdate="Chỉnh sửa bàn"
      sizeUpdate="md"
      bodyUpdate={
        <Container>
          <div className="grid grid-cols-3 gap-4 mt-2">
            <Typography
              variant="h5"
              color="blue-gray"
              className="font-bold mt-5"
            >
              Nhà hàng:
            </Typography>
            <FormControl fullWidth className="col-span-2">
              <InputLabel id="restaurant">Nhà hàng</InputLabel>
              <Select
                label="Nhà hàng"
                value={updateRestaurant}
                onChange={(e) => setUpdateRestaurant(e.target.value)}
              >
                {restaurants.data.map((item) => (
                  <MenuItem key={item._id} value={item._id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography
              variant="h5"
              color="blue-gray"
              className="font-bold mt-5"
            >
              Số bàn:
            </Typography>
            <TextField
              className="col-span-2"
              size="sm"
              label="Số bàn"
              placeholder="Số bàn"
              value={updateTableNumber}
              onChange={(e) =>
                setUpdateTableNumber(
                  isNaN(e.target.value)
                    ? 0
                    : e.target.value < 0
                    ? 0
                    : e.target.value
                )
              }
            />
            <Typography
              variant="h5"
              color="blue-gray"
              className="font-bold mt-5"
            >
              Số người mỗi bàn
            </Typography>
            <TextField
              className="col-span-2"
              size="sm"
              label="Số người/bàn"
              placeholder="Số người/bàn"
              value={updatePeopleAmount}
              onChange={(e) =>
                setUpdatePeopleAmount(
                  isNaN(e.target.value)
                    ? 0
                    : e.target.value < 0
                    ? 0
                    : e.target.value
                )
              }
            />
          </div>
        </Container>
      }
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
      <Dialog maxWidth="md" open={open} onClose={handleClose} fullWidth>
        <DialogTitle className="pb-0 flex justify-between">
          <Typography variant="h4">Thêm bàn</Typography>
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
            <div className="grid grid-cols-3 gap-4 mt-2">
              <Typography
                variant="h5"
                color="blue-gray"
                className="font-bold mt-5"
              >
                Nhà hàng:
              </Typography>
              <FormControl fullWidth className="col-span-2">
                <InputLabel id="restaurant">Nhà hàng</InputLabel>
                <Select
                  label="Nhà hàng"
                  value={restaurant}
                  onChange={(e) => setRestaurant(e.target.value)}
                >
                  {restaurants.data.map((restaurant) => (
                    <MenuItem key={restaurant._id} value={restaurant._id}>
                      {restaurant.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography
                variant="h5"
                color="blue-gray"
                className="font-bold mt-5"
              >
                Số bàn:
              </Typography>
              <TextField
                className="col-span-2"
                size="sm"
                label="Số bàn"
                placeholder="Số bàn"
                value={tableNumber}
                onChange={(e) =>
                  setTableNumber(
                    isNaN(e.target.value)
                      ? 1
                      : e.target.value < 1
                      ? 1
                      : e.target.value
                  )
                }
              />
              <Typography
                variant="h5"
                color="blue-gray"
                className="font-bold mt-5"
              >
                Số người mỗi bàn:
              </Typography>
              <TextField
                className="col-span-2"
                size="sm"
                label="Số người/bàn"
                placeholder="Số người/bàn"
                value={peopleAmount}
                onChange={(e) =>
                  setPeopleAmount(
                    isNaN(e.target.value)
                      ? 1
                      : e.target.value < 1
                      ? 1
                      : e.target.value
                  )
                }
              />
            </div>
          </Container>
        </DialogContent>
        <DialogActions>
          <Button variant="gradient" color="green" onClick={handleAddSubmit}>
            <span>Thêm Mới</span>
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default Table;
