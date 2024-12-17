import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Rating } from "@mui/material";
import StarRatings from "react-star-ratings";
const ProductCard = ({
  _id,
  name,
  address,
  openTime,
  closeTime,
  rating,
  image_url,
  price_per_table,
}) => {
  const navigate = useNavigate();
  return (
    <Card
      className="cursor-pointer w-full"
      onClick={() => navigate("/restaurant/" + _id)}
    >
      <CardHeader color="blue-gray" className="relative h-40">
        <img src={image_url} alt="card-image" className="object-cover" />
      </CardHeader>
      <CardBody className="mx-auto h-fit">
        <Typography
          variant="h6"
          className="text-center xl:h-[55px] 2xl:h-[60px] my-auto"
        >
          {name}
        </Typography>

        <div className="w-full pt-0 h-[70px]">
  <Typography
    variant="paragraph"
    color="blue-gray"
    className="text-center"
  >
    {address.detail}, 
    {" "}
    {["1", "3", "4", "5", "6", "7", "8", "10", "11", "12"].includes(address.district) ? `Q.${address.district}` : address.district}, 
    {" "}
    {address.province}
  </Typography>
</div>
        <div className="flex justify-center mb-2">
        {/* Hiển thị sao bằng react-star-ratings */}
        <StarRatings
          rating={rating} // Giá trị rating
          starRatedColor="#FFCC00" // Màu sao
          starEmptyColor="#ddd" // Màu sao trống
          starDimension="24px" // Kích thước sao
          starSpacing="4px" // Khoảng cách giữa các sao
          numberOfStars={5} // Tổng số sao
          name="rating"
        />
      </div>
        <Typography color="blue-gray" variant="h6" className=" text-center">
          {openTime} - {closeTime}
        </Typography>
        <div className="w-full pt-0 ">
          <Typography color="blue-gray" className="text-center">
            <span className="text-xl font-bold text-[#FF333A]">
              {Number(price_per_table).toLocaleString("en-US") + " đ"}
            </span>{" "}
            /người
          </Typography>
        </div>
       
        {/* <Typography color="black" variant="h4" className="text-center">
          {Number(price / peopleAmount).toLocaleString("en-US")} đ
        </Typography> */}
      </CardBody>
    </Card>
  );
};

ProductCard.propTypes = {
  _id: PropTypes.string.isRequired,
  restaurant: PropTypes.object.isRequired,
  price: PropTypes.number.isRequired,
  peopleAmount: PropTypes.number.isRequired,
};
export default ProductCard;
