import React from "react";
import { Button, Input } from "@material-tailwind/react";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import { registerUser } from "../apis/userApi";
import { Toast } from "../configs/SweetAlert2";
import { useNavigate } from "react-router-dom";
function Registerpage() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [firstname, setFirstname] = React.useState("");
  const [lastname, setLastname] = React.useState("");
  const [email, setEmail] = React.useState("");
  const navigate = useNavigate();
  const register = async (
    username,
    password,
    phoneNumber,
    confirmPassword,
    firstname,
    lastname,
    email
  ) => {
    try {
      if (password !== confirmPassword) {
        Toast.fire({
          icon: "error",
          title: "Password and confirm password are not the same",
        });
        return;
      }
      const data = {
        username: username,
        password: password,
        phone: phoneNumber,
        email: email,
        name: `${lastname} ${firstname}`,
      };
      const result = await registerUser(data);

      Toast.fire({
        icon: "success",
        title: "Register successfully",
      }).then(() => {
        navigate("/login");
      });
    } catch (error) {
      if (error.response.data.username) {
        Toast.fire({
          icon: "error",
          title: error.response.data.username,
        });
      } else if (error.response.data.password) {
        Toast.fire({
          icon: "error",
          title: error.response.data.password,
        });
      } else if (error.response.data.phoneNumber) {
        Toast.fire({
          icon: "error",
          title: error.response.data.phoneNumber,
        });
      } else if (error.response.data.emailAddress) {
        Toast.fire({
          icon: "error",
          title: error.response.data.emailAddress,
        });
      } else if (error.response.data.firstName) {
        Toast.fire({
          icon: "error",
          title: error.response.data.firstName,
        });
      } else if (error.response.data.lastName) {
        Toast.fire({
          icon: "error",
          title: error.response.data.lastName,
        });
      } else {
        Toast.fire({
          icon: "error",
          title: "Đăng ký thất bại",
        });
      }
    }
  };
  return (
    <div
      className="pt-10 h-[800px]"
      style={{
        backgroundImage:
          "url('https://giaiphapzalo.com/wp-content/uploads/2021/09/pagebg-1-1920x705.jpg')",
      }}
    >
      <Container
        maxWidth="md"
        className=" bg-white rounded-xl border p-5 border-gray-300 shadow-lg"
      >
        <h1 className="text-center text-6xl mb-5">
          <span className="text-[#FF333A]">TableHive H&N</span> Restaurant
        </h1>
        <Divider>
          <h3 className="text-center text-xl">Đăng ký</h3>
        </Divider>
        <div className="grid lg:grid-cols-2 sm:grid-cols-1 mt-5">
          <div className="w-100 mx-5 my-5">
            <div className="grid grid-cols-2">
              <Input
                size="md"
                variant="standard"
                label="Họ"
                placeholder="Nguyễn"
                onChange={(e) => setLastname(e.target.value)}
                value={lastname}
              />

              <Input
                variant="standard"
                label="Tên"
                placeholder="A"
                onChange={(e) => setFirstname(e.target.value)}
                value={firstname}
              />
            </div>
          </div>
          <div className="w-100 mx-5 my-5">
            <Input
              variant="standard"
              label="Username"
              placeholder="nguyenvana"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
          </div>
          <div className="w-100 mx-5 my-5">
            <Input
              variant="standard"
              label="Email"
              placeholder="nguyenvana@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className="w-100 my-5 mx-5">
            <Input
              variant="standard"
              label="Số điện thoại"
              placeholder="0912345678"
              onChange={(e) => setPhoneNumber(e.target.value)}
              value={phoneNumber}
            />
          </div>
          <div className="w-100 my-5 mx-5">
            <Input
              variant="standard"
              label="Mật khẩu"
              placeholder=".............."
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>

          <div className="w-100 my-5 mx-5">
            <Input
              variant="standard"
              label="Nhắc lại mật khẩu"
              placeholder=".............."
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
            />
          </div>

          <div className="w-100 my-5 mx-5">
            <Button
              disabled={
                username === "" &&
                password === "" &&
                phoneNumber === "" &&
                confirmPassword === "" &&
                firstname === "" &&
                lastname === "" &&
                email === ""
              }
              onClick={() => {
                setPassword("");
                setUsername("");
                setPhoneNumber("");
                setConfirmPassword("");
                setFirstname("");
                setLastname("");
                setEmail("");
              }}
              color="red"
              className="w-full"
            >
              Hủy
            </Button>
          </div>
          <div className="w-100 my-5 mx-5">
            <Button
              disabled={
                username === "" ||
                password === "" ||
                phoneNumber === "" ||
                confirmPassword === "" ||
                firstname === "" ||
                lastname === "" ||
                email === ""
              }
              onClick={() => {
                register(
                  username,
                  password,
                  phoneNumber,
                  confirmPassword,
                  firstname,
                  lastname,
                  email
                );
              }}
              color="indigo"
              className="w-full"
            >
              Đăng ký
            </Button>
          </div>
        </div>
        <Divider className="mt-5 ">
          <Chip label="OR" size="small" />
        </Divider>
        <div className="grid lg:grid-cols-2 sm:grid-cols-1">
          <div className="w-100 my-5 mx-5">
            <Button
              onClick={() => {
                window.location.href = "/login";
              }}
              color="indigo"
              className="w-full"
            >
              Đã có tài khoản
            </Button>
          </div>
          <div className="w-100 my-5 mx-5">
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
      </Container>
    </div>
  );
}

export default Registerpage;
