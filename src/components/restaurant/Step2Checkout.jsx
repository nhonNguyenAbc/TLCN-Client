import {
  Button,
  Card,
  CardBody,
  CardFooter,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Divider } from "@mui/material";
import PropTypes from "prop-types";
const Step2Checkout = ({ handleNext, handlePrev }) => {
  return (
    <div className="grid grid-cols-3 mb-1">
      <Card className="mt-6 col-span-2">
        <CardBody>
          <div className="flex items-center my-auto mb-2">
            <IconButton
              variant="outlined"
              className="border-none"
              onClick={handlePrev}
            >
              <ArrowBackIcon color="black" />
            </IconButton>
            <Typography variant="h5" color="blue-gray" className="">
              Cổng thanh toán
            </Typography>
          </div>
          <img
            className=" w-5/12 object-cover object-center mx-auto mt-1"
            src="/public/qrcode.png"
            alt="QR code"
          />
        </CardBody>
      </Card>
      <Card className="mt-6">
        <CardBody>
          <div className="flex items-center justify-between">
            <Typography variant="h5" color="blue-gray" className="mb-2">
              Chi tiết đơn #MX2001
            </Typography>
            <Typography as="a" href="/cart" color="cyan">
              Sửa
            </Typography>
          </div>
          <Divider />
          <div className="flex items-center justify-between mt-4">
            <Typography className="" variant="body" color="blue-gray">
              1 x <span className="text-cyan-300 w-[100px] text-wrap">Bàn</span>
            </Typography>
            <div className="grid grid-cols-2 gap-8">
              <Typography className="line-through text-gray-400" variant="body">
                58000đ
              </Typography>
              <Typography variant="body" color="blue-gray">
                58000đ
              </Typography>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <Typography className="" variant="body" color="blue-gray">
              1 x{" "}
              <span className="text-cyan-300 w-[100px] text-wrap">Bò kho</span>
            </Typography>
            <div className="grid grid-cols-2 gap-8">
              <Typography className="line-through text-gray-400" variant="body">
                58000đ
              </Typography>
              <Typography variant="body" color="blue-gray">
                58000đ
              </Typography>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <Typography variant="body" color="blue-gray">
              Tạm tính
            </Typography>
            <Typography variant="body" color="blue-gray">
              2,000,000 đ
            </Typography>
          </div>
          <div className="flex justify-between items-center mt-2">
            <Typography variant="body" color="blue-gray">
              Giảm giá
            </Typography>
            <Typography variant="body" color="blue-gray">
              0 đ
            </Typography>
          </div>
          <div className="mt-5 mb-5">
            <Divider />
          </div>
          <div className="flex justify-between items-center mt-2">
            <Typography variant="h6" color="blue-gray">
              Tổng cộng
            </Typography>
            <Typography variant="h6" color="blue-gray">
              2,000,000 đ
            </Typography>
          </div>
          <div className="flex items-center justify-between mt-10">
            <Typography variant="h5" color="blue-gray">
              Người đặt bàn
            </Typography>
            <Typography color="cyan" onClick={handlePrev}>
              Thay đổi
            </Typography>
          </div>
          <div className="flex justify-around items-center mt-5">
            <Typography variant="body" color="blue-gray">
              Rạng thái
            </Typography>
            <Typography variant="body" color="blue-gray">
              0912345678
            </Typography>
            <Typography variant="body" color="blue-gray">
              rang@gmail.com
            </Typography>
          </div>
          <div className="flex justify-around items-center mt-5">
            <Typography variant="body" color="blue-gray">
              Nhận bàn lúc:
            </Typography>
            <Typography variant="body" color="blue-gray">
              12:00 PM 12/12/2021
            </Typography>
          </div>
        </CardBody>
        <CardFooter className="pt-0">
          <Button color="red" fullWidth onClick={handleNext}>
            Xác nhận
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
Step2Checkout.propTypes = {
  handleNext: PropTypes.func.isRequired,
  handlePrev: PropTypes.func.isRequired,
};
export default Step2Checkout;
