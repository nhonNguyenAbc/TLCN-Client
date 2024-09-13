import React from "react";
import { Button, Input } from "@material-tailwind/react";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Icon from "../assets/Icon";
import { loginUser, useLoginMutation } from "../apis/userApi";
import { useNavigate } from "react-router-dom";
import { Toast } from "../configs/SweetAlert2";
function Loginpage() {
  const [username, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();
  // const handleEmailChange = (e) => {
  //   setEmail(e.target.value);
  // };
  const handleUsernameChange = (e) => {
    setUserName(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const [login, { isLoading: isLoginLoading, error: isLoginError }] =
    useLoginMutation();
  const loginUser = async (username, password) => {
    try {
      const data = {
        username: username,
        email: username,
        phone_number: username,
        password: password,
      };
      // if check if
      const result = await login(data).unwrap();
      if (result.status === 200) {
        Toast.fire({
          icon: "success",
          title: "Login successfully",
        }).then(() => {
          localStorage.setItem("user", username);
          // localStorage.setItem("id", result.data.user_id);
          localStorage.setItem("token", result.data);
          navigate("/");
        });
      }
    } catch (error) {
      // if (error.response.data.phoneNumber) {
      //   Toast.fire({
      //     icon: "error",
      //     title: error.response.data.phoneNumber,
      //   });
      // } else
      if (error.response.data.password) {
        Toast.fire({
          icon: "error",
          title: error.response.data.password,
        });
      }
    }
  };
  return (
    <>
      <div className="grid lg:grid-cols-3 sm:grid-cols-1">
        <div className="h-screen lg:border-r-4">
          <div className="mt-20">
            <h1 className="text-center text-6xl mb-5">
              <span className="text-[#FF333A]">Mindx</span>
            </h1>
            <Divider>
              <h3 className="text-center text-xl">Đăng nhập</h3>
            </Divider>
            <form className="max-w-sm mx-auto">
              <div className="mb-5 mt-20">
                <Input
                  size="lg"
                  variant="outlined"
                  label="Email hoặc số điện thoại"
                  placeholder="nguyenvana@gmail.com"
                  onChange={handleUsernameChange}
                  // onChange={handleEmailChange}
                />
              </div>
              <div className="mb-5">
                <Input
                  size="lg"
                  variant="outlined"
                  label="Mật khẩu"
                  placeholder="Mật khẩu"
                  type="password"
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="mb-5 text-right">
                <div className="h-5">
                  <a
                    href="#"
                    className="text-right"
                    onClick={() => navigate("/reset-password")}
                  >
                    Quên mật khẩu
                  </a>
                </div>
              </div>
              <Button
                color="indigo"
                className="w-full mb-5"
                loading={isLoginLoading}
                onClick={() => loginUser(username, password)}
              >
                Đăng nhập
              </Button>
            </form>
            <div className="max-w-sm mx-auto">
              <Divider className="mt-5 ">
                <Chip label="OR" size="small" />
              </Divider>
            </div>
            <div className="max-w-sm mx-auto mt-5">
              <Button
                loading={isLoginLoading}
                onClick={() => {
                  navigate("/register");
                }}
                color="indigo"
                className="w-full mb-5"
              >
                Đăng ký
              </Button>
              {/* <Button
                size="sm"
                variant="outlined"
                color="blue-gray"
                className="flex items-center justify-center gap-3 w-full"
              >
                <img
                  src="https://docs.material-tailwind.com/icons/google.svg"
                  alt="metamask"
                  className="h-6 w-6"
                />
                Continue with Google
              </Button> */}
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

export default Loginpage;
