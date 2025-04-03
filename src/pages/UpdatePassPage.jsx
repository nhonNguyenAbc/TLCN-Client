import React, { useState } from "react";
import { Button, Input } from "@material-tailwind/react";
import Divider from "@mui/material/Divider";
// import Chip from "@mui/material/Chip";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../apis/userApi"; // API để đặt lại mật khẩu
import { Toast } from "../configs/SweetAlert2";

function UpdatePassPage() {
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCodeChange = (e) => setCode(e.target.value);
  const handleNewPasswordChange = (e) => setNewPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  const validatePasswords = () => {
    if (!newPassword || !confirmPassword) {
      return "Mật khẩu và xác nhận mật khẩu là bắt buộc";
    }
    if (newPassword !== confirmPassword) {
      return "Mật khẩu không khớp";
    }
    return "";
  };

  const handleResetPassword = async () => {
    const passwordError = validatePasswords();
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      const result = await resetPassword({ code, newPassword });
      console.log(result);
      Toast.fire({
        icon: "success",
        title: "Password reset successful",
      }).then(() => {
        navigate("/login");
      });
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: error.message || "Error resetting password",
      });
    }
  };

  return (
    <div className="grid lg:grid-cols-3 sm:grid-cols-1">
      <div className="h-screen lg:border-r-4">
        <div className="mt-20">
          <h1 className="text-center text-6xl mb-5">
            <span className="text-[#FF333A]">TableHive H&N</span>
          </h1>
          <Divider>
            <h3 className="text-center text-xl">Đặt lại mật khẩu</h3>
          </Divider>
          <form className="max-w-sm mx-auto">
            <div className="mb-5 mt-20">
              <Input
                size="lg"
                variant="outlined"
                label="Mã reset"
                placeholder="Nhập mã reset"
                onChange={handleCodeChange}
                required
              />
            </div>
            <div className="my-5">
              <Input
                size="lg"
                variant="outlined"
                label="Mật khẩu mới"
                placeholder="Nhập mật khẩu mới"
                type="password"
                onChange={handleNewPasswordChange}
                required
              />
            </div>
            <div className="my-5">
              <Input
                size="lg"
                variant="outlined"
                label="Xác nhận mật khẩu"
                placeholder="Nhập lại mật khẩu mới"
                type="password"
                onChange={handleConfirmPasswordChange}
                required
              />
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
            <Button
              color="indigo"
              className="w-full mb-5"
              onClick={handleResetPassword}
            >
              Đặt lại mật khẩu
            </Button>
          </form>
        </div>
      </div>
      <div className="bg-gray-100 col-span-2 lg:block hidden h-screen">
        <div className="mx-auto" style={{ height: "700px", width: "700px" }}>
          {/* Thay thế bằng icon của bạn */}
        </div>
      </div>
    </div>
  );
}

export default UpdatePassPage;
