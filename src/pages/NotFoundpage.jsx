import { not_found } from "../constants/notification";
import Notificationpage from "../components/shared/Notification";

const NotFoundpage = () => {
  return <Notificationpage noti={not_found} />;
};

export default NotFoundpage;
