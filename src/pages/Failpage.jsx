import { fail_checkout, not_found } from "../constants/notification";
import Notificationpage from "../components/shared/Notification";

const Failcheckoutpage = () => {
  return <Notificationpage noti={fail_checkout} />;
};

export default Failcheckoutpage;
