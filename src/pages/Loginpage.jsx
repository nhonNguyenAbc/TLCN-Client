import React from "react";
import { Button, Input } from "@material-tailwind/react";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Icon from "../assets/Icon";
import { useNavigate } from "react-router-dom";
import { Toast } from "../configs/SweetAlert2";
import { useLazyGetUserByIdQuery, useLoginMutation } from "../apis/userApi";

function LoginPage() {
  const [username, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();
  
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [trigger] = useLazyGetUserByIdQuery();

  const handleUsernameChange = (e) => {
    setUserName(e.target.value);
  };
  
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (username, password) => {
    try {
      const data = {
        username: username,
        email: username,
        phone_number: username,
        password: password,
      };

      const loginResult = await login(data).unwrap();
      
      if (loginResult.status === 200) {
        // Store token first
        localStorage.setItem("token", loginResult.data);
        localStorage.setItem("user", username);
        
        // Now fetch user data with the new token
        try {
          // Use trigger() to start the query
          const { data: userData } = await trigger(undefined, { 
            preferCacheValue: false // Force a new request
          });
          console.log('name', userData)
          if (userData?.data?._id) {
            localStorage.setItem("userId", userData.data._id);
            localStorage.setItem("userName", userData.data.name);

            await Toast.fire({
              icon: "success",
              title: "Login successfully",
            });
            
            navigate("/");
          } else {
            throw new Error("User data not found");
          }
        } catch (userError) {
          console.error("Error fetching user data:", userError);
          Toast.fire({
            icon: "error",
            title: "Error fetching user data",
          });
          // Optionally: clear token and user data
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
    } catch (error) {
      if (error.response?.data?.password) {
        Toast.fire({
          icon: "error",
          title: error.response.data.password,
        });
      } else {
        Toast.fire({
          icon: "error",
          title: "Login failed",
        });
      }
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
                <a href="#" onClick={() => navigate("/reset-password")}>
                  Quên mật khẩu
                </a>
              </div>
            </div>
            <Button
              color="indigo"
              className="w-full mb-5"
              loading={isLoginLoading}
              onClick={() => handleLogin(username, password)}
            >
              Đăng nhập
            </Button>
          </form>
          <div className="max-w-sm mx-auto">
            <Divider className="mt-5">
              <Chip label="OR" size="small" />
            </Divider>
          </div>
          <div className="max-w-sm mx-auto mt-5">
            <Button
              loading={isLoginLoading}
              onClick={() => navigate("/register")}
              color="indigo"
              className="w-full mb-5"
            >
              Đăng ký
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
  );
}

export default LoginPage;