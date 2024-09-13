import { not_found, success_checkout } from "../constants/notification";
import Notificationpage from "../components/shared/Notification";

const Successpage = () => {
  return <Notificationpage noti={success_checkout} />;
};

export default Successpage;
