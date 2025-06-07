import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Rating from "@mui/material/Rating"
import { ClockIcon } from "@heroicons/react/24/solid";
const ProductCard = ({
  _id,
  name,
  address,
  openTime,
  closeTime,
  rating,
  image_url,
  price_per_table,
  height
}) => {
  const navigate = useNavigate();

  return (
    <Card
      className="cursor-pointer w-full bg-white rounded-2xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl flex flex-col"
      onClick={() => navigate("/restaurant/" + _id)}
    >
      {image_url && (
        <CardHeader
          shadow={false}
          floated={false}
          className="relative h-48 overflow-hidden rounded-t-2xl"
        >
          <img
            src={image_url}
            alt="restaurant"
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/10 hover:bg-black/20 transition-colors duration-300"></div>
        </CardHeader>
      )}

      <CardBody className="px-4 py-3 flex-grow">
        {/* Tên nhà hàng */}
        {name && (
          <Typography
            variant="h6"
            className="text-center font-bold text-lg mb-1 line-clamp-1"
          >
            {name}
          </Typography>
        )}

        {/* Địa chỉ */}
        {address && (
          <Typography
            variant="paragraph"
            className="text-center text-sm text-gray-600 mb-2 line-clamp-1"
          >
            {address?.detail && `${address.detail}, `}
            {address?.district &&
              (["1", "3", "4", "5", "6", "7", "8", "10", "11", "12"].includes(address.district)
                ? `Q.${address.district}`
                : address.district)}
            {address?.province && `, ${address.province}`}
          </Typography>
        )}

        {/* Đánh giá sao */}
        {rating !== undefined && rating !== null && (
          <div className="flex justify-center mb-2">
            <Rating
              value={Number(rating)}
              precision={0.1}
              readOnly
              size="medium"
            />
          </div>
        )}

        {/* Giờ mở cửa */}
        {openTime && closeTime && (
          <Typography className="flex items-center justify-center gap-1 text-sm text-gray-800 mb-2">
            <ClockIcon className="h-4 w-4 text-gray-600" />
            {openTime} - {closeTime}
          </Typography>
        )}

        {/* Giá */}
        {price_per_table && (
          <div className="text-center">
            <Typography className="text-[#FF333A] font-semibold text-lg">
              {Number(price_per_table).toLocaleString("en-US") + " đ"}
              <span className="text-sm text-gray-700 font-normal"> /người</span>
            </Typography>
          </div>
        )}
      </CardBody>
    </Card>

  );
};

ProductCard.propTypes = {
  _id: PropTypes.string.isRequired,
  name: PropTypes.string,
  address: PropTypes.object,
  openTime: PropTypes.string,
  closeTime: PropTypes.string,
  rating: PropTypes.number,
  image_url: PropTypes.string,
  price_per_table: PropTypes.number,
};

export default ProductCard;
