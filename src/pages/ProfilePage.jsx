import React, { useState } from "react";
import { Input } from "@material-tailwind/react";
import { useGetUserByIdQuery, useUpdateUserByIdMutation } from "../apis/userApi";

const ProfilePage = ({ userId }) => {
  const { data: userData, isLoading, isError } = useGetUserByIdQuery(userId);
  const [updateUserById] = useUpdateUserByIdMutation();
  const user = userData?.data;

  const [formType, setFormType] = useState(""); // "update", "changePassword", hoặc "" (giao diện chính)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
  });

  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        username: user.username,
        phone: user.phone,
      });
    }
  }, [user]);

  // Xác định title động
  const getTitle = () => {
    if (formType === "update") return "Cập nhật thông tin";
    if (formType === "changePassword") return "Đổi mật khẩu";
    return "Thông tin cá nhân";
  };

  // Hàm xử lý khi nhấn lưu thông tin cập nhật
  const handleSaveUpdate = async () => {
    try {
      await updateUserById({ id: userId, data: formData }).unwrap();
      alert("Thông tin đã được cập nhật thành công!");
      setFormType(""); // Quay lại giao diện chính
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      alert("Cập nhật thất bại. Vui lòng thử lại.");
    }
  };

  if (isLoading) {
    return <div className="text-center">Đang tải...</div>;
  }

  if (isError) {
    return <div className="text-center text-red-500">Lỗi khi tải dữ liệu người dùng.</div>;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-5 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-5 text-center">{getTitle()}</h1>

      {/* Form chính */}
      {formType === "" && (
        <>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="font-semibold w-1/3">Tên:</span>
              <Input type="text" value={formData.name} readOnly className="w-full" />
            </div>
            <div className="flex items-center space-x-4">
              <span className="font-semibold w-1/3">Email:</span>
              <Input type="text" value={formData.email} readOnly className="w-full" />
            </div>
            <div className="flex items-center space-x-4">
              <span className="font-semibold w-1/3">Tên người dùng:</span>
              <Input type="text" value={formData.username} readOnly className="w-full" />
            </div>
            <div className="flex items-center space-x-4">
              <span className="font-semibold w-1/3">Số điện thoại:</span>
              <Input type="text" value={formData.phone} readOnly className="w-full" />
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setFormType("update")}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Cập nhật thông tin
            </button>
            <button
              onClick={() => setFormType("changePassword")}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Đổi mật khẩu
            </button>
          </div>
        </>
      )}

      {/* Form cập nhật thông tin */}
      {formType === "update" && (
        <div className="space-y-4">
          <Input
            label="Tên"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full"
          />
          <Input
            label="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full"
          />
          <Input
            label="Tên người dùng"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full"
          />
          <Input
            label="Số điện thoại"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full"
          />
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => setFormType("")}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Hủy
            </button>
            <button
              onClick={handleSaveUpdate}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Lưu
            </button>
          </div>
        </div>
      )}

      {/* Form đổi mật khẩu */}
      {formType === "changePassword" && (
        <div className="space-y-4">
          <Input type="password" label="Mật khẩu cũ" className="w-full" />
          <Input type="password" label="Mật khẩu mới" className="w-full" />
          <Input type="password" label="Nhập lại mật khẩu mới" className="w-full" />
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => setFormType("")}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Hủy
            </button>
            <button
              onClick={() => alert("Tính năng đổi mật khẩu chưa được triển khai!")}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Lưu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
