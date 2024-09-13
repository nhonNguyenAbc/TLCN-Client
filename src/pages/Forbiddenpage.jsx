import { forbidden } from "../constants/notification";
import Notificationpage from "../components/shared/Notification";

const Forbiddenpage = () => {
  return <Notificationpage noti={forbidden} />;
};

export default Forbiddenpage;
