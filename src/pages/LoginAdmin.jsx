import React from "react";
import { Navbar, Typography, IconButton } from "@material-tailwind/react";
import { Bars2Icon } from "@heroicons/react/24/solid";
import { Button, Input } from "@material-tailwind/react";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Icon from "../assets/Icon";
import { adminLogin, useGetUserByIdQuery, useLazyGetUserByIdQuery } from "../apis/userApi";
import { useNavigate } from "react-router-dom";
import { Toast } from "../configs/SweetAlert2";
import { useGetEmployeeByIdQuery, useLazyGetEmployeeByIdQuery } from "../apis/employeeApi";

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
          <span className="text-[#FF333A]">TableHive H&N</span> Restaurant Management
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
  
  // Create lazy version of the employee query
  const [trigger] = useLazyGetEmployeeByIdQuery();
  const [loginTrigger] = useLazyGetUserByIdQuery();

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
        password: password,
      };
      
      // First perform login
      const result = await adminLogin(data);
      
      if (result?.data?.token) {
        // Store token first
        localStorage.setItem("user", username);
        localStorage.setItem("token", result.data.token);

        try {
          // Check role of the user (admin or staff)
          const userRole = result.data.redirect_url; // Assuming role is returned in the login response
          
          if (userRole === '/dashboard') {
            const { data: userData } = await loginTrigger(undefined, { 
              preferCacheValue: false // Force a new request
            });
            console.log('first',userData)
            if (userData?.data?._id) {
              localStorage.setItem("userId", userData.data._id);}
            navigate(result.data.redirect_url); 
            
          } else if (userRole === '/staff') {
            // If staff, fetch employee data
            const { data: employeeData } = await trigger(undefined, {
              preferCacheValue: false // Force a new request
            });
            
            if (employeeData?.data?.restaurant_id) {
              localStorage.setItem("restaurant_id", employeeData.data.restaurant_id);
              
              await Toast.fire({
                icon: "success",
                title: "Login successfully",
              });
              
              // Navigate to the redirect URL for staff
              navigate(result.data.redirect_url);
            } else {
              throw new Error("Employee data not found");
            }
          } else {
            throw new Error("Invalid user role");
          }
        } catch (employeeError) {
          console.error("Error fetching employee data:", employeeError);
          Toast.fire({
            icon: "error",
            title: "Error fetching employee data",
          });
          // Clean up stored data on error
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
    <>
      <AdminNavbar />
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
              <Button
                color="indigo"
                className="w-full mb-5"
                onClick={() => handleLogin(username, password)}
              >
                Đăng nhập
              </Button>
            </form>
            <div className="max-w-sm mx-auto mt-5">
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

