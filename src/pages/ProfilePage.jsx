import React, { useState } from "react";
import { Input } from "@material-tailwind/react";
import { useGetUserByIdQuery, useUpdateUserByIdMutation, useChangePasswordMutation } from "../apis/userApi";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import './profile.css'
const ProfilePage = ({ userId }) => {
  const { data: userData, isLoading, isError } = useGetUserByIdQuery(userId);
  const [updateUserById] = useUpdateUserByIdMutation();
  const [changePassword] = useChangePasswordMutation();
  const user = userData?.data;

  const [formType, setFormType] = useState(""); 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
  });

  const [passwordVisibility, setPasswordVisibility] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notification, setNotification] = useState(null);

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

  const getTitle = () => {
    if (formType === "update") return "Cập nhật thông tin";
    if (formType === "changePassword") return "Đổi mật khẩu";
    return "Thông tin cá nhân";
  };

  const showNotification = (message, isSuccess) => {
    setNotification({ message, isSuccess });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSaveUpdate = async () => {
    try {
      await updateUserById({ id: userId, data: formData }).unwrap();
      showNotification("Thông tin đã được cập nhật thành công!", true);
      setFormType("");
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      showNotification("Cập nhật thất bại. Vui lòng thử lại.", false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification("Mật khẩu mới và xác nhận mật khẩu không khớp.", false);
      return;
    }
    try {
      await changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      }).unwrap();
      showNotification("Mật khẩu đã được thay đổi thành công!", true);
      setFormType("");
    } catch (error) {
      console.error("Lỗi khi đổi mật khẩu:", error);
      showNotification("Đổi mật khẩu thất bại. Vui lòng thử lại.", false);
    }
  };

  if (isLoading) {
    return <div className="text-center">Đang tải...</div>;
  }

  if (isError) {
    return <div className="text-center text-red-500">Lỗi khi tải dữ liệu người dùng.</div>;
  }

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-5 bg-white shadow rounded">
      {notification && (
  <div
    className={`mb-4 p-3 text-white rounded ${
      notification.isSuccess ? "bg-green-500" : "bg-red-500"
    } notification-animation`}
  >
    {notification.message}
  </div>
)}

      <h1 className="text-2xl font-bold mb-5 text-center">{getTitle()}</h1>

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

      {formType === "changePassword" && (
        <div className="space-y-4">
          <div className="relative">
            <Input
              type={passwordVisibility.oldPassword ? "text" : "password"}
              label="Mật khẩu cũ"
              value={passwordData.oldPassword}
              onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
              className="w-full"
            />
            <div
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={() => togglePasswordVisibility("oldPassword")}
            >
              {passwordVisibility.oldPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </div>
          </div>

          <div className="relative">
            <Input
              type={passwordVisibility.newPassword ? "text" : "password"}
              label="Mật khẩu mới"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full"
            />
            <div
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={() => togglePasswordVisibility("newPassword")}
            >
              {passwordVisibility.newPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </div>
          </div>

          <div className="relative">
            <Input
              type={passwordVisibility.confirmPassword ? "text" : "password"}
              label="Xác nhận mật khẩu"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="w-full"
            />
            <div
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={() => togglePasswordVisibility("confirmPassword")}
            >
              {passwordVisibility.confirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </div>
          </div>

          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() =>setFormType("")}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Hủy
              </button>
              <button
                onClick={handleChangePassword}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Đổi mật khẩu
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default ProfilePage;
  
