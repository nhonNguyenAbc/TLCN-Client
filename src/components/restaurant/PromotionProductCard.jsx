import {
    Card,
    CardHeader,
    CardBody,
    Typography,
  } from "@material-tailwind/react";
  import { useNavigate } from "react-router-dom";
  import PropTypes from "prop-types";
  import { Rating } from "@mui/material";
  
  const PromotionProductCard = ({
    _id,
    name,
    address,
    openTime,
    closeTime,
    description,
    promotionDetails,
    image_url,
    price_per_table,
  }) => {
    const navigate = useNavigate();
    return (
      <Card
        className="cursor-pointer w-full relative mt-6" // Thêm relative để có thể dùng absolute bên trong
        onClick={() => navigate("/restaurant/" + _id)}
      >
        <CardHeader color="blue-gray" className="relative h-40">
          <img src={image_url} alt="card-image" className="object-cover h-full w-full" />
          <div className="absolute bottom-0 left-0 w-full h-2/7 bg-white bg-opacity-75 flex items-center justify-center">
          <Typography variant="small" className="font-bold text-red-500 text-center">
            <p>{promotionDetails.name}</p>
            <p>Chương trình áp dụng đến hết {new Date(promotionDetails.endDate).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })}</p>
            </Typography>
        </div>
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
              variant="small"
              color="blue-gray"
              className="text-center"
            >
              {address}
            </Typography>
          </div>
          <Typography color="blue-gray" variant="h6" className="text-center">
            {openTime} - {closeTime}
          </Typography>
          <div className="w-full pt-0">
            <Typography color="blue-gray" className="text-center">
              <span className="text-xl font-bold text-[#FF333A]">
                {Number(price_per_table).toLocaleString("en-US") + " đ"}
              </span>{" "}
              /người
            </Typography>
          </div>
        </CardBody>
      </Card>
    );
  };
  
  PromotionProductCard.propTypes = {
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    openTime: PropTypes.string.isRequired,
    closeTime: PropTypes.string.isRequired,
    image_url: PropTypes.string.isRequired,
    price_per_table: PropTypes.number.isRequired,
  };

  export default PromotionProductCard;
