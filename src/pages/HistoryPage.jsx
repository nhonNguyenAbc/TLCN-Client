import React, { useState, useRef } from "react";
import { useGetUserOrdersQuery, useUpdateOrderRatingMutation, useUpdateOrderStatusMutation } from "../apis/orderApi";
import { StarIcon } from "@heroicons/react/24/outline";
import Pagination from "../components/shared/Pagination";
import DishReviewModal from "../components/restaurant/DishReviewModal";
import { useCreateReviewMutation } from "../apis/reviewApi"; // Assuming you have this API endpoint
import { useNavigate } from "react-router-dom";

const HistoryPage = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useGetUserOrdersQuery(page);
  const [open, setOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rating, setRating] = useState(5);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate()
  // Comment form states
  const [reviewContent, setReviewContent] = useState('');
  const [image, setImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  // API mutations
  const [updateOrderRating] = useUpdateOrderRatingMutation();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [createReview] = useCreateReviewMutation();

  const handleOpen = (dish) => {
    setSelectedDish(dish);
    setOpen(true);
  };

  const handleSubmitReview = (reviewData) => {
    console.log("Dữ liệu đánh giá:", reviewData);
    // Gửi API ở đây nếu cần
  };

  const showNotification = (message, isSuccess) => {
    setNotification({ message, isSuccess });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setRating(order.rating || 5);
  };

  const handleCloseDetail = () => {
    setSelectedOrder(null);
  };

  const handleStarClick = (star) => {
    setRating(star);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const clearCommentForm = () => {
    setReviewContent('');
    setImage(null);
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Step 1: Submit star rating
  const handleSubmitRating = async () => {
    setIsSubmitting(true);
    try {
      await updateOrderRating({
        orderId: selectedOrder._id,
        rating,
      }).unwrap();
      showNotification("Cảm ơn đánh giá của bạn!", true);
      refetch();
      setShowRatingForm(false);
      setSelectedOrder({ ...selectedOrder, rating });

      // Open the comment form immediately after rating submission
      setShowCommentForm(true);
    } catch (error) {
      showNotification("Đã xảy ra lỗi khi gửi đánh giá. Vui lòng thử lại!", false);
      console.error("Lỗi khi đánh giá:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Submit comment and image (if any)
  const handleSubmitComment = async () => {
    if (!reviewContent.trim()) {
      showNotification("Vui lòng nhập nội dung đánh giá.", false);
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("restaurant_id", selectedOrder.restaurantId || selectedOrder.restaurant_id);
    formData.append("content", reviewContent);
    formData.append("rating", rating);

    if (image) {
      formData.append("image", image);
    }

    try {
      await createReview(formData).unwrap();
      showNotification("Cảm ơn nhận xét của bạn!", true);
      refetch();
      setShowCommentForm(false);
      clearCommentForm();
    } catch (error) {
      console.error("Error:", error);
      showNotification("Có lỗi xảy ra khi gửi nhận xét.", false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Skip comment submission and just close the form
  const handleSkipComment = () => {
    setShowCommentForm(false);
    clearCommentForm();
  };

  const handleCancelOrder = async () => {
    try {
      await updateOrderStatus({
        orderId: selectedOrder._id,
        newStatus: "CANCELLED",
      }).unwrap();
      showNotification("Đơn hàng đã được hủy!", true);
      setShowCancelModal(false);
      refetch();
      setSelectedOrder(null);
    } catch (error) {
      showNotification("Đã xảy ra lỗi khi hủy đơn. Vui lòng thử lại!", false);
      console.error("Lỗi khi hủy đơn:", error);
    }
  };

  const handleCancelModalClose = () => {
    setShowCancelModal(false);
  };

  if (isLoading) return <p>Đang tải...</p>;
  if (isError) return <p>Đã xảy ra lỗi khi tải dữ liệu.</p>;

  return (
    <div className="max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="uppercase text-3xl font-extrabold mb-6 text-center text-gray-800">Lịch sử đặt bàn</h1>

      {notification && (
        <div
          className={`mb-4 p-4 rounded-lg text-white font-medium ${notification.isSuccess ? "bg-green-500" : "bg-red-500"
            } notification-animation shadow-lg`}
        >
          {notification.message}
        </div>
      )}

      {selectedOrder ? (
        <div className="bg-white shadow-lg rounded-lg px-6 py-5 w-full md:w-2/3 lg:w-2/3 mx-auto">
          <h2 className="uppercase text-xl font-bold mb-4 text-gray-800">Chi tiết đơn hàng</h2>

          <p className="text-gray-700 mb-2">
            <strong className=" uppercase text-gray-900">Mã đơn:</strong> {selectedOrder.orderCode}
          </p>

          <p className="text-gray-700 mb-2">
            <strong className="uppercase text-gray-900">Nhà hàng: </strong>
            <span
              onClick={() => navigate(`/restaurant/${selectedOrder?.restaurant_id}`)}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              {selectedOrder.restaurant}
            </span>
          </p>

         {selectedOrder?.list_menu?.length >0 && (
              <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden shadow-md my-4">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border border-gray-300 px-6 py-3 text-left text-sm font-semibold text-gray-700"></th>
                  <th className="border border-gray-300 px-6 py-3 text-left text-sm font-semibold text-gray-700 w-[120px]">Hình ảnh</th>
                  <th className="border border-gray-300 px-6 py-3 text-left text-sm font-semibold text-gray-700">Tên món ăn</th>
                  <th className="border border-gray-300 px-6 py-3 text-left text-sm font-semibold text-gray-700">Số lượng</th>
                  <th className="border border-gray-300 px-6 py-3 text-center text-sm font-semibold text-gray-700"></th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.list_menu?.map((item, index) => (
                  <tr
                    key={item._id}
                    className="border border-gray-300 hover:bg-gray-50 transition-all duration-200"
                  >
                    <td className="border border-gray-300 px-6 py-4 text-center text-sm font-medium text-gray-800">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-6 py-4 text-center">
                      <img
                        className="h-16 w-16 object-cover rounded-lg shadow-md"
                        src={item.image.url}
                        alt={item.name}
                      />
                    </td>
                    <td className="border border-gray-300 px-6 py-4 text-sm font-medium text-gray-800">
                      {item.name}
                    </td>
                    <td className="border border-gray-300 px-6 py-4 text-center text-sm font-medium text-gray-800">
                      {item.quantity}
                    </td>
                    <td className="border border-gray-300 px-6 py-4 text-center">
                      <button
                        onClick={() => handleOpen(item)}
                        className="text-blue-500 hover:text-blue-700 text-sm font-semibold underline transition-all duration-200"
                      >
                        Đánh giá
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
         )}
     
          <DishReviewModal
            open={open}
            handleClose={() => setOpen(false)}
            dish={selectedDish}
            onSubmit={handleSubmitReview}
          />

          <div>
            <p className="text-gray-700 mb-2">
              <strong className="uppercase text-gray-900">Thời gian:</strong>{" "}
              {new Date(
                new Date(selectedOrder.checkin).setHours(
                  new Date(selectedOrder.checkin).getHours() - 7
                )
              ).toLocaleString("vi-VN")}
            </p>

            <p className="text-gray-700 mb-2">
              <strong className="uppercase text-gray-900">Số người:</strong> {selectedOrder.total_people}
            </p>

            <p className="text-gray-700 mb-2">
              <strong className="uppercase text-gray-900">Tổng tiền:</strong>{" "}
              {selectedOrder.total.toLocaleString("vi-VN")}₫
            </p>

            <p className="text-gray-700">
              <strong className="uppercase text-gray-900">Trạng thái:</strong>{" "}
              {selectedOrder.status === "COMPLETED"
                ? "Hoàn thành"
                : selectedOrder.status === "PENDING"
                  ? "Đang chờ"
                  : selectedOrder.status === "CANCELLED"
                    ? "Đã hủy"
                    : selectedOrder.status === "SUCCESS"
                      ? "Đặt thành công"
                      : "Đang nhận bàn"}
            </p>
          </div>
          {/* Form 1: Star Rating Form */}
          {showRatingForm && (
            <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
              <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fade-in">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                  Đánh giá nhà hàng
                </h2>

                <p className="text-center text-gray-600 mb-6">
                  Bạn cảm thấy nhà hàng thế nào?
                </p>

                {/* Star Rating */}
                <div className="flex justify-center mb-5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      onClick={() => handleStarClick(star)}
                      className={`w-10 h-10 mx-2 cursor-pointer transition-all duration-150
                      ${rating >= star ? "text-yellow-400" : "text-gray-300"}
                      ${rating >= star ? "fill-current" : "stroke-current"}`}
                    />
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex justify-end gap-4">
                  <button
                    className="px-5 py-2.5 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium transition"
                    onClick={() => {
                      setShowRatingForm(false);
                      setRating(5);
                    }}
                    disabled={isSubmitting}
                  >
                    Hủy
                  </button>
                  <button
                    className="px-6 py-2.5 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-semibold transition"
                    onClick={handleSubmitRating}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Form 2: Comment Form */}
          {showCommentForm && (
            <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
              <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl animate-fade-in">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
                  Chia sẻ trải nghiệm của bạn
                </h2>

                <p className="text-center text-gray-600 mb-6">
                  Hãy chia sẻ nhận xét về trải nghiệm của bạn tại nhà hàng
                </p>

                {/* Written Review */}
                <textarea
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  placeholder="Hãy chia sẻ trải nghiệm của bạn với nhà hàng..."
                  className="w-full h-40 p-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none mb-4"
                />

                {/* Image Upload */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Thêm hình ảnh (tùy chọn)</p>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      className="border p-2 rounded-md flex-1"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </div>

                  {/* Image Preview */}
                  {selectedImage && (
                    <div className="mt-3">
                      <div className="relative inline-block">
                        <img
                          src={selectedImage}
                          alt="Preview"
                          className="h-32 w-auto object-cover rounded-md"
                        />
                        <button
                          onClick={() => {
                            setSelectedImage(null);
                            setImage(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = '';
                            }
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-between">
                  <button
                    className="px-5 py-2.5 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium transition"
                    onClick={handleSkipComment}
                    disabled={isSubmitting}
                  >
                    Bỏ qua
                  </button>
                  <button
                    className="px-6 py-2.5 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-semibold transition"
                    onClick={handleSubmitComment}
                    disabled={isSubmitting || !reviewContent.trim()}
                  >
                    {isSubmitting ? "Đang gửi..." : "Gửi nhận xét"}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            <button
              className="bg-white text-gray-800 font-semibold px-5 py-2 rounded-xl border border-gray-300 shadow transition transform duration-200 hover:shadow-lg hover:-translate-y-0.5"
              onClick={handleCloseDetail}
            >
              Đóng
            </button>



            {selectedOrder.status === "COMPLETED" && selectedOrder.rating === 0 && (
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-5 py-2 rounded-xl shadow transition duration-200"
                onClick={() => setShowRatingForm(true)}
              >
                Đánh giá
              </button>
            )}

            {selectedOrder.status === "PENDING" && (
              <button
                className="bg-red-500 text-white font-semibold px-5 py-2 rounded-xl shadow-md transition transform duration-200 hover:bg-red-600 hover:shadow-lg hover:-translate-y-0.5"
                onClick={() => setShowCancelModal(true)}
              >
                Hủy đặt bàn
              </button>

            )}
          </div>

        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-md">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-50 uppercase text-gray-600 text-xs">
              <tr>
                <th className="px-6 py-3">Nhà hàng</th>
                <th className="px-6 py-3">Thời gian</th>
                <th className="px-6 py-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {data?.data.map((order) => (
                <tr
                  key={order.orderCode}
                  className="bg-white border-b hover:bg-gray-50 cursor-pointer transition"
                  onClick={() => handleRowClick(order)}
                >
                  <td className="px-6 py-4 font-medium">{order.restaurant}</td>
                  <td className="px-6 py-4">
                    {new Date(order.checkin).toLocaleString("vi-VN")}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${order.status === "COMPLETED"
                          ? "bg-green-100 text-green-700"
                          : order.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.status === "ONHOLD"
                              ? "bg-blue-100 text-blue-700"
                              : order.status === "SUCCESS"
                                ? "bg-indigo-100 text-indigo-700"
                                : "bg-red-100 text-red-700"
                        }`}
                    >
                      {order.status === "COMPLETED"
                        ? "Hoàn thành"
                        : order.status === "PENDING"
                          ? "Đang chờ"
                          : order.status === "ONHOLD"
                            ? "Đang nhận bàn"
                            : order.status === "SUCCESS"
                              ? "Đặt thành công"
                              : "Đã hủy"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      )}
      {data.info.number_of_pages > 1 && (
        <Pagination
          page={data.info.number_of_pages}
          active={page}
          setActive={setPage}
        />
      )}
      {showCancelModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <p>Bạn chắc chắn muốn hủy đơn hàng này?</p>
            <div className="mt-4 flex justify-between">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleCancelOrder}
              >
                Xác nhận hủy
              </button>
              <button
                className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
                onClick={handleCancelModalClose}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;