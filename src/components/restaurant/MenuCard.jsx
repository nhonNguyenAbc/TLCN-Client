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

const MenuCard = ({ _id, rating, image, name, restaurant_id }) => {
  const navigate = useNavigate();

  return (
    <Card
      className="cursor-pointer w-full bg-white rounded-2xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl flex flex-col"
      onClick={() => navigate("/restaurant/" + _id)}
    >
      <CardHeader
        shadow={false}
        floated={false}
        className="relative h-48 overflow-hidden rounded-t-2xl">
        <img
          src={image?.url}
          alt={name}
          className="object-cover w-full h-full rounded-t-lg"
        />
      </CardHeader>

      <CardBody className="flex flex-col items-center justify-center px-4">
        <Typography variant="h6" className="text-center font-semibold line-clamp-1">
          {name}
        </Typography>
        <Typography
          color="blue-gray"
          className="text-sm text-center text-gray-600 mt-1 line-clamp-1"
        >
          {restaurant_id?.name}
        </Typography>
      </CardBody>

      {/* <CardFooter className="flex items-center justify-center pt-0 pb-4">
        <Rating value={rating} precision={0.1} readOnly />
      </CardFooter> */}
    </Card>
  );
};

MenuCard.propTypes = {
  _id: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  image: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
  name: PropTypes.string.isRequired,
  restaurant: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default MenuCard;
