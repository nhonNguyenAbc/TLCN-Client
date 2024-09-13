import PropTypes from "prop-types"; // Import PropTypes
import { Typography, Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const Notification = ({ noti }) => {
  const navigate = useNavigate();
  return (
    <div className="my-10 mx-auto grid place-items-center text-center px-8">
      <div>
        {noti.icon}
        <Typography
          variant="h1"
          color="blue-gray"
          className="mt-10 !text-3xl !leading-snug md:!text-4xl"
        >
          {noti.name} <br /> {noti.message}
        </Typography>
        <Typography className="mt-8 mb-14 text-[18px] font-normal text-gray-500 mx-auto md:max-w-sm">
          {noti.subtitile}
        </Typography>
        <Button
          color="gray"
          className="w-full px-4 md:w-[8rem]"
          onClick={() => navigate("/")}
        >
          về trang chủ
        </Button>
      </div>
    </div>
  );
};
Notification.propTypes = {
  noti: PropTypes.shape({
    icon: PropTypes.element.isRequired,
    name: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    subtitile: PropTypes.string.isRequired,
  }).isRequired,
};

export default Notification;
