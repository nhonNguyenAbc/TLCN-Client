import React, { useState } from "react";
import { useGetUserOrdersQuery, useUpdateOrderRatingMutation, useUpdateOrderStatusMutation } from "../apis/orderApi";
import { StarIcon } from "@heroicons/react/24/outline";

const HistoryPage = () => {
  const [page, setPage] = useState(1); // Quản lý số trang
  const { data, isLoading, isError, refetch } = useGetUserOrdersQuery(page); // Gọi API

  const [selectedOrder, setSelectedOrder] = useState(null); // Lưu trữ đơn hàng được chọn
  const [rating, setRating] = useState(5); // Lưu trữ đánh giá (số sao)
  const [showRatingForm, setShowRatingForm] = useState(false); // Quản lý việc hiển thị form đánh giá
  const [showCancelModal, setShowCancelModal] = useState(false); // Quản lý việc hiển thị modal xác nhận hủy

  const [updateOrderRating] = useUpdateOrderRatingMutation(); // Mutation để cập nhật đánh giá
  const [updateOrderStatus] = useUpdateOrderStatusMutation(); // Hook hủy đơn
  const [notification, setNotification] = useState(null); // State cho thông báo
  const showNotification = (message, isSuccess) => {
    setNotification({ message, isSuccess });
    setTimeout(() => setNotification(null), 4000); // Ẩn thông báo sau 4 giây
  };

  const handleRowClick = (order) => {
    setSelectedOrder(order); // Gán đơn hàng được chọn
    setRating(order.rating || 5); // Lấy rating từ đơn hàng (nếu có)
  };

  const handleCloseDetail = () => {
    setSelectedOrder(null); // Đóng form chi tiết
  };

  const handleStarClick = (star) => {
    setRating(star); // Cập nhật rating khi người dùng click vào sao
  };

  const handleSubmitRating = async () => {
    try {
      await updateOrderRating({
        orderId: selectedOrder._id,
        rating,
      }).unwrap();
      showNotification("Cảm ơn đánh giá của bạn!", true);
      refetch();
      setShowRatingForm(false);
      setSelectedOrder({ ...selectedOrder, rating });
    } catch (error) {
      showNotification("Đã xảy ra lỗi khi gửi đánh giá. Vui lòng thử lại!", false);
      console.error("Lỗi khi đánh giá:", error);
    }
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
    <div className="max-w-5xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-5 text-center">Lịch sử đặt bàn</h1>
      {notification && (
        <div
          className={`mb-4 p-3 text-white rounded ${
            notification.isSuccess ? "bg-green-500" : "bg-red-500"
          } notification-animation`}
        >
          {notification.message}
        </div>
      )}

      {selectedOrder ? (
        <div className="bg-white shadow-md rounded p-5 w-full md:w-2/3 lg:w-1/2 mx-auto">
        <h2 className="text-xl font-bold mb-4">Chi tiết đơn hàng</h2>
          <p>
            <strong>Mã đơn:</strong> {selectedOrder.orderCode}
          </p>
          <p>
            <strong>Nhà hàng:</strong> {selectedOrder.restaurant}
          </p>
          <p>
            <strong>Thời gian:</strong>{" "}
            {new Date(selectedOrder.checkin).toLocaleString("vi-VN")}
          </p>
          <p>
            <strong>Số người:</strong> {selectedOrder.total_people}
          </p>
          <p>
            <strong>Tổng tiền:</strong>{" "}
            {selectedOrder.total.toLocaleString("vi-VN")}₫
          </p>
          <p>
            <strong>Trạng thái:</strong>{" "}
            {selectedOrder.status === "COMPLETED"
              ? "Hoàn thành"
              : selectedOrder.status === "PENDING"
              ? "Đang chờ"
              : "Đã hủy"}
          </p>

          {showRatingForm && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded shadow-lg w-96">
                <p>Bạn cảm thấy nhà hàng thế nào?</p>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      onClick={() => handleStarClick(star)}
                      className={`w-8 h-8 cursor-pointer ${
                        rating >= star
                          ? "text-yellow-500"
                          : "text-gray-300"
                      } ${rating >= star ? "fill-current" : "stroke-current"}`}
                    />
                  ))}
                </div>
                <div className="mt-4 flex justify-between">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={handleSubmitRating}
                  >
                    Gửi đánh giá
                  </button>
                  <button
                    className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
                    onClick={() => {
                      setShowRatingForm(false);
                      setRating(5); // Reset lại rating về 5 khi hủy
                    }}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-5 flex gap-5">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleCloseDetail}
            >
              Đóng
            </button>
            {selectedOrder.status === "COMPLETED" && selectedOrder.rating === 0 && (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => setShowRatingForm(true)}
              >
                Đánh giá
              </button>
            )}
            {selectedOrder.status === "PENDING"  && (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() =>  setShowCancelModal(true)}
              >
                Hủy
              </button>
            )}
          </div>
        </div>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Nhà hàng</th>
              <th className="border border-gray-300 px-4 py-2">Thời gian</th>
              <th className="border border-gray-300 px-4 py-2">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((order) => (
              <tr
                key={order.orderCode}
                className="text-center cursor-pointer hover:bg-gray-100"
                onClick={() => handleRowClick(order)}
              >
                <td className="border border-gray-300 px-4 py-2">
                  {order.restaurant}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(order.checkin).toLocaleString("vi-VN")}
                </td>
                <td
                  className={`border border-gray-300 px-4 py-2 ${
                    order.status === "COMPLETED"
                      ? "text-green-600"
                      : order.status === "PENDING"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {order.status === "COMPLETED"
                    ? "Hoàn thành"
                    : order.status === "PENDING"
                    ? "Đang chờ"
                    : "Đã hủy"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
