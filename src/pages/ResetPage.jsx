import React, { useState } from "react";
import { Button, Input } from "@material-tailwind/react";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Icon from "../assets/Icon";
import { sendResetPasswordEmail } from "../apis/userApi"; // API để gửi email reset mật khẩu
import { useNavigate } from "react-router-dom";
import { Toast } from "../configs/SweetAlert2";

function ResetPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (e.target.value) {
      setError("");
    }
  };
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Email là bắt buộc");
      return;
    }
    if (!validateEmail(email)) {
      setError("Định dạng email không hợp lệ");
      return;
    }
    try {
      const result = await sendResetPasswordEmail({ to: email });
      console.log(result);
      Toast.fire({
        icon: "success",
        title: "Reset password email sent successfully",
      }).then(() => {
        navigate("/update-password");
      });
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: error.message || "Error sending reset password email",
      });
    }
  };

  return (
    <>
      <div className="grid lg:grid-cols-3 sm:grid-cols-1">
        <div className="h-screen lg:border-r-4">
          <div className="mt-20">
            <h1 className="text-center text-6xl mb-5">
              <span className="text-[#FF333A]">TableHive H&N</span>
            </h1>
            <Divider>
              <h3 className="text-center text-xl">Reset mật khẩu</h3>
            </Divider>
            <form className="max-w-sm mx-auto">
              <div className="mb-5 mt-20">
                <Input
                  size="lg"
                  variant="outlined"
                  label="Email"
                  placeholder="nguyenvana@gmail.com"
                  onChange={handleEmailChange}
                  required
                />
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
              </div>
              <Button
                color="indigo"
                className="w-full mb-5"
                onClick={handleResetPassword}
              >
                Gửi email reset mật khẩu
              </Button>
            </form>
            <div className="max-w-sm mx-auto">
              <Divider className="mt-5 ">
                <Chip label="OR" size="small" />
              </Divider>
            </div>
            <div className="max-w-sm mx-auto mt-5">
              <Button
                onClick={() => {
                  navigate("/login");
                }}
                color="indigo"
                className="w-full mb-5"
              >
                Quay lại trang đăng nhập
              </Button>
            </div>
          </div>
        </div>
        <div className="bg-gray-100 col-span-2 lg:block hidden h-screen">
          <div className="mx-auto" style={{ height: "700px", width: "700px" }}>
            <Icon />
          </div>
        </div>
      </div>
    </>
  );
}

export default ResetPasswordPage;
