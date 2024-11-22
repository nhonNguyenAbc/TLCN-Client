import {
  PresentationChartBarIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";
import Restaurant from "../components/admin/Restaurant";
import Analytic from "../components/admin/Analytic";
import Report from "../components/admin/Report";
import History from "../components/admin/History";
import Employee from "../components/admin/Employee";
import Menu from "../components/admin/Menu";
import Order from "../components/admin/Order";
import Checkin from "../components/Staff/Checkin";
import CheckOrder from "../components/Staff/CheckOrder";
import Table from "../components/admin/Table";
import Checkout from "../components/Staff/Checkout";
import Promotion from "../components/admin/Promotion";
import Video from "../components/admin/Video";
const admin_sidebar = [
  {
    title: {
      label: "Tổng quan",
      icon: <PresentationChartBarIcon className="h-5 w-5" />,
    },
    sublist: [
      { label: "Thống kê", elements: <Analytic /> },
      { label: "Báo cáo", elements: <Report /> },
      { label: "Lịch sử", elements: <History /> },
    ],
  },
  {
    title: {
      label: "Quản lý",
      icon: <Cog6ToothIcon className="h-5 w-5" />,
    },
    sublist: [
      { label: "Nhà hàng", elements: <Restaurant /> },
      { label: "Nhân viên", elements: <Employee /> },
      { label: "Thực đơn", elements: <Menu /> },
      {
        label: "Đơn hàng",
        elements: <Order />,
      },
      {
        label: "Khuyến mãi",
        elements: <Promotion />,
      },
      {
        label: "Video",
        elements: <Video />,
      },
    ],
  },
];
const staff_sidebar = [
  {
    title: null,
    sublist: [{ label: "Checkin", elements: <Checkin /> }],
  },
  {
    title: null,
    sublist: [{ label: "Checkout", elements: <Checkout /> }],
  },
  {
    title: null,
    sublist: [
      {
        label: "Đơn hàng",
        elements: <CheckOrder />,
      },
    ],
  },
];
export { admin_sidebar, staff_sidebar };
