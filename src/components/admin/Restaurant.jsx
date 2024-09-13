import React, { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { restaurant } from "../../constants/table_head";
import {
  Button,
  DialogBody,
  DialogHeader,
  IconButton,
  Input,
  Textarea,
  Typography,
  Dialog,
  DialogFooter,
} from "@material-tailwind/react";
import {
  Container,
  InputAdornment,
  OutlinedInput,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ImageUpload from "../shared/ImageUpload";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useCreateRestaurantMutation,
  useDeleteRestaurantMutation,
  useGetAllRestaurantByUserIdQuery,
  useUpdateRestaurantMutation,
} from "../../apis/restaurantApi";
import { Toast } from "../../configs/SweetAlert2";
import Loading from "../shared/Loading";
import { handleDelete } from "../../utils/deleteImage";
const TABLE_ROWS = [
  {
    name: "Nhà hàng A",
    image: (
      <img
        className="h-auto w-32"
        src="https://pasgo.vn/Upload/anh-chi-tiet/slide-bo-to-quan-moc-tran-van-giau-1-normal-2318787163432.webp"
      />
    ),
    address: "Địa chỉ nhà hàng A",
    open: "7:00",
    close: "22:00",
  },
];
const image = {
  image1:
    "https://pasgo.vn/Upload/anh-chi-tiet/slide-bo-to-quan-moc-tran-van-giau-1-normal-2318787163432.webp",
  image2:
    "https://pasgo.vn/Upload/anh-chi-tiet/slide-bo-to-quan-moc-tran-van-giau-1-normal-2318787163432.webp",
  image3:
    "https://pasgo.vn/Upload/anh-chi-tiet/slide-bo-to-quan-moc-tran-van-giau-1-normal-2318787163432.webp",
  image4:
    "https://pasgo.vn/Upload/anh-chi-tiet/slide-bo-to-quan-moc-tran-van-giau-1-normal-2318787163432.webp",
};

const Restaurant = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(!open);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedId = useSelector((state) => state.selectedId.value);
  const [avatar_url, setAvatar_Url] = useState("");
  const [slider1, setSlider1] = useState("");
  const [slider2, setSlider2] = useState("");
  const [slider3, setSlider3] = useState("");
  const [slider4, setSlider4] = useState("");
  const [avatar_url_update, setAvatar_Url_Update] = useState("");
  const [slider1_update, setSlider1_Update] = useState("");
  const [slider2_update, setSlider2_Update] = useState("");
  const [slider3_update, setSlider3_Update] = useState("");
  const [slider4_update, setSlider4_Update] = useState("");
  const [public_id_avatar, setPublic_Id_Avatar] = useState("");
  const [public_id_slider1, setPublic_Id_Slider1] = useState("");
  const [public_id_slider2, setPublic_Id_Slider2] = useState("");
  const [public_id_slider3, setPublic_Id_Slider3] = useState("");
  const [public_id_slider4, setPublic_Id_Slider4] = useState("");
  const [public_id_avatar_update, setPublic_Id_Avatar_Update] = useState("");
  const [public_id_slider1_update, setPublic_Id_Slider1_Update] = useState("");
  const [public_id_slider2_update, setPublic_Id_Slider2_Update] = useState("");
  const [public_id_slider3_update, setPublic_Id_Slider3_Update] = useState("");
  const [public_id_slider4_update, setPublic_Id_Slider4_Update] = useState("");

  const [name, setName] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [openTime, setOpenTime] = React.useState("");
  const [closeTime, setCloseTime] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [price_per_table, setPrice_Per_Table] = React.useState(0);
  const [updateName, setUpdateName] = React.useState("");
  const [updateAddress, setUpdateAddress] = React.useState("");
  const [updateOpenTime, setUpdateOpenTime] = React.useState("");
  const [updateCloseTime, setUpdateCloseTime] = React.useState("");
  const [updateDescription, setUpdateDescription] = React.useState("");
  const [updatePrice_Per_Table, setUpdatePrice_Per_Table] = React.useState(0);
  // const [TABLE_ROWS, setTABLE_ROWS] = React.useState([]);
  // const getRestaurant = async () => {
  //   const data = await getAllRestaurants();
  //   setTABLE_ROWS(data);
  // };
  // useEffect(() => {
  //   getRestaurant();
  // }, []);
  // console.log(TABLE_ROWS);
  const [page, setPage] = React.useState(1);
  const {
    data: restaurants,
    error,
    isLoading,
  } = useGetAllRestaurantByUserIdQuery(page);
  const [createRestaurant, { error: errorAdded, isLoading: isAdded }] =
    useCreateRestaurantMutation();
  const [updateRestaurant, { error: errorUpdated, isLoading: isUpdated }] =
    useUpdateRestaurantMutation();
  const [deleteRestaurant, { error: errorDeleted, isLoading: isDeleted }] =
    useDeleteRestaurantMutation();

  // useEffect(() => {
  //   if (
  //     !restaurants?.data.find((restaurant) => restaurant._id === selectedId)
  //   ) {
  //     dispatch(resetSelectedId());

  //     dispatch(resetAvatar_Update());
  //     dispatch(resetSlider1_Update());
  //     dispatch(resetSlider2_Update());
  //     dispatch(resetSlider3_Update());
  //     dispatch(resetSlider4_Update());
  //   } else {
  //     const data = restaurants?.data?.find(
  //       (restaurant) => restaurant._id === selectedId
  //     );
  //     setUpdateName(data?.name);
  //     setUpdateAddress(data?.address);
  //     setUpdateOpenTime(data?.openTime);
  //     setUpdateCloseTime(data?.closeTime);
  //     setUpdateDescription(data?.description);
  //     dispatch(
  //       setAvatar_Update({
  //         value: data?.imageUrls,
  //         publicId: data?.public_id_avatar,
  //       })
  //     );
  //     dispatch(
  //       setSlider1_Update({
  //         value: data?.slider1,
  //         publicId: data?.public_id_slider1,
  //       })
  //     );
  //     dispatch(
  //       setSlider2_Update({
  //         value: data?.slider2,
  //         publicId: data?.public_id_slider2,
  //       })
  //     );
  //     dispatch(
  //       setSlider3_Update({
  //         value: data?.slider3,
  //         publicId: data?.public_id_slider3,
  //       })
  //     );
  //     dispatch(
  //       setSlider4_Update({
  //         value: data?.slider4,
  //         publicId: data?.public_id_slider4,
  //       })
  //     );
  //   }
  // }, [selectedId, restaurants, dispatch]);
  useEffect(() => {
    if (selectedId !== -1) {
      const data = restaurants?.data?.find(
        (restaurant) => restaurant._id === selectedId
      );

      setUpdateName(data?.name);
      setUpdateAddress(data?.address);
      setUpdateOpenTime(data?.openTime);
      setUpdateCloseTime(data?.closeTime);
      setUpdateDescription(data?.description);
      setUpdatePrice_Per_Table(data?.price_per_table);
      setAvatar_Url_Update(
        data?.image_url
          .replace("upload/", "upload/q_auto:low/")
          .replace(".jpg", "")
      );
      setSlider1_Update(
        data?.slider1
          .replace("upload/", "upload/q_auto:low/")
          .replace(".jpg", "")
      );
      setSlider2_Update(
        data?.slider2
          .replace("upload/", "upload/q_auto:low/")
          .replace(".jpg", "")
      );
      setSlider3_Update(
        data?.slider3
          .replace("upload/", "upload/q_auto:low/")
          .replace(".jpg", "")
      );
      setSlider4_Update(
        data?.slider4
          .replace("upload/", "upload/q_auto:low/")
          .replace(".jpg", "")
      );
      setPublic_Id_Avatar_Update(data?.public_id_avatar);
      setPublic_Id_Slider1_Update(data?.public_id_slider1);
      setPublic_Id_Slider2_Update(data?.public_id_slider2);
      setPublic_Id_Slider3_Update(data?.public_id_slider3);
      setPublic_Id_Slider4_Update(data?.public_id_slider4);
    }
  }, [selectedId, restaurants]);
  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error}</div>;
  //   { label: "Tên", col: 1 },
  //   { label: "Hình ảnh", col: 1 },
  //   { label: "Địa chỉ", col: 1 },
  //   { label: "Thời gian mở cửa", col: 1 },
  //   { label: "Thời gian đóng cửa", col: 1 },
  // ];
  const list_restaurant = restaurants?.data.map((restaurant) => {
    return {
      id: restaurant._id,
      name: restaurant.name,
      imageUrls: restaurant.image_url,
      address: restaurant.address,
      price_per_table:
        Number(restaurant.price_per_table).toLocaleString("en-US") + " đ",
      openTime: restaurant.openTime,
      closeTime: restaurant.closeTime,
    };
  });
  const handleAddSubmit = async () => {
    try {
      const data = await createRestaurant({
        name,
        address,
        openTime,
        closeTime,
        description,
        image_url: avatar_url,
        slider1: slider1,
        slider2: slider2,
        slider3: slider3,
        slider4: slider4,
        public_id_avatar: public_id_avatar,
        public_id_slider1: public_id_slider1,
        public_id_slider2: public_id_slider2,
        public_id_slider3: public_id_slider3,
        public_id_slider4: public_id_slider4,
        price_per_table: price_per_table,
      });
      if (data.data.status === 201) {
        Toast.fire({
          icon: "success",
          title: "Thêm nhà hàng thành công",
        }).then(() => {
          handleOpen();
          setName("");
          setAddress("");
          setOpenTime("");
          setCloseTime("");
          setDescription("");
          setAvatar_Url("");
          setSlider1("");
          setSlider2("");
          setSlider3("");
          setSlider4("");
          setPublic_Id_Avatar("");
          setPublic_Id_Slider1("");
          setPublic_Id_Slider2("");
          setPublic_Id_Slider3("");
          setPublic_Id_Slider4("");
          setPrice_Per_Table(0);
        });
      }
    } catch (err) {
      Toast.fire({
        icon: "error",
        title: "Thêm nhà hàng thất bại",
      });
    }
  };
  const updateSubmit = async () => {
    const data = await updateRestaurant({
      id: selectedId,
      restaurantData: {
        name: updateName,
        address: updateAddress,
        openTime: updateOpenTime,
        closeTime: updateCloseTime,
        description: updateDescription,
        image_url: avatar_url_update,
        slider1: slider1_update,
        slider2: slider2_update,
        slider3: slider3_update,
        slider4: slider4_update,
        public_id_avatar: public_id_avatar_update,
        public_id_slider1: public_id_slider1_update,
        public_id_slider2: public_id_slider2_update,
        public_id_slider3: public_id_slider3_update,
        public_id_slider4: public_id_slider4_update,
        price_per_table: updatePrice_Per_Table,
      },
    });
    return data;
  };
  const handleDeleteSubmit = async () => {
    try {
      const data = await deleteRestaurant(selectedId);
      if (data.data.status === 200 || data.data.status === 202) {
        Toast.fire({
          icon: "success",
          title: "Xóa nhà hàng thành công",
        });
      }
    } catch (err) {
      Toast.fire({
        icon: "error",
        title: "Xóa nhà hàng thất bại",
      });
    }
  };
  return (
    <>
      <AdminLayout
        name="Danh sách nhà hàng"
        TABLE_HEAD={restaurant}
        TABLE_ROWS={list_restaurant.length > 0 ? list_restaurant : []}
        pagination={restaurants?.info}
        page={page}
        setPage={setPage}
        headerDetail="Chi tiết nhà hàng"
        size="xl"
        bodyDetail={
          <Container>
            <div className="grid grid-cols-2 gap-4">
              <div className="">
                <img
                  src={avatar_url_update}
                  alt="avatar"
                  className="h-[200px] w-full mx-auto col-span-4 object-cover rounded-md"
                />
                <div className="grid grid-cols-2 row-span-1 gap-4 mt-4 w-full">
                  <img
                    src={slider1_update}
                    alt="avatar"
                    className="h-[125px] object-cover rounded-md mx-auto my-auto w-full"
                  />
                  <img
                    src={slider2_update}
                    alt="avatar"
                    className="h-[125px] object-cover rounded-md mx-auto my-auto w-full"
                  />
                  <img
                    src={slider3_update}
                    alt="avatar"
                    className="h-[125px] object-cover rounded-md mx-auto my-auto w-full"
                  />
                  <img
                    src={slider4_update}
                    alt="avatar"
                    className="h-[125px] object-cover rounded-md mx-auto my-auto w-full"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Typography variant="h6" className="my-auto">
                  Tên:
                </Typography>
                <Typography variant="medium" className="col-span-2 my-auto">
                  {updateName}
                </Typography>
                <Typography variant="h6" className="my-auto">
                  Địa chỉ:
                </Typography>
                <Typography variant="medium" className="col-span-2 my-auto">
                  {updateAddress}
                </Typography>
                <div className="grid grid-cols-3 col-span-3 gap-8">
                  <div>
                    <Typography variant="h6" className="my-auto">
                      Giá mỗi người:
                    </Typography>
                    <Typography variant="medium" className="col-span-2 my-auto">
                      {Number(updatePrice_Per_Table).toLocaleString("en-US") +
                        " đ"}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="h6" className="my-auto">
                      Giờ mở cửa:
                    </Typography>
                    <Typography variant="medium" className="col-span-2 my-auto">
                      {updateOpenTime}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="h6" className="my-auto">
                      Giờ đóng cửa:
                    </Typography>
                    <Typography variant="medium" className="col-span-2 my-auto">
                      {updateCloseTime}
                    </Typography>
                  </div>
                </div>
                <Typography variant="h6" className="col-span-3">
                  Mô tả chi tiết:
                </Typography>
                <Typography
                  variant="medium"
                  className="col-span-3 h-[15rem] overflow-auto"
                >
                  {updateDescription}
                </Typography>
              </div>
            </div>
            <div></div>
          </Container>
        }
        updateContent="Chỉnh sửa nhà hàng"
        deleteContent="Xóa nhà hàng"
        headerUpdate="Chỉnh sửa nhà hàng"
        sizeUpdate="xl"
        bodyUpdate={
          <Container>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-flow-row">
                {avatar_url_update === "" ? (
                  <figure className="my-auto mx-auto h-full w-full">
                    <div className="flex items-center  justify-center h-full w-full my-auto">
                      <label
                        htmlFor="avatar_url_update"
                        className="flex flex-col items-center justify-center h-full w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 "
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>

                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            SVG, PNG, JPG or GIF (MAX. 800x400px)
                          </p>
                          <Typography
                            as="caption"
                            variant="small"
                            className="mt-2 text-center font-normal"
                          >
                            Hình đại diện
                          </Typography>
                        </div>
                        <ImageUpload
                          image="avatar_url_update"
                          setImage={setAvatar_Url_Update}
                          setPublicId={setPublic_Id_Avatar_Update}
                        />
                      </label>
                    </div>
                  </figure>
                ) : (
                  <div className="grid grid-cols-5 justify-around mx-auto my-auto w-full">
                    <img
                      src={avatar_url_update}
                      alt="avatar"
                      className="h-[200px] w-full mx-auto col-span-4 object-cover rounded-l-md"
                    />
                    <Button
                      onClick={() => {
                        handleDelete(avatar_url_update);
                        setAvatar_Url_Update("");
                      }}
                      color="red"
                      className="h-[200px] rounded-l-none p-2 my-auto text-center"
                    >
                      Xóa ảnh đại diện
                    </Button>
                  </div>
                )}
                <div className="grid grid-cols-2 row-span-1 gap-4 mt-4">
                  {slider1_update === "" ? (
                    <figure className="my-auto mx-auto h-full w-full">
                      <div className="flex items-center  justify-center h-full w-full my-auto">
                        <label
                          htmlFor="slider_url_update_1"
                          className="flex flex-col items-center justify-center h-full w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 "
                        >
                          <div className="flex flex-col items-center justify-center my-auto">
                            <svg
                              className="w-8 h-8 text-gray-500 dark:text-gray-400"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 20 16"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                              />
                            </svg>
                            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </p>
                            <Typography
                              as="caption"
                              variant="small"
                              className="mt-2 text-center font-normal"
                            >
                              Hình 1
                            </Typography>
                          </div>
                          <ImageUpload
                            image="slider_url_update_1"
                            setImage={setSlider1_Update}
                            setPublicId={setPublic_Id_Slider1_Update}
                          />
                        </label>
                      </div>
                    </figure>
                  ) : (
                    <div className="flex justify-around mx-auto h-full">
                      <img
                        src={slider1_update}
                        alt="avatar"
                        className="h-[125px] object-cover rounded-l-md mx-auto my-auto w-[200px]"
                      />
                      <Button
                        onClick={() => {
                          handleDelete(slider1_update);
                          setSlider1_Update("");
                        }}
                        color="red"
                        className="h-[125px] w-[50px] rounded-l-none p-0 my-auto text-center"
                      >
                        Xóa ảnh 1
                      </Button>
                    </div>
                  )}

                  {slider2_update === "" ? (
                    <figure className="my-auto mx-auto h-full w-full">
                      <div className="flex items-center  justify-center h-full w-full my-auto">
                        <label
                          htmlFor="slider_url_update_2"
                          className="flex flex-col items-center justify-center h-full w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 "
                        >
                          <div className="flex flex-col items-center justify-center my-auto">
                            <svg
                              className="w-8 h-8 text-gray-500 dark:text-gray-400"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 20 16"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                              />
                            </svg>
                            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </p>
                            <Typography
                              as="caption"
                              variant="small"
                              className="mt-2 text-center font-normal"
                            >
                              Hình 2
                            </Typography>
                          </div>
                          <ImageUpload
                            image="slider_url_update_2"
                            setImage={setSlider2_Update}
                            setPublicId={setPublic_Id_Slider2_Update}
                          />
                        </label>
                      </div>
                    </figure>
                  ) : (
                    <div className="flex justify-around mx-auto h-full ">
                      <img
                        src={slider2_update}
                        alt="avatar"
                        className="h-[125px] object-cover rounded-l-md mx-auto my-auto w-[200px]"
                      />
                      <Button
                        onClick={() => {
                          handleDelete(slider2_update);
                          setSlider2_Update("");
                        }}
                        color="red"
                        className="h-[125px] w-[50px] rounded-l-none p-0 my-auto text-center"
                      >
                        Xóa ảnh 2
                      </Button>
                    </div>
                  )}

                  {slider3_update === "" ? (
                    <figure className="my-auto mx-auto h-full w-full">
                      <div className="flex items-center  justify-center h-full w-full my-auto">
                        <label
                          htmlFor="slider_url_update_3"
                          className="flex flex-col items-center justify-center h-full w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 "
                        >
                          <div className="flex flex-col items-center justify-center my-auto">
                            <svg
                              className="w-8 h-8 text-gray-500 dark:text-gray-400"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 20 16"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                              />
                            </svg>
                            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </p>
                            <Typography
                              as="caption"
                              variant="small"
                              className="mt-2 text-center font-normal"
                            >
                              Hình 3
                            </Typography>
                          </div>
                          <ImageUpload
                            image="slider_url_update_3"
                            setImage={setSlider3_Update}
                            setPublicId={setPublic_Id_Slider3_Update}
                          />
                        </label>
                      </div>
                    </figure>
                  ) : (
                    <div className="flex justify-around mx-auto h-full">
                      <img
                        src={slider3_update}
                        alt="avatar"
                        className="h-[125px] object-cover rounded-l-md mx-auto my-auto w-[200px]"
                      />
                      <Button
                        onClick={() => {
                          handleDelete(slider3_update);
                          setSlider3_Update("");
                        }}
                        color="red"
                        className="h-[125px] w-[50px] rounded-l-none p-0 my-auto text-center"
                      >
                        Xóa ảnh 3
                      </Button>
                    </div>
                  )}

                  {slider4_update === "" ? (
                    <figure className="my-auto mx-auto h-full w-full">
                      <div className="flex items-center  justify-center h-full w-full my-auto">
                        <label
                          htmlFor="slider_url_update_4"
                          className="flex flex-col items-center justify-center h-full w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 "
                        >
                          <div className="flex flex-col items-center justify-center my-auto">
                            <svg
                              className="w-8 h-8 text-gray-500 dark:text-gray-400"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 20 16"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                              />
                            </svg>
                            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </p>
                            <Typography
                              as="caption"
                              variant="small"
                              className="mt-2 text-center font-normal"
                            >
                              Hình 4
                            </Typography>
                          </div>
                          <ImageUpload
                            image="slider_url_update_4"
                            setImage={setSlider4_Update}
                            setPublicId={setPublic_Id_Slider4_Update}
                          />
                        </label>
                      </div>
                    </figure>
                  ) : (
                    <div className="flex justify-around mx-auto h-full">
                      <img
                        src={slider4_update}
                        alt="avatar"
                        className="h-[125px] object-cover rounded-l-md mx-auto my-auto w-[200px]"
                      />
                      <Button
                        onClick={() => {
                          handleDelete(slider4_update);
                          setSlider4_Update("");
                        }}
                        color="red"
                        className="h-[125px] w-[50px] rounded-l-none p-0 my-auto text-center"
                      >
                        Xóa ảnh 4
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Typography variant="h6" className="my-auto">
                  Tên:
                </Typography>
                <TextField
                  className="col-span-2"
                  type="text"
                  multiline
                  maxRows={2}
                  size="small"
                  value={updateName}
                  onChange={(e) => setUpdateName(e.target.value)}
                />
                <Typography variant="h6" className="my-auto">
                  Địa chỉ:
                </Typography>
                <TextField
                  className="col-span-2"
                  type="text"
                  value={updateAddress}
                  multiline
                  size="small"
                  minRows={2}
                  maxRows={3}
                  onChange={(e) => setUpdateAddress(e.target.value)}
                />
                <div className="grid grid-cols-3 col-span-3 gap-8">
                  <div>
                    <Typography variant="h6" className="my-auto">
                      Giá mỗi người:
                    </Typography>
                    <OutlinedInput
                      className="col-span-2"
                      type="text"
                      size="small"
                      value={Number(updatePrice_Per_Table).toLocaleString(
                        "en-US"
                      )}
                      endAdornment={
                        <InputAdornment position="end">đ</InputAdornment>
                      }
                      onChange={(e) => {
                        const value = e.target.value.replace(/,/g, "");
                        setUpdatePrice_Per_Table(
                          isNaN(value) ? 0 : value < 0 ? 0 : value
                        );
                      }}
                    />
                  </div>
                  <div>
                    <Typography variant="h6" className="my-auto">
                      Giờ mở cửa:
                    </Typography>
                    <TextField
                      className="w-full"
                      type="time"
                      size="small"
                      value={updateOpenTime}
                      onChange={(e) => setUpdateOpenTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <Typography variant="h6" className="my-auto">
                      Giờ đóng cửa:
                    </Typography>
                    <TextField
                      className="w-full"
                      type="time"
                      size="small"
                      value={updateCloseTime}
                      onChange={(e) => setUpdateCloseTime(e.target.value)}
                    />
                  </div>
                </div>
                <Typography variant="h6" className="col-span-3">
                  Mô tả chi tiết:
                </Typography>
                <TextField
                  className="col-span-3"
                  type="text"
                  multiline
                  minRows={8}
                  maxRows={9}
                  size="sm"
                  value={updateDescription}
                  onChange={(e) => setUpdateDescription(e.target.value)}
                />
              </div>
            </div>
            <div></div>
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
      </AdminLayout>
      <Dialog size="xl" open={open} handler={handleOpen}>
        <DialogHeader className="pb-0 flex justify-between">
          <Typography variant="h4">Thêm nhà hàng</Typography>
          <IconButton
            className="border-none"
            variant="outlined"
            onClick={handleOpen}
          >
            <CloseIcon />
          </IconButton>
        </DialogHeader>
        <DialogBody>
          <Container>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-flow-row">
                {avatar_url === "" ? (
                  <figure className="my-auto mx-auto h-full w-full">
                    <div className="flex items-center  justify-center h-full w-full my-auto">
                      <label
                        htmlFor="avatar_url"
                        className="flex flex-col items-center justify-center h-full w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 "
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>

                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            SVG, PNG, JPG or GIF (MAX. 800x400px)
                          </p>
                          <Typography
                            as="caption"
                            variant="small"
                            className="mt-2 text-center font-normal"
                          >
                            Hình đại diện
                          </Typography>
                        </div>
                        <ImageUpload
                          image="avatar_url"
                          setImage={setAvatar_Url}
                          setPublicId={setPublic_Id_Avatar}
                        />
                      </label>
                    </div>
                  </figure>
                ) : (
                  <div className="grid grid-cols-5 justify-around mx-auto my-auto w-full">
                    <img
                      src={avatar_url}
                      alt="avatar"
                      className="h-[200px] w-full mx-auto col-span-4 object-cover rounded-l-md"
                    />
                    <Button
                      onClick={() => {
                        handleDelete(avatar_url);
                        setAvatar_Url("");
                      }}
                      color="red"
                      className="h-[200px] rounded-l-none p-2 my-auto text-center "
                    >
                      Xóa ảnh đại diện
                    </Button>
                  </div>
                )}
                <div className="grid grid-cols-2 row-span-1 gap-4 mt-4">
                  {slider1 === "" ? (
                    <figure className="my-auto mx-auto h-full w-full">
                      <div className="flex items-center  justify-center h-full w-full my-auto">
                        <label
                          htmlFor="slider_url_1"
                          className="flex flex-col items-center justify-center h-full w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 "
                        >
                          <div className="flex flex-col items-center justify-center my-auto">
                            <svg
                              className="w-8 h-8 text-gray-500 dark:text-gray-400"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 20 16"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                              />
                            </svg>
                            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </p>
                            <Typography
                              as="caption"
                              variant="small"
                              className="mt-2 text-center font-normal"
                            >
                              Hình 1
                            </Typography>
                          </div>
                          <ImageUpload
                            image="slider_url_1"
                            setImage={setSlider1}
                            setPublicId={setPublic_Id_Slider1}
                          />
                        </label>
                      </div>
                    </figure>
                  ) : (
                    <div className="flex justify-around mx-auto h-full">
                      <img
                        src={slider1}
                        alt="avatar"
                        className="h-[125px] object-cover rounded-l-md mx-auto my-auto w-[200px]"
                      />
                      <Button
                        onClick={() => {
                          handleDelete(slider1);
                          setSlider1("");
                        }}
                        color="red"
                        className="h-[125px] w-[50px] rounded-l-none p-0 my-auto text-center"
                      >
                        Xóa ảnh 1
                      </Button>
                    </div>
                  )}

                  {slider2 === "" ? (
                    <figure className="my-auto mx-auto h-full w-full">
                      <div className="flex items-center  justify-center h-full w-full my-auto">
                        <label
                          htmlFor="slider_url_2"
                          className="flex flex-col items-center justify-center h-full w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 "
                        >
                          <div className="flex flex-col items-center justify-center my-auto">
                            <svg
                              className="w-8 h-8 text-gray-500 dark:text-gray-400"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 20 16"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                              />
                            </svg>
                            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </p>
                            <Typography
                              as="caption"
                              variant="small"
                              className="mt-2 text-center font-normal"
                            >
                              Hình 2
                            </Typography>
                          </div>
                          <ImageUpload
                            image="slider_url_2"
                            setImage={setSlider2}
                            setPublicId={setPublic_Id_Slider2}
                          />
                        </label>
                      </div>
                    </figure>
                  ) : (
                    <div className="flex justify-around mx-auto h-full">
                      <img
                        src={slider2}
                        alt="avatar"
                        className="h-[125px] object-cover rounded-l-md mx-auto my-auto w-[200px]"
                      />
                      <Button
                        onClick={() => {
                          handleDelete(slider2);
                          setSlider2("");
                        }}
                        color="red"
                        className="h-[125px] w-[50px] rounded-l-none p-0 my-auto text-center"
                      >
                        Xóa ảnh 2
                      </Button>
                    </div>
                  )}

                  {slider3 === "" ? (
                    <figure className="my-auto mx-auto h-full w-full">
                      <div className="flex items-center  justify-center h-full w-full my-auto">
                        <label
                          htmlFor="slider_url_3"
                          className="flex flex-col items-center justify-center h-full w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 "
                        >
                          <div className="flex flex-col items-center justify-center my-auto">
                            <svg
                              className="w-8 h-8 text-gray-500 dark:text-gray-400"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 20 16"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                              />
                            </svg>
                            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </p>
                            <Typography
                              as="caption"
                              variant="small"
                              className="mt-2 text-center font-normal"
                            >
                              Hình 3
                            </Typography>
                          </div>
                          <ImageUpload
                            image="slider_url_3"
                            setImage={setSlider3}
                            setPublicId={setPublic_Id_Slider3}
                          />
                        </label>
                      </div>
                    </figure>
                  ) : (
                    <div className="flex justify-around mx-auto h-full">
                      <img
                        src={slider3}
                        alt="avatar"
                        className="h-[125px] object-cover rounded-l-md mx-auto my-auto w-[200px]"
                      />
                      <Button
                        onClick={() => {
                          handleDelete(slider3);
                          setSlider3("");
                        }}
                        color="red"
                        className="h-[125px] w-[50px] rounded-l-none p-0 my-auto text-center"
                      >
                        Xóa ảnh 3
                      </Button>
                    </div>
                  )}

                  {slider4 === "" ? (
                    <figure className="my-auto mx-auto h-full w-full">
                      <div className="flex items-center  justify-center h-full w-full my-auto">
                        <label
                          htmlFor="slider_url_4"
                          className="flex flex-col items-center justify-center h-full w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 "
                        >
                          <div className="flex flex-col items-center justify-center my-auto">
                            <svg
                              className="w-8 h-8 text-gray-500 dark:text-gray-400"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 20 16"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                              />
                            </svg>
                            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </p>
                            <Typography
                              as="caption"
                              variant="small"
                              className="mt-2 text-center font-normal"
                            >
                              Hình 4
                            </Typography>
                          </div>
                          <ImageUpload
                            image="slider_url_4"
                            setImage={setSlider4}
                            setPublicId={setPublic_Id_Slider4}
                          />
                        </label>
                      </div>
                    </figure>
                  ) : (
                    <div className="flex justify-around mx-auto h-full">
                      <img
                        src={slider4}
                        alt="avatar"
                        className="h-[125px] object-cover rounded-l-md mx-auto my-auto w-[200px]"
                      />
                      <Button
                        onClick={() => {
                          handleDelete(slider4);
                          setSlider4("");
                        }}
                        color="red"
                        className="h-[125px] w-[50px] rounded-l-none p-0 my-auto text-center"
                      >
                        Xóa ảnh 4
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Typography variant="h6" className="my-auto">
                  Tên:
                </Typography>
                <TextField
                  className="col-span-2"
                  type="text"
                  size="small"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Typography variant="h6" className="my-auto">
                  Địa chỉ:
                </Typography>
                <TextField
                  className="col-span-2"
                  type="text"
                  size="small"
                  multiline
                  minRows={2}
                  maxRows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />

                <div className="grid grid-cols-3 col-span-3 gap-4">
                  <div>
                    <Typography variant="h6" className="my-auto">
                      Giá mỗi người:
                    </Typography>
                    <OutlinedInput
                      className="col-span-2"
                      type="text"
                      size="small"
                      value={Number(price_per_table).toLocaleString("en-US")}
                      endAdornment={
                        <InputAdornment position="end">đ</InputAdornment>
                      }
                      onChange={(e) => {
                        const value = e.target.value.replace(/,/g, "");
                        setPrice_Per_Table(
                          isNaN(value) ? 0 : value < 0 ? 0 : value
                        );
                      }}
                    />
                  </div>
                  <div>
                    <Typography variant="h6" className="my-auto">
                      Giờ mở cửa:
                    </Typography>
                    <TextField
                      className="w-full"
                      type="time"
                      size="small"
                      value={openTime}
                      onChange={(e) => setOpenTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <Typography variant="h6" className="my-auto">
                      Giờ đóng cửa:
                    </Typography>
                    <TextField
                      className="w-full"
                      type="time"
                      size="small"
                      value={closeTime}
                      onChange={(e) => setCloseTime(e.target.value)}
                    />
                  </div>
                </div>
                <Typography variant="h6" className="col-span-3">
                  Mô tả chi tiết:
                </Typography>
                <TextField
                  className="col-span-3"
                  type="text"
                  multiline
                  minRows={6}
                  maxRows={7}
                  size="sm"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
            <div></div>
          </Container>
        </DialogBody>
        <DialogFooter>
          <Button color="green" onClick={handleAddSubmit}>
            Thêm
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default Restaurant;
