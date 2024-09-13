
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
const ProductCard = ({ id, rating, imageUrl, name, distance }) => {
  const navigate = useNavigate();
  return (
    <Card
      className="mt-6 cursor-pointer"
      onClick={() => navigate("/restaurant/" + id)}
    >
      <CardHeader color="blue-gray" className="relative h-56">
        <img src={imageUrl} alt="card-image" />
      </CardHeader>
      <CardBody className="mx-auto">
        <Typography variant="h5">{name}</Typography>
        <Typography color="blue-gray" className=" text-center">
          {distance} từ vị trí của bạn
        </Typography>
      </CardBody>
      <CardFooter className="w-full pt-0 flex items-center justify-around gap-5">
        <Rating value={rating} color="yellow" readonly />
      </CardFooter>
    </Card>
  );
};

ProductCard.propTypes = {
  id: PropTypes.number.isRequired,
  rating: PropTypes.number.isRequired,
  imageUrl: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  distance: PropTypes.number.isRequired,
};
export default ProductCard;
