import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { employee } from "../../constants/table_head";
import {
  Button,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Input,
  Option,
  Typography,
} from "@material-tailwind/react";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { deleteAvatar } from "../../features/slices/avatar_urlSlice";
import ImageUpload from "../shared/ImageUpload";
import {
  useCreateEmployeeMutation,
  useDeleteEmployeeMutation,
  useGetAllEmployeeQuery,
  useUpdateEmployeeMutation,
} from "../../apis/employeeApi";
import { resetSelectedId } from "../../features/slices/selectIdSlice";
import { Toast } from "../../configs/SweetAlert2";
import Loading from "../shared/Loading";
import { Container, MenuItem, Select, TextField, Dialog } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useGetAllRestaurantsByUserIdQuery } from "../../apis/restaurantApi";

const Employee = () => {
  const [active, setActive] = useState(1);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const selectedId = useSelector((state) => state.selectedId.value);
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [restaurant, setRestaurant] = useState("");
  const [updateName, setUpdateName] = useState("");
  const [updateUsername, setUpdateUsername] = useState("");
  const [updatePassword, setUpdatePassword] = useState("");
  const [updateEmail, setUpdateEmail] = useState("");
  const [updatePhone, setUpdatePhone] = useState("");
  const [updateRestaurant, setUpdateRestaurant] = useState("");
  const { data: employees, error, isLoading } = useGetAllEmployeeQuery(active);
  const [createEmployee, { isLoading: isCreated, error: createError }] =
    useCreateEmployeeMutation();
  const [updateEmployee, { isLoading: isUpdated, error: updateError }] =
    useUpdateEmployeeMutation();
  const [deleteEmployee, { isLoading: isDeleted, error: deleteError }] =
    useDeleteEmployeeMutation();

  useEffect(() => {
    if (!employees?.data.find((employee) => employee._id === selectedId)) {
      dispatch(resetSelectedId());
    } else {
      const employee = employees?.data.find(
        (employee) => employee._id === selectedId
      );
      setUpdateName(employee?.staff.name);
      setUpdateEmail(employee?.staff.email);
      setUpdatePhone(employee?.staff.phone);
      setUpdateUsername(employee?.staff.username);
      setUpdateRestaurant(employee?.restaurant._id);
    }
  }, [selectedId, employees?.data, dispatch]);
  const {
    data: restaurants,
    isLoading: restaurantUpdated,
    error: errorUpdated,
  } = useGetAllRestaurantsByUserIdQuery();
  if (error && error.status === 401) return navigate("/login");
  if (isLoading || restaurantUpdated) return <Loading />;
  if (error) return <div>Error: {error}</div>;
  const list_employee = employees?.data.map((employee) => {
    return {
      id: employee._id,
      restaurant: employee.restaurant.name,
      name: employee.staff.name,
      email: employee.staff.email,
      phone: employee.staff.phone,
      username: employee.staff.username,
    };
  });
  console.log('list', list_employee)
  const handleAddSubmit = async () => {
    try {
      const result = await createEmployee({
        name,
        email,
        phone,
        username,
        password,
        restaurant_id: restaurant,
      });
      if (result.data.status === 201) {
        Toast.fire({
          icon: "success",
          title: "Thêm mới thành công",
        }).then(() => {
          handleClose();
          setName("");
          setEmail("");
          setPhone("");
          setUsername("");
          setPassword("");
        });
      }
    } catch (err) {
      Toast.fire({
        icon: "error",
        title: "Thêm mới thất bại",
      });
    }
  };
  const updateSubmit = async () => {
    try {
      const result = await updateEmployee({
        id: selectedId,
        name: updateName,
        restaurant_id: updateRestaurant,
      });
      return result;
    } catch (err) {
      Toast.fire({
        icon: "error",
        title: "Cập nhật thất bại",
      });
    }
  };
  const handleDeleteSubmit = async () => {
    try {
      const result = await deleteEmployee(selectedId);
      if (result.data.status === 200 || result.data.status === 202) {
        Toast.fire({
          icon: "success",
          title: "Xóa thành công",
        });
      }
    } catch (err) {
      Toast.fire({
        icon: "error",
        title: "Xóa thất bại",
      });
    }
  };
  console.log('select', selectedId)
  return (
    <>
      <AdminLayout
        name="Danh sách nhân viên"
        TABLE_HEAD={employee}
        TABLE_ROWS={list_employee}
        page={active}
        setPage={setActive}
        pagination={employees?.info}
        updateContent="Chỉnh sửa"
        deleteContent="Xóa"
        size="lg"
        headerDetail="Chi tiết nhân viên"
        bodyDetail={
          <>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <img
                  src="https://www.raiven.com/hs-fs/hubfs/shutterstock_1153673752-no-image-found.jpg?width=500&height=500&name=shutterstock_1153673752-no-image-found.jpg"
                  alt=""
                  className="h-[200px] w-auto object-cover mx-auto"
                />
              </div>
              {employees?.data && selectedId ? (
              // Tìm nhân viên ngoài JSX
              (() => {
                const employee = employees?.data.find(
                  (employee) => employee._id === selectedId
                );
                if (employee) {
                  return (
                    <div className="col-span-2 grid grid-cols-3 gap-4 my-auto">
                      <Typography variant="h6" color="blue-gray" className="text-left my-auto">
                        Họ và tên:
                      </Typography>
                      <Typography color="blue-gray" className="col-span-2 text-left">
                        {employee.staff.name}
                      </Typography>

                      <Typography variant="h6" color="blue-gray" className="text-left">
                        Email:
                      </Typography>
                      <Typography color="blue-gray" className="col-span-2 text-left">
                        {employee.staff.email}
                      </Typography>

                      <Typography variant="h6" color="blue-gray" className="text-left">
                        Số điện thoại:
                      </Typography>
                      <Typography color="blue-gray" className="col-span-2 text-left">
                        {employee.staff.phone}
                      </Typography>

                      <Typography variant="h6" color="blue-gray" className="text-left">
                        Tên đăng nhập:
                      </Typography>
                      <Typography color="blue-gray" className="col-span-2 text-left">
                        {employee.staff.username}
                      </Typography>
                    </div>
                  );
                }
              })()
            ) : (
              <p>Loading...</p> // Hiển thị khi đang tải dữ liệu
            )}
            </div>
          </>
        }
        sizeUpdate="xl"
        headerUpdate="Chỉnh sửa nhân viên"
        bodyUpdate={
          <>
            <div className="col-span-2 grid grid-cols-3 gap-4 my-auto">
              <div className="my-auto">
                <img
                  src="https://www.raiven.com/hs-fs/hubfs/shutterstock_1153673752-no-image-found.jpg?width=500&height=500&name=shutterstock_1153673752-no-image-found.jpg"
                  alt=""
                  className="h-[200px] w-auto object-cover mx-auto"
                />
              </div>
              <div className="col-span-2 grid grid-cols-3 gap-4 my-auto">
                <Typography
                  variant="h6"
                  color="blue-gray"
                  className="text-left my-auto"
                >
                  Họ và tên:
                </Typography>
                <TextField
                  type="text"
                  value={updateName}
                  className="col-span-2"
                  size="small"
                  onChange={(e) => setUpdateName(e.target.value)}
                />
                <Typography
                  variant="h6"
                  color="blue-gray"
                  className="text-left my-auto"
                >
                  Email:
                </Typography>
                <TextField
                  type="text"
                  value={updateEmail}
                  className="col-span-2"
                  size="small"
                  disabled
                  onChange={(e) => setUpdateEmail(e.target.value)}
                />
                <Typography
                  variant="h6"
                  color="blue-gray"
                  className="text-left"
                >
                  Số điện thoại:
                </Typography>
                <TextField
                  type="text"
                  value={updatePhone}
                  className="col-span-2"
                  size="small"
                  disabled
                  onChange={(e) => setUpdatePhone(e.target.value)}
                />
                <Typography
                  variant="h6"
                  color="blue-gray"
                  className="text-left my-auto"
                >
                  Tên đăng nhập:
                </Typography>
                <TextField
                  type="text"
                  value={updateUsername}
                  className="col-span-2"
                  size="small"
                  disabled
                  onChange={(e) => setUpdateUsername(e.target.value)}
                />
                <Typography
                  variant="h6"
                  color="blue-gray"
                  className="text-left my-auto"
                >
                  Nhà hàng
                </Typography>
                <Select
                  size="small"
                  className="col-span-2"
                  value={updateRestaurant}
                  onChange={(e) => setUpdateRestaurant(e.target.value)}
                >
                  {restaurants?.data ? (
                    restaurants.data.map((restaurant, index) => (
                      <MenuItem key={index} value={restaurant._id}>
                        {restaurant.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                  )}
                </Select>
              </div>
            </div>
          </>
        }
        updateSubmit={updateSubmit}
        handleDeleteSubmit={handleDeleteSubmit}
        isUpdated={isUpdated}
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
      </AdminLayout>
      <Dialog maxWidth="lg" open={open} onClose={handleClose}>
        <DialogHeader className="pb-0 flex justify-between">
          <Typography variant="h4">Thêm mới nhân viên</Typography>
          <IconButton
            className="border-none"
            variant="outlined"
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogHeader>
        <DialogBody>
          <div className="col-span-2 grid grid-cols-3 gap-4 my-auto">
            <div className="my-auto">
              <img
                src="https://www.raiven.com/hs-fs/hubfs/shutterstock_1153673752-no-image-found.jpg?width=500&height=500&name=shutterstock_1153673752-no-image-found.jpg"
                alt=""
                className="h-[200px] w-auto object-cover mx-auto"
              />
            </div>
            <div className="col-span-2 grid grid-cols-3 gap-4 my-auto">
              <Typography
                variant="h6"
                color="blue-gray"
                className="text-left my-auto"
              >
                Họ và tên:
              </Typography>
              <TextField
                type="text"
                value={name}
                size="small"
                placeholder="Nhập họ và tên"
                className="col-span-2"
                onChange={(e) => setName(e.target.value)}
              />
              <Typography
                variant="h6"
                color="blue-gray"
                className="text-left my-auto"
              >
                Email:
              </Typography>
              <TextField
                type="email"
                value={email}
                placeholder="Nhập email"
                className="col-span-2"
                size="small"
                onChange={(e) => setEmail(e.target.value)}
              />
              <Typography
                variant="h6"
                color="blue-gray"
                className="text-left my-auto"
              >
                Số điện thoại:
              </Typography>
              <TextField
                type="text"
                value={phone}
                placeholder="Nhập số điện thoại"
                className="col-span-2"
                size="small"
                onChange={(e) => setPhone(e.target.value)}
              />
              <Typography
                variant="h6"
                color="blue-gray"
                className="text-left my-auto"
              >
                Tên đăng nhập:
              </Typography>
              <TextField
                type="text"
                value={username}
                placeholder="Nhập tên đăng nhập"
                className="col-span-2"
                size="small"
                onChange={(e) => setUsername(e.target.value)}
              />
              <Typography
                variant="h6"
                color="blue-gray"
                className="text-left my-auto"
              >
                Mật khẩu:
              </Typography>
              <TextField
                type="text"
                placeholder="Nhập mật khẩu"
                value={password}
                className="col-span-2"
                size="small"
                onChange={(e) => setPassword(e.target.value)}
              />
              <Typography
                variant="h6"
                color="blue-gray"
                className="text-left my-auto"
              >
                Nhà hàng
              </Typography>
              <Select
                size="small"
                className="col-span-2"
                value={restaurant}
                onChange={(e) => setRestaurant(e.target.value)}
              >
                {restaurants?.data ? (
                  restaurants.data.map((restaurant, index) => (
                    <MenuItem key={index} value={restaurant._id}>
                      {restaurant.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                )}
              </Select>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="gradient"
            color="green"
            onClick={handleAddSubmit}
            loading={isCreated}
          >
            <span>Thêm mới</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default Employee;
