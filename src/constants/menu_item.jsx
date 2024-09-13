import {
  UserCircleIcon,
  InboxArrowDownIcon,
  LifebuoyIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
const account_menu = [
  {
    label: "Trang cá nhân",
    icon: UserCircleIcon,
    link: "/profile",
  },
  {
    label: "Tin nhắn",
    icon: InboxArrowDownIcon,
    link: "/inbox",
  },
  {
    label: "FAQs",
    icon: LifebuoyIcon,
    link: "/help-center",
  },
  {
    label: "Đăng xuất",
    icon: PowerIcon,
  },
];

const footer_menu = [
  {
    title: "Sản phẩm",
    items: [
      {
        label: "Trang chủ",
        link: "/",
      },
      {
        label: "Sản phẩm",
        link: "/product",
      },
      {
        label: "Thương hiệu",
        link: "/brand",
      },
      {
        label: "Danh mục",
        link: "/category",
      },
      {
        label: "Giỏ hàng",
        link: "/cart",
      },
      {
        label: "Thanh toán",
        link: "/checkout",
      },
    ],
  },
  {
    title: "Công ty",
    items: [
      {
        label: "Về chúng tôi",
        link: "/about-us",
      },
      {
        label: "Liên hệ",
        link: "/contact",
      },
      {
        label: "Tuyển dụng",
        link: "/career",
      },
      {
        label: "Điều khoản",
        link: "/terms",
      },
      {
        label: "Chính sách",
        link: "/policy",
      },
      {
        label: "FAQs",
        link: "/faqs",
      },
    ],
  },
  {
    title: "Chăm sóc khách hàng",
    items: [
      {
        label: "Liên hệ",
        link: "/contact",
      },
      {
        label: "Hướng dẫn đạt hàng",
        link: "/terms",
      },
      {
        label: "Phương thức vận chuyển",
        link: "/policy",
      },
      {
        label: "FAQs",
        link: "/faqs",
      },
    ],
  },
];
const report_items = ["doanh thu", "nhà hàng", "món ăn"];
export { account_menu, footer_menu, report_items };
