import React, { useState } from "react";
import { useGetUserOrdersQuery } from "../apis/orderApi";

const HistoryPage = () => {
  const [page, setPage] = useState(1); // Quản lý số trang
  const { data, isLoading, isError } = useGetUserOrdersQuery(page); // Gọi API

  const [selectedOrder, setSelectedOrder] = useState(null); // Lưu trữ đơn hàng được chọn

  const handleRowClick = (order) => {
    setSelectedOrder(order); // Gán đơn hàng được chọn
  };

  const handleCloseDetail = () => {
    setSelectedOrder(null); // Đóng form chi tiết
  };

  if (isLoading) return <p>Đang tải...</p>;
  if (isError) return <p>Đã xảy ra lỗi khi tải dữ liệu.</p>;
  return (
    <div className="max-w-5xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-5 text-center">Lịch sử đặt bàn</h1>

      {selectedOrder ? (
        // Hiển thị form chi tiết khi có đơn hàng được chọn
        <div className="bg-white shadow-md rounded p-5">
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
            {selectedOrder.status === "Completed"
              ? "Hoàn thành"
              : selectedOrder.status === "Pending"
              ? "Đang chờ"
              : "Đã hủy"}
          </p>
          <button
            className="mt-5 bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleCloseDetail}
          >
            Đóng
          </button>
        </div>
      ) : (
        // Hiển thị danh sách khi không có đơn hàng được chọn
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
                onClick={() => handleRowClick(order)} // Gắn sự kiện click
              >
               
                <td className="border border-gray-300 px-4 py-2">
                  {order.restaurant}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(order.checkin).toLocaleString("vi-VN")}
                </td>
                
                
                <td
                  className={`border border-gray-300 px-4 py-2 ${
                    order.status === "Completed"
                      ? "text-green-600"
                      : order.status === "Pending"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {order.status === "Completed"
                    ? "Hoàn thành"
                    : order.status === "Pending"
                    ? "Đang chờ"
                    : "Đã hủy"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HistoryPage;
