import React, { useEffect, useRef, useState } from "react";
import { UserIcon } from '@heroicons/react/24/solid'
import { StarIcon as SolidStar } from "@heroicons/react/24/solid";
import { StarIcon as OutlineStar } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { useNavigate, useParams } from "react-router-dom";
import "../pages/myswiper.css"
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
import { useGetRencentlyRestaurantForUserQuery, useGetRestaurantByIdQuery } from "../apis/restaurantApi";
import Loading from "../components/shared/Loading";
import { Container, TextField } from "@mui/material";
import { useCreateReviewMutation, useDeleteReviewMutation, useGetReviewsByRestaurantQuery, useUpdateReviewMutation } from "../apis/reviewApi";
import Pagination from "../components/shared/Pagination";
import { ChatBubbleLeftEllipsisIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'; // Import các icon từ Heroicons
import MenuItemModal from "../components/restaurant/MenuItemModal";
import ChatButton from "..//components/shared/ChatButton";
import { useGetMostLikedVideoQuery } from "../apis/videoApi";
import { SwiperSlide, Swiper } from "swiper/react";
import ProductCard from "../components/restaurant/ProductCard";
import { Autoplay, EffectFade, Pagination as pagination, Navigation } from "swiper/modules";
import { useGetFavoritesQuery, useGetRecommendationsQuery, useToggleFavoriteMutation } from "../apis/userApi";
import ScrollToTop from "../components/shared/ScrollToTop";

const RestaurantDetail = () => {


  const { id } = useParams();
  const [toggleFavorite] = useToggleFavoriteMutation();
  const { data: favoriteData } = useGetFavoritesQuery();
  const [localFavorite, setLocalFavorite] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Đồng bộ local state khi favoriteData thay đổi
  useEffect(() => {
    const isFavorited = favoriteData?.favorites?.some(
      (res) => res._id === id
    );
    setLocalFavorite(isFavorited);
  }, [favoriteData, id]);

  const handleToggleFavorite = async () => {
    setLocalFavorite((prev) => !prev); // cập nhật tạm thời để phản hồi nhanh
    try {
      await toggleFavorite(id).unwrap(); // gọi API
    } catch (err) {
      setLocalFavorite((prev) => !prev); // khôi phục nếu lỗi
      console.error("Toggle favorite failed", err);
    }
  };
  const [page, setPage] = useState(1)
  const [menuPage, setMenuPage] = useState(1)
  const [replyTo, setReplyTo] = useState(null);
  const [selectedItem, setSelectedItem] = useState('')
  const [selectedImage, setSelectedImage] = useState(null);
  const [createReview, { isLoading }] = useCreateReviewMutation();
  const { data: rencentRestaurant } = useGetRencentlyRestaurantForUserQuery();
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
  const commentSectionRef = useRef(null);
  const menuSectionRef = useRef(null);
  const [visibleReplies, setVisibleReplies] = useState({});
  const [editCommentId, setEditCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const userId = localStorage.getItem("userId"); // Lấy userId từ localStorage
  const userName = localStorage.getItem("userName")
  const { data: recommendedRestaurant } = useGetRecommendationsQuery()
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
  const [updateReview] = useUpdateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();
  const { data: mostVideo } = useGetMostLikedVideoQuery({ restaurantId: id })
  const [category, setCategory] = useState('');

  const {
    data: menus
  } = useGetMenuByRestaurantQuery({ restaurantId: id, page: menuPage, category: category })
  const navigate = useNavigate();
  const [people, setPeople] = React.useState(
    JSON.parse(localStorage.getItem("order"))?.totalPeople || 0
  );
  const handleCategoryClick = (selectedCategory) => {
    setCategory(selectedCategory); // Cập nhật thể loại
    setMenuPage(1); // Đặt lại trang về 1 khi lọc lại
  };
  const images = restaurants?.data?.restaurant?.images; // Lấy danh sách ảnh
  const displayedImages = images?.slice(0, 3); // 3 ảnh đầu tiên
  const moreImages = images?.length - 3; // Số ảnh còn lại
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
  const handleItemModalClick = (item) => {
    setSelectedItem(item);
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
    const currentUserId = localStorage.getItem('userId'); // Lấy userId từ localStorage hoặc context
    return comments.map((comment) => (
      <div
        key={comment._id}
        className="flex flex-col mt-1 border p-3 rounded-md shadow-md relative"
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
          {/* {comment.user_id === currentUserId && (
            <div className="ml-auto flex items-center space-x-3">
              <PencilIcon
                className="w-5 h-5 text-gray-500 cursor-pointer"
                onClick={() => {
                  setEditCommentId(comment._id);
                  setEditedContent(comment.content); // Cập nhật nội dung chỉnh sửa
                }}
              />
              <TrashIcon
                className="w-5 h-5 text-red-500 cursor-pointer"
                onClick={() => setConfirmDeleteId(comment._id)} // Lưu lại ID để xác nhận xóa
              />
            </div>
          )} */}
        </div>

        {/* Nội dung bình luận */}
        <div className="flex-1 ml-4">
          {editCommentId === comment._id ? (
            <div>
              <textarea
                className="w-full border p-2 rounded-md"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
              <button
                onClick={async () => {
                  try {
                    await updateReview({ id: comment._id, content: editedContent });
                    setEditCommentId(null);

                    // Gọi lại API để lấy dữ liệu mới
                    await refetch(); // Đảm bảo refetch được gọi sau khi cập nhật xong
                  } catch (error) {
                    console.error("Error updating comment:", error);
                  }
                }}
                className="border-[#FF333a] text-[#FF333a] px-4 py-2 rounded-md"
              >

                Lưu
              </button>
            </div>
          ) : (
            <Typography variant="medium" className=" text-black mb-2 flex-1 gap-1">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, index) =>
                  index < comment.rating ? (
                    <OutlineStar
                      key={index}
                      className="h-5 w-5 stroke-yellow-500 fill-yellow-500 drop-shadow-sm"
                    />
                  ) : (
                    <OutlineStar
                      key={index}
                      className="h-5 w-5 stroke-gray-400 fill-white"
                    />
                  )
                )}
              </div>
              {comment.content}
            </Typography>
          )}

          {/* Form xác nhận xóa */}
          {confirmDeleteId === comment._id && (
            <div className="absolute top-0 right-0 bg-white border shadow-md p-4 rounded-md z-10">
              <Typography variant="small" className="text-red-500">
                Bạn có chắc chắn muốn xóa bình luận này không?
              </Typography>
              <button
                onClick={() => {
                  deleteReview(comment._id);
                  setConfirmDeleteId(null); // Đóng form xác nhận
                  refetch()
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Xóa
              </button>
              <button
                onClick={() => setConfirmDeleteId(null)} // Đóng form xác nhận
                className="bg-gray-300 text-black px-4 py-2 rounded-md ml-2"
              >
                Hủy
              </button>
            </div>
          )}

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
    <div key={id}>
      <ScrollToTop />

      <div className="mb-5"></div>
      <div className="grid grid-cols-3 gap-8 m-4">

        <div className="relative col-span-2">
          <img
            src={restaurants.data.restaurant.image_url}
            className="w-full h-80 object-cover rounded-lg"
            alt="restaurant"
          />
          <button
            onClick={handleToggleFavorite}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/30 transition"
          >
            {localFavorite ? (
              <HeartSolid className="w-6 h-6 text-red-500 drop-shadow-lg" />
            ) : (
              <HeartOutline className="w-6 h-6 text-white drop-shadow-lg" />
            )}
          </button>

        </div>
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

        {/* <img
        src={restaurants.data.restaurant.image_url}
        className="w-full h-80 object-cover rounded-lg col-span-2"
        alt="restaurant"
      />

      <div className="grid grid-cols-2 gap-8">
        {displayedImages.map((image, index) => (
          <img
            key={image.id}
            src={image.url}
            className="h-36 w-full object-cover rounded-lg cursor-pointer"
            alt={`slider-${index + 1}`}
            onClick={() => { setSelectedImage(image.url); setIsOpen(true); }}
          />
        ))}

        {images.length > 3 ? (
          <div
            className="relative h-36 cursor-pointer"
            onClick={() => { setSelectedImage(images[3].url); setIsOpen(true); }}
          >
            <img
              src={images[3].url}
              className="h-full w-full object-cover rounded-lg"
              alt="slider-4"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <span className="text-white text-lg font-bold">+{moreImages}</span>
            </div>
          </div>
        ) : (
          <img
            src={images[3]?.url}
            className="h-36 object-cover rounded-lg cursor-pointer"
            alt="slider-4"
            onClick={() => { setSelectedImage(images[3]?.url); setIsOpen(true); }}
          />
        )}

      {isOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
    <div className="relative w-3/4 h-3/4 bg-white p-4 flex rounded-lg">
      <div className="w-2/5 overflow-y-auto grid grid-cols-2 gap-2">
        {images.map((img) => (
          <img
            key={img.id}
            src={img.url}
            className={`h-40 w-full object-cover cursor-pointer rounded-lg ${
              selectedImage === img.url ? "border-2 border-blue-500" : ""
            }`}
            onClick={() => setSelectedImage(img.url)}
          />
        ))}
      </div>

      <div className="flex-1 flex justify-center items-center">
        <img src={selectedImage} className="max-h-full max-w-full rounded-lg" />
      </div>

      <button
        className="absolute top-4 right-4 black-white text-2xl"
        onClick={() => setIsOpen(false)}
      >
        ✖
      </button>
    </div>
  </div>
)}

    </div> */}
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
              <div className="mt-5">
                <Typography variant="h5" color="black">
                  Video nổi bật
                </Typography>
                {mostVideo && (
                  <video controls className="mt-3 rounded-lg shadow-lg w-[600px] h-[340px] object-cover">
                    <source src={mostVideo.videoUrl} type="video/mp4" />
                    Trình duyệt không hỗ trợ phát video.
                  </video>

                )}
              </div>
            </CardBody>
          </Card>
          <Card className="mt-5" ref={menuSectionRef}>
            <CardBody>
              <Typography variant="h3" color="black">
                Thực đơn
              </Typography>

              {/* Danh sách thể loại */}
               <div className="overflow-x-auto">
                    <div className="flex items-center border-b border-gray-300 text-sm font-medium text-gray-700">
                        {[
                            { label: "Tất cả", value: "" },
                            { label: "Hải sản", value: "Dish" },
                            { label: "Món hấp", value: "Beverage" },
                            { label: "Món chiên", value: "Dessert" },
                        ].map(({ label, value }, index, array) => (
                            <div key={value} className="flex items-center">
                                <button
                                    onClick={() => handleCategoryClick(value)}
                                    className={`pb-2 px-2 font-medium transition-all duration-200 ${selectedCategory === value
                                            ? '!text-red-600 border-b-2 border-red-600'
                                            : 'text-gray-700 border-b-2 border-transparent hover:text-red-500'
                                        }`}
                                >
                                    {label}
                                </button>

                                {index !== array.length - 1 && (
                                    <span className="text-gray-300 px-1">|</span>
                                )}
                            </div>
                        ))}
                    </div>

                </div>

              {/* Danh sách món ăn */}
              

              {/* {menus.data.menuItems.map((item) => (
                <div key={item._id} className="grid grid-cols-6 my-8 gap-6">
                  <Typography variant="medium" className="my-auto w-16 h-auto">
                    <img
                      src={item.image.url}
                      alt="card-image"
                      className="object-cover h-16 w-16 cursor-pointer"
                      onClick={() => handleItemModalClick(item)}
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
                    className="flex h-10 my-auto border-[#FF333a] text-[#FF333a] items-center"
                    color="red"
                    onClick={() => handleAddToCart(item)}
                  >
                    Thêm vào giỏ hàng
                  </Button>
                </div>
              ))} */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {menus?.data?.menuItems.map((item) => (
                        <div
                            key={item?._id}
                            className="flex items-center justify-between gap-4 border-b pb-4"
                        >
                            {/* Hình ảnh và mô tả bên trái */}
                            <div
                                className="flex items-center gap-4 flex-1 cursor-pointer"
                                onClick={() => handleItemModalClick(item)}
                            >
                                <img
                                    src={item?.image.url}
                                    alt={item?.name}
                                    className="h-20 w-20 object-cover rounded-md"
                                />
                                <div className="flex flex-col justify-center">
                                    {restaurants?.data?.restaurant?.promotionDetails.discountValue ? (
                                        <div className="text-[#FF333a] font-semibold text-md">
                                            {(item?.price * (1 - promotionValue / 100)).toLocaleString("en-US")} đ{" "}
                                            <span className="line-through text-sm text-gray-400 ml-1">
                                                {item?.price.toLocaleString("en-US")} đ
                                            </span>{" "}
                                            /{item?.unit}
                                        </div>
                                    ) : (
                                        <div className="text-[#FF333a] font-semibold text-md">
                                            {item?.price.toLocaleString("en-US")} đ /{item?.unit}
                                        </div>
                                    )}
                                    <p className="text-gray-800 text-sm">{item?.name}</p>
                                </div>
                            </div>

                            {/* Nút thêm vào giỏ */}
                            <Button
                                variant="outlined"
                                className="h-10 border-[#FF333a] text-[#FF333a] px-4"
                                color="red"
                                onClick={() => handleAddToCart(item)}
                            >
                                Thêm vào giỏ
                            </Button>
                        </div>
                    ))}
                </div>


              {/* Phân trang */}
              {menus.data.pagination.totalPages > 1 && (
                <Pagination
                  page={menus.data.pagination.totalPages}
                  active={menuPage}
                  setActive={setMenuPage}
                />
              )}

              <MenuItemModal isDialogOpen={isDialogOpen} handleCloseDialog={handleCloseDialog} item={selectedItem} />
            </CardBody>
          </Card>


          <Card className="mt-5" ref={commentSectionRef}>
            {/* Header cho section bình luận */}
            <Typography variant="h3" color="black" className="ml-6">
              Bình luận đánh giá
            </Typography>

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
                {reviews.info.totalPages > 1 && (
                  <Pagination
                    page={reviews.info.totalPages}
                    active={page}
                    setActive={setPage}
                  />
                )}
              </div>
            )}

          </Card>
          <div className="relative w-full">
            <Container>
              <Typography variant="h3" className="text-left mt-8">
                Nhà hàng uy tín
              </Typography>
            </Container>
            <Swiper
              slidesPerView={3}
              spaceBetween={30}
              modules={[Navigation]}
              loop={false}
              navigation={{
                nextEl: ".swiper-button-next1",
                prevEl: ".swiper-button-prev1",
              }}
              className="w-[90%] mx-auto"
            >
              {recommendedRestaurant?.data?.map((restaurant) => (
                <SwiperSlide key={restaurant?.id} className="my-8">
                  <ProductCard {...restaurant} />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Nút trước */}
            <div
              className="swiper-button-prev1 absolute left-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer transition-all
                w-12 h-12 flex items-center justify-center text-black
                [&.swiper-button-disabled]:opacity-0 [&.swiper-button-disabled]:pointer-events-none"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Nút sau */}
            <div
              className="swiper-button-next1 absolute right-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer transition-all
                w-12 h-12 flex items-center justify-center text-black
                [&.swiper-button-disabled]:opacity-0 [&.swiper-button-disabled]:pointer-events-none"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>


          <div className="relative w-full">
            <Container>
              <Typography variant="h3" className="text-left mt-8">
                Đã xem gần đây
              </Typography>
            </Container>
            <Swiper
              slidesPerView={3}
              spaceBetween={30}
              modules={[Navigation]}
              loop={false}
              navigation={{
                nextEl: ".swiper-button-next2",
                prevEl: ".swiper-button-prev2",
              }}
              className="w-[90%] mx-auto"
            >
              {rencentRestaurant?.data?.map((restaurant) => (
                <SwiperSlide key={restaurant?.id} className="my-8">
                  <ProductCard {...restaurant} />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Nút trước */}
            <div
              className="swiper-button-prev2 absolute left-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer transition-all
                w-12 h-12 flex items-center justify-center text-black
                [&.swiper-button-disabled]:opacity-0 [&.swiper-button-disabled]:pointer-events-none"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Nút sau */}
            <div
              className="swiper-button-next2 absolute right-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer transition-all
                w-12 h-12 flex items-center justify-center text-black
                [&.swiper-button-disabled]:opacity-0 [&.swiper-button-disabled]:pointer-events-none"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        <div className="">
          <div className="sticky top-20">
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
      </div>
      <ChatButton userId={userId} ownerId={restaurants?.data?.restaurant?.user} restaurantId={restaurants?.data?.restaurant?._id} userName={userName} />
    </div>
  );
};

export default RestaurantDetail;
