import React, { useEffect, useRef, useState } from "react";
import { UserIcon } from '@heroicons/react/24/solid'
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
  Modal,
  Dialog,
  DialogBody,
  DialogFooter
} from "@material-tailwind/react";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useGetAllTablesQuery,
  useGetTableByAnyFieldQuery,
} from "../apis/tableApi";
import { useGetMenuByRestaurantQuery, useGetMenuItemsByAnyFieldQuery } from "../apis/menuApi";
import { useGetRestaurantByIdQuery } from "../apis/restaurantApi";
import Loading from "../components/shared/Loading";
import { TextField } from "@mui/material";
import { useCreateReviewMutation, useGetReviewsByRestaurantQuery } from "../apis/reviewApi";
import Pagination from "../components/shared/Pagination";
import { current } from "@reduxjs/toolkit";

const RestaurantDetail = () => {
  const { id } = useParams();
  const [page, setPage] = useState(1)
  const [menuPage, setMenuPage] = useState(1)
  const [replyTo, setReplyTo] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [createReview, { isLoading }] = useCreateReviewMutation();
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
  const commentSectionRef = useRef(null);
  const menuSectionRef = useRef(null);
  const [visibleReplies, setVisibleReplies] = useState({});

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    data: restaurants,
    isLoading: restaurantLoading,
    error: restaurantError,
  } = useGetRestaurantByIdQuery(id);
  const {
    data: reviews,
    isLoading: reviewLoading,
    error: reviewError,
    refetch
  } = useGetReviewsByRestaurantQuery({ restaurant_id: id, page })

  const {
    data: menus
  } = useGetMenuByRestaurantQuery({ restaurantId: id, page: menuPage })
  const navigate = useNavigate();
  const [people, setPeople] = React.useState(
    JSON.parse(localStorage.getItem("order"))?.totalPeople || 0
  );

  const [date, setDate] = React.useState(
    new Date().toISOString().split("T")[0] // Ngày hiện tại ở định dạng YYYY-MM-DD
  );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setImage(file); // Cập nhật file ảnh để gửi trong `formData`
    }
  };
  const handleImageClick = (image) => {
    setSelectedImage(image);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedImage(null);
  };
  const handleSubmit = async (parentId = null) => {
    if (!content) {
      alert("Vui lòng nhập nội dung bình luận.");
      return;
    }
    console.log('parent', parentId)
    const formData = new FormData(); // Tạo form data để gửi file
    formData.append("restaurant_id", id); // Thêm ID nhà hàng
    formData.append("content", content); // Thêm nội dung bình luận
    if (parentId !== null && parentId !== undefined) {
      formData.append("parent_id", parentId); // Thêm ID của bình luận cha, nếu có
    } if (image) {
      formData.append("image", image); // Thêm file ảnh nếu có
    }
    try {
      const response = await createReview(formData).unwrap(); // Gọi API qua RTK Query
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setReplyTo(null)
      // Load lại dữ liệu mới từ server
      refetch();

      // Reset dữ liệu sau khi gửi thành công
      setContent(''); // Reset content về rỗng
      setImage(null); // Reset ảnh đã chọn về null
      setSelectedImage(null);
    } catch (error) {
      console.error("Error:", error);
      alert("Có lỗi xảy ra khi gửi đánh giá.");
    }
  };
  const toggleReplies = (commentId) => {
    setVisibleReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId], // Đảo trạng thái true/false
    }));
  };

  useEffect(() => {
    if (commentSectionRef.current) {
      commentSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [page]);
  useEffect(() => {
    if (menuSectionRef.current) {
      menuSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [menuPage]);
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const [time, setTime] = React.useState(
    JSON.parse(localStorage.getItem("order"))
      ? JSON.parse(localStorage.getItem("order"))
        ?.checkin?.split("T")[1]
        ?.split(".")[0]
        ?.split(":")
        ?.slice(0, 2)
        ?.join(":")
      : null
  );


  const [menu, setMenu] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem("menu")) || [];
    } catch (error) {
      console.error("Failed to parse menu from localStorage:", error);
      return [];
    }
  });
  const [total, setTotal] = React.useState(
    JSON.parse(localStorage.getItem("total")) || 0
  );
  React.useEffect(() => {
    localStorage.setItem("total", JSON.stringify(total));
  }, [total]);


  React.useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("order")) || {};
    const currentOrder = storedOrders[id] || {};
    setMenu(currentOrder.menu || []);
    setTotal(currentOrder.total || 0);
    setPeople(currentOrder.people || 0);
    setDate(currentOrder.date || new Date().toISOString().split("T")[0]);
    setTime(currentOrder.time || new Date().toTimeString().slice(0, 5));
  }, [id]);

  if (restaurantLoading)
    return (
      <div>
        <Loading />
      </div>
    );
  if (restaurantError) return <div>Error</div>;

  let promotionValue = null;
  if (restaurants?.data?.restaurant?.promotionDetails && Object.keys(restaurants.data.restaurant.promotionDetails).length > 0) {
    promotionValue = restaurants.data.restaurant.promotionDetails.discountValue;
  }

  const calculateTotal = (menu, people) => {
    // Tính tổng tiền từ menu
    const baseTotal = menu.reduce(
      (acc, item) =>
        acc + item.price * item.quantity * (1 - promotionValue / 100),
      0
    );

    // Tính phí thêm nếu số người vượt quá 10
    const additionalPeople = people > 10 ? people : 0;
    const additionalCost =
      additionalPeople * restaurants.data.restaurant.price_per_table * 0.5;

    // Tổng cộng tiền
    return baseTotal + additionalCost;
  };

  const handleAddToCart = (item) => {
    const newMenu = [...menu];
    const index = newMenu.findIndex((i) => i._id === item._id);
    if (index === -1) {
      newMenu.push({ ...item, quantity: 1 });
    } else {
      newMenu[index].quantity++;
    }
    setMenu(newMenu);

    // Tính lại tổng tiền bao gồm cả menu và số người
    const newTotal = calculateTotal(newMenu, people);
    setTotal(newTotal);

    // Lưu menu vào localStorage với từng nhà hàng
    const storedOrders = JSON.parse(localStorage.getItem("order")) || {};
    storedOrders[id] = {
      menu: newMenu,
      total: newTotal,
      people: people,
      date: date,
      time: time,
    };
    localStorage.setItem("order", JSON.stringify(storedOrders));
  };

  const handleRemoveFromCart = (item) => {
    const newMenu = [...menu];
    const index = newMenu.findIndex((i) => i._id === item._id);
    if (index !== -1) {
      if (newMenu[index].quantity === 1) {
        newMenu.splice(index, 1);
      } else {
        newMenu[index].quantity--;
      }
      setMenu(newMenu);

      // Tính lại tổng tiền bao gồm cả menu và số người
      const newTotal = calculateTotal(newMenu, people);
      setTotal(newTotal);

      // Lưu menu vào localStorage với từng nhà hàng
      const storedOrders = JSON.parse(localStorage.getItem("order")) || {};
      storedOrders[id] = {
        menu: newMenu,
        total: newTotal,
        people: people,
        date: date,
        time: time,
      };
      localStorage.setItem("order", JSON.stringify(storedOrders));
    }
  };


  const handleCheckout = () => {
    const result = {
      restaurantName: restaurants.data.restaurant.name,
      totalPeople: people,
      total: total,
      menu: menu,
      checkin: date + "T" + time + ":00.000Z",
      restaurantId: id,
      promotionValue: promotionValue
    };

    // Lưu thông tin đặt hàng vào localStorage với từng nhà hàng
    const storedOrders = JSON.parse(localStorage.getItem("order")) || {};
    storedOrders[id] = result;
    localStorage.setItem("order", JSON.stringify(storedOrders));

    navigate("/checkout", { state: { restaurantId: id } });
  };

  const handlePeopleChange = (e) => {
    const newPeople =
      e.target.value < 0 || isNaN(e.target.value) ? 0 : Number(e.target.value);

    setPeople(newPeople);

    const newTotal = calculateTotal(menu, newPeople);
    setTotal(newTotal);

    const storedOrders = JSON.parse(localStorage.getItem("order")) || {};
    storedOrders[id] = {
      menu: menu,
      total: newTotal,
      people: newPeople,
      date: date,
      time: time,
    };
    localStorage.setItem("order", JSON.stringify(storedOrders));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };
  const renderComments = (comments) => {
    return comments.map((comment) => (
      <div
        key={comment._id}
        className="flex flex-col mt-1 border p-3 rounded-md shadow-md"
      >
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-3">
            <Typography variant="h6" className="text-black">
              <UserIcon className="w-4 h-4 text-black" />
            </Typography>
          </div>
          <Typography variant="medium" className="text-black">
            {comment.username || "Ẩn danh"}
          </Typography>
        </div>

        {/* Nội dung bình luận */}
        <div className="flex-1 ml-4">
          <Typography variant="medium" className="text-black mb-2">
            {comment.content}
          </Typography>

          {/* Hiển thị ảnh nếu có */}
          {comment.image?.url && (
            <div className="mt-2">
              <img
                alt="Uploaded"
                src={comment.image.url}
                className="h-32 w-auto object-cover rounded-md"
              />
            </div>
          )}

          {/* Hiển thị thời gian */}
          <Typography variant="small" className="mt-1 text-gray-500">
            {new Date(comment.created_at).toLocaleString()}
          </Typography>
        </div>

        {/* Nút ẩn hiện + trả lời */}
        <div className="flex items-center gap-6 mt-2 ml-4">
          <button
            onClick={() => setReplyTo(replyTo === comment._id ? null : comment._id)}
            className="text-blue-500 hover:underline"
          >
            {replyTo === comment._id ? "Hủy" : "Phản hồi"}
          </button>
          {comment.replies?.length > 0 && (
            <button
              onClick={() => toggleReplies(comment._id)}
              className="text-blue-500 hover:underline"
            >
              {visibleReplies[comment._id]
                ? "Ẩn bình luận"
                : `Hiển thị ${comment.replies.length} phản hồi`}
            </button>
          )}


        </div>

        {/* Form trả lời nếu người dùng đang trả lời bình luận này */}
        {replyTo === comment._id && localStorage.getItem("token") && (
  <div className="flex items-start mt-3">
    <textarea
      className="w-full border p-2 rounded-md"
      placeholder="Nhập phản hồi của bạn..."
      value={content}
      onChange={(e) => setContent(e.target.value)}
    />
    <button
      onClick={() => handleSubmit(comment._id)}
      className="border-[#FF333a] text-[#FF333a] px-4 py-2 rounded-md ml-2"
    >
      Gửi
    </button>
  </div>
)}


        {/* Hiển thị replies nếu visibleReplies[comment._id] === true */}
        {visibleReplies[comment._id] && comment.replies?.length > 0 && (
          <div className="ml-4 border-l pl-4">
            {renderComments(comment.replies)}
          </div>
        )}
      </div>
    ));
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
                  {restaurants.data.restaurant.address.detail},
                  {" "}
                  {["1", "3", "4", "5", "6", "7", "8", "10", "11", "12"].includes(restaurants.data.restaurant.address.district)
                    ? `Q.${restaurants.data.restaurant.address.district}`
                    : restaurants.data.restaurant.address.district},
                  {" "} {restaurants.data.restaurant.address.province}
                </Typography>
              </div>
              <div className="grid grid-cols-4 my-4">
                <Typography variant="h6">Giá:</Typography>
                <Typography variant="medium" className="col-span-3">
                  {Number(
                    restaurants.data.restaurant.price_per_table
                  ).toLocaleString("en-US")}{" "}
                  đ/ người khi quá 10 người
                </Typography>
              </div>
              {promotionValue && (
                <div className="grid grid-cols-4 my-4">
                  <Typography variant="h6">Khuyến mãi:</Typography>
                  <div className="col-span-3">
                    <Typography variant="medium" className="mb-2 text-red-600">
                      {restaurants?.data?.restaurant?.promotionDetails?.description}
                    </Typography>
                    <Typography variant="medium" className="text-red-600">
                      {`Áp dụng từ ${formatDate(restaurants.data.restaurant.promotionDetails.startDate)} đến ${formatDate(
                        restaurants.data.restaurant.promotionDetails.endDate
                      )}`}
                    </Typography>
                  </div>
                </div>
              )}


            </CardBody>
          </Card>
          <Card className="mt-5">
            <CardBody>
              <Typography variant="h3" color="black">
                Chi tiết về {restaurants.data.restaurant.name}
              </Typography>
              <Typography variant="medium" color="black" className="my-5">
                {/* Thay thế '\n' bằng <br /> để hiển thị xuống dòng */}
                {restaurants?.data.restaurant.description.split('\n').map((line, index) => (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                ))}
              </Typography>

            </CardBody>
          </Card>
          <Card className="mt-5" ref={menuSectionRef}>
            <CardBody>
              <Typography variant="h3" color="black"
              >
                Thực đơn
              </Typography>
              <div className="grid grid-cols-5 my-3">
                <Typography variant="h6" className="my-auto">
                  Hình ảnh
                </Typography>
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
              {menus.data.menuItems.map((item) => (
                <div key={item} className="grid grid-cols-5 my-8">
                  <Typography variant="medium" className="my-auto w-16 h-auto">
                    <img
                      src={item.image.url}
                      alt="card-image"
                      className="object-cover h-16 w-16 cursor-pointer"
                      onClick={() => handleImageClick(item.image.url)} // Khi click vào ảnh sẽ mở modal
                    />
                  </Typography>
                  <Typography variant="medium" className="my-auto">
                    {item.name}
                  </Typography>
                  {restaurants.data.restaurant.promotionDetails.discountValue ? (
                    <Typography variant="medium" color="black" className="my-auto">
                      {(item.price * (1 - promotionValue / 100)).toLocaleString("en-US")}{" "}
                      <span className="line-through opacity-30">
                        {item.price.toLocaleString("en-US")}
                      </span>{" "}
                      đ
                    </Typography>
                  ) : (
                    <Typography variant="medium" color="black" className="my-auto">
                      {item.price.toLocaleString("en-US")} đ
                    </Typography>
                  )}

                  <Typography variant="medium" className="my-auto">
                    /{item.unit}
                  </Typography>
                  <Button
                    variant="outlined"
                    className="border-[#FF333a] text-[#FF333a] h-10 my-auto"
                    color="red"
                    onClick={() => handleAddToCart(item)}
                  >
                    Thêm vào giỏ hàng
                  </Button>

                </div>

              ))}
              {menus.data.pagination.totalPages > 1 && (
                <Pagination
                  page={menus.data.pagination.totalPages}
                  active={menuPage}
                  setActive={setMenuPage}
                />
              )}
              <Dialog open={isDialogOpen} handler={handleCloseDialog} className="max-h-[90vh]">
                <DialogBody className="max-h-full overflow-hidden">
                  <img
                    src={selectedImage}
                    alt="Larger View"
                    className="w-full max-h-[70vh] object-cover"  // Đảm bảo ảnh vừa với khung dialog, có thể cắt nếu cần
                  />
                </DialogBody>
                <DialogFooter>
                  <Button
                    variant="outlined"
                    color="red"
                    onClick={handleCloseDialog}
                    className="mt-4"
                  >
                    Đóng
                  </Button>
                </DialogFooter>
              </Dialog>
            </CardBody>

          </Card>
          <Card className="mt-5" ref={commentSectionRef}>
            {/* Header cho section bình luận */}
            <Typography variant="h3" color="black" className="ml-6">
              Bình luận đánh giá
            </Typography>
            <CardBody className="flex items-start mt-3 shadow-md">
              {/* Avatar mặc định */}
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center mr-4">
                <UserIcon className="w-6 h-6 text-black" />

              </div>

              {/* Khung bình luận */}
              <div className="flex-1">
                <textarea
                  className="w-full border p-2 rounded-md"
                  placeholder="Nhập bình luận của bạn..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <div className="flex items-center justify-between mt-2">
                  {/* Chọn ảnh */}
                  <input
                    type="file"
                    className="border p-2 rounded-md"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  {/* Nút đăng */}
                  <button
                    onClick={() => handleSubmit(null)}
                    className={`border-[#FF333a] text-[#FF333a] px-4 py-2 rounded-md ${!localStorage.getItem("token") ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    disabled={!localStorage.getItem("token") || isLoading}
                  >
                    {isLoading ? "Đang đăng..." : "Đăng"}
                  </button>

                </div>

              </div>
            </CardBody>
            {/* Hiển thị ảnh đã chọn nếu có */}
            <Card className="mt-5 ">

              {selectedImage && (
                <div className="relative">

                  <img
                    alt="Selected"
                    className="h-32 w-auto object-cover rounded-md"
                    src={selectedImage}
                  />
                  <button
                    className="absolute top-0  bg-red-500 text-white p-1 "
                    onClick={handleRemoveImage}
                  >
                    x
                  </button>
                </div>
              )}
            </Card>

            {/* Danh sách bình luận */}
            {reviewLoading && <Typography>Đang tải bình luận...</Typography>}
            {reviewError && <Typography>Lỗi khi tải bình luận!</Typography>}
            {reviews && reviews.data.length > 0 && (
              <div className="ml-4">
                {renderComments(reviews.data)}
                {reviews.data.totalPages > 1 && (
                  <Pagination
                    page={reviews.data.totalPages}
                    active={page}
                    setActive={setPage}
                  />
                )}
              </div>
            )}

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

                <TextField
                  size="small"
                  value={people}

                  onChange={handlePeopleChange}
                />

                <Typography variant="h6" className="my-auto">
                  Ngày nhận bàn
                </Typography>

                <TextField
                  size="small"
                  type="date"
                  value={date} // Hiển thị ngày mặc định là ngày hiện tại
                  min={new Date().toISOString().split("T")[0]} // Ngăn chọn ngày trước hôm nay
                  onChange={(e) => {
                    const selectedDate = e.target.value;
                    const today = new Date().toISOString().split("T")[0];

                    // Nếu người dùng cố gắng chọn ngày trước hôm nay, giữ nguyên ngày hiện tại
                    if (selectedDate < today) {
                      setDate(today);
                    } else {
                      setDate(selectedDate);
                    }
                  }}
                />
                <Typography variant="h6" className="my-auto">
                  Thời gian đến
                </Typography>

                <TextField
                  size="small"
                  type="time"
                  value={time}
                  min={
                    date === new Date().toISOString().split("T")[0]
                      ? new Date().toTimeString().slice(0, 5) // Lấy thời gian hiện tại định dạng HH:MM
                      : "00:00"
                  }
                  onChange={(e) => {
                    const selectedTime = e.target.value;
                    const currentTime = new Date().toTimeString().slice(0, 5); // Lấy thời gian hiện tại

                    // Nếu ngày là hôm nay và thời gian chọn nhỏ hơn thời gian hiện tại
                    if (
                      date === new Date().toISOString().split("T")[0] &&
                      selectedTime < currentTime
                    ) {
                      setTime(currentTime); // Đặt lại thời gian là thời gian hiện tại
                    } else {
                      setTime(selectedTime); // Cập nhật thời gian với giá trị người dùng chọn
                    }
                  }}
                />
              </div>
              <Typography variant="h6" className="my-auto mt-5">
                Thực đơn
              </Typography>

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
                        item.price * (1 - promotionValue / 100)
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
                disabled={people <= 0} // Disable button nếu people <= 0
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
