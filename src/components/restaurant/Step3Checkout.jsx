import { useState } from "react";
import { fail_checkout, success_checkout } from "../../constants/notification";
import Notificationpage from "../shared/Notification";
import { useLocation } from "react-router-dom";
import { useConfirmOrderQuery } from "../../apis/orderApi";
const Step3Checkout = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status");
  const orderCode = queryParams.get("orderCode");
  const { data: order, error, isLoading } = useConfirmOrderQuery(orderCode);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <Notificationpage
      noti={status === "PAID" ? success_checkout : fail_checkout}
    />
  );
};

export default Step3Checkout;
