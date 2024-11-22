import React from "react";
import { Navbar, Typography, IconButton } from "@material-tailwind/react";
import { Bars2Icon } from "@heroicons/react/24/solid";
import { Button, Input } from "@material-tailwind/react";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Icon from "../assets/Icon";
import { adminLogin } from "../apis/userApi";
import { useNavigate } from "react-router-dom";
import { Toast } from "../configs/SweetAlert2";

const AdminNavbar = () => {
  const [isNavOpen, setIsNavOpen] = React.useState(false);

  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setIsNavOpen(false)
    );
  }, []);

  return (
    <Navbar className="mx-auto max-w-screen-3xl rounded-none px-4 py-2 sticky top-0 z-50">
      <div className="relative mx-auto flex items-center justify-between text-blue-gray-900">
        <Typography variant="h3" className="ms-5" color="blue-gray">
          <span className="text-[#FF333A]">Mindx</span> Restaurant Management
        </Typography>
        <IconButton
          size="sm"
          color="blue-gray"
          variant="text"
          onClick={toggleIsNavOpen}
          className="ml-auto mr-2 lg:hidden"
        >
          <Bars2Icon className="h-6 w-6" />
        </IconButton>
        {/* <Avatar
          variant="circular"
          size="sm"
          alt="tania andrew"
          className="border border-gray-900 p-0.5"
          src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
        /> */}
      </div>
    </Navbar>
  );
};

const LoginAdmin = () => {
  const [username, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUserName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const login = async (username, password) => {
    try {
      const data = {
        username: username,
        password: password,
      };
      const result = await adminLogin(data);

      Toast.fire({
        icon: "success",
        title: "Login successfully",
      }).then(() => {
        localStorage.setItem("user", username);
        localStorage.setItem("id", result.data.user_id);
        localStorage.setItem("token", result.data.token);
        const token = localStorage.getItem("token");
        console.log("Token from localStorage:", token);  // Kiểm tra xem token có tồn tại không
        navigate(result.data.redirect_url);
      });
    } catch (error) {
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
      <AdminNavbar />
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
              {/* <div className="mb-5 text-right">
                <div className="h-5">
                  <a href="#" className="text-right">
                    Quên mật khẩu
                  </a>
                </div>
              </div> */}
              <Button
                color="indigo"
                className="w-full mb-5"
                onClick={() => login(username, password)}
              >
                Đăng nhập
              </Button>
            </form>
            {/* <div className="max-w-sm mx-auto">
              <Divider className="mt-5 ">
                <Chip label="OR" size="small" />
              </Divider>
            </div> */}
            <div className="max-w-sm mx-auto mt-5">
              {/* <Button
                onClick={() => {
                  navigate("/register");
                }}
                color="indigo"
                className="w-full mb-5"
              >
                Đăng ký
              </Button> */}
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
};

export default LoginAdmin;
