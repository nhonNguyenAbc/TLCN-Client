import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
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
      {/* Hiển thị ảnh nếu có */}
      {image_url && (
        <CardHeader color="blue-gray" className="relative h-40">
          <img src={image_url} alt="card-image" className="object-cover w-full h-full" />
        </CardHeader>
      )}

      <CardBody className="mx-auto h-fit">
        {/* Hiển thị tên nhà hàng nếu có */}
        {name && (
          <Typography
            variant="h6"
            className="text-center xl:h-[55px] 2xl:h-[60px] my-auto"
          >
            {name}
          </Typography>
        )}

        {/* Hiển thị địa chỉ nếu có */}
        {address && (
          <div className="w-full pt-0 h-[70px]">
            <Typography variant="paragraph" color="blue-gray" className="text-center">
              {address?.detail && `${address.detail}, `}
              {address?.district && (["1", "3", "4", "5", "6", "7", "8", "10", "11", "12"].includes(address.district) ? `Q.${address.district}` : address.district)}
              {address?.province && `, ${address.province}`}
            </Typography>
          </div>
        )}

        {/* Hiển thị rating nếu có */}
        {rating !== undefined && rating !== null && (
          <div className="flex justify-center mb-2">
            <StarRatings
              rating={rating} // Giá trị rating (nếu = 0 vẫn hiển thị 5 sao trống)
              starRatedColor="#FFCC00" // Màu sao đầy
              starEmptyColor="#ddd" // Màu sao trống
              starDimension="24px" // Kích thước sao
              starSpacing="4px" // Khoảng cách giữa các sao
              numberOfStars={5} // Tổng số sao
              name="rating"
            />
          </div>
        )}

        {/* Hiển thị thời gian mở cửa - đóng cửa nếu có */}
        {(openTime && closeTime) && (
          <Typography color="blue-gray" variant="h6" className="text-center">
            {openTime} - {closeTime}
          </Typography>
        )}

        {/* Hiển thị giá nếu có */}
        {price_per_table && (
          <div className="w-full pt-0 ">
            <Typography color="blue-gray" className="text-center">
              <span className="text-xl font-bold text-[#FF333A]">
                {Number(price_per_table).toLocaleString("en-US") + " đ"}
              </span>{" "}
              /người
            </Typography>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

// ✅ Cập nhật propTypes để không bắt buộc truyền vào
ProductCard.propTypes = {
  _id: PropTypes.string.isRequired,
  name: PropTypes.string,
  address: PropTypes.object,
  openTime: PropTypes.string,
  closeTime: PropTypes.string,
  rating: PropTypes.number, // Có thể là 0, không bắt buộc truyền
  image_url: PropTypes.string,
  price_per_table: PropTypes.number,
};

export default ProductCard;
