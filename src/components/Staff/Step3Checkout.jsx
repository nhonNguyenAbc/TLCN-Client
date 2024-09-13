import { useState } from "react";
import PropTypes from "prop-types";
import Notificationpage from "./Notificationpage";
import { fail_checkout, success_checkout } from "../../constants/notification";
const Step3Checkout = ({ handleOpen }) => {
  const [check, setCheck] = useState(true);
  if (localStorage.getItem("total")) localStorage.removeItem("total");
  if (localStorage.getItem("order")) localStorage.removeItem("order");
  return (
    <Notificationpage
      handleOpen={handleOpen}
      noti={check ? success_checkout : fail_checkout}
    />
  );
};
Step3Checkout.propTypes = {
  handleOpen: PropTypes.func.isRequired,
};
export default Step3Checkout;
