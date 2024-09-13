import { Typography, Card, CardBody } from "@material-tailwind/react";

import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import PropTypes from "prop-types";

const KpiCard = ({ title, price }) => {
  KpiCard.propTypes = {
    title: PropTypes.string.isRequired,
    // percentage: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    // color: PropTypes.string.isRequired,
    // icon: PropTypes.element.isRequired,
  };
  return (
    <Card className="shadow-sm border border-gray-200 !rounded-lg">
      <CardBody className="p-4">
        <div className="flex justify-between items-center">
          <Typography className="!font-medium !text-xs text-gray-600">
            {title}
          </Typography>
          {/* <div className="flex items-center gap-1">
            {icon}
            <Typography color={color} className="font-medium !text-xs">
              {percentage}
            </Typography>
          </div> */}
        </div>
        <Typography color="blue-gray" className="mt-1 font-bold text-2xl">
          {price}
        </Typography>
      </CardBody>
    </Card>
  );
};
const formatMoney = (money) => {
  let countNumber = String(money).split("").length;
  if (countNumber <= 9) return money.toLocaleString() + " đ";
  return `${(money / 1000000000).toFixed(1)} Tỷ VNĐ`;
};
const income = [
  {
    title: "Doanh thu",
    percentage: "12%",
    price: formatMoney(10000000),
    color: "red",
    icon: <ChevronDownIcon strokeWidth={4} className="w-3 h-3 text-red-500" />,
  },
  {
    title: "Số đơn đặt bàn thành công",
    percentage: "10%",
    price: "19,720",
    color: "green",
    icon: <ChevronUpIcon strokeWidth={4} className="w-3 h-3 text-green-500" />,
  },
  // {
  //   title: "Tháng doanh thu cao nhất",
  //   price: "12",
  // },
];
const restaurant = [
  {
    title: "Tổng số nhà hàng",
    percentage: "12%",
    price: formatMoney(10000000),
    color: "red",
    icon: <ChevronDownIcon strokeWidth={4} className="w-3 h-3 text-red-500" />,
  },
  {
    title: "Đông nhất",
    percentage: "16%",
    price: "10,342",
    color: "green",
    icon: <ChevronUpIcon strokeWidth={4} className="w-3 h-3 text-green-500" />,
  },
  // {
  //   title: "Được yêu thích nhất",
  //   percentage: "10%",
  //   price: "19,720",
  //   color: "green",
  //   icon: <ChevronUpIcon strokeWidth={4} className="w-3 h-3 text-green-500" />,
  // },
];
const order = [
  {
    title: "Tổng số món ăn",
    percentage: "12%",
    price: formatMoney(10000000),
    color: "red",
    icon: <ChevronDownIcon strokeWidth={4} className="w-3 h-3 text-red-500" />,
  },
  // {
  //   title: "Bán nhiều nhất",
  //   percentage: "16%",
  //   price: "10,342",
  //   color: "green",
  //   icon: <ChevronUpIcon strokeWidth={4} className="w-3 h-3 text-green-500" />,
  // },
  // {
  //   title: "Doanh thu cao nhất",
  //   percentage: "10%",
  //   price: "19,720",
  //   color: "green",
  //   icon: <ChevronUpIcon strokeWidth={4} className="w-3 h-3 text-green-500" />,
  // },
];
const KpiReport = ({ tab }) => {
  return (
    <section className="container mx-auto py-5 px-8">
      <div className="mt-6 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 items-center md:gap-2.5 gap-4">
        {tab === "doanh thu" &&
          income.map((props, key) => <KpiCard key={key} {...props} />)}
        {tab === "nhà hàng" &&
          restaurant.map((props, key) => <KpiCard key={key} {...props} />)}
        {tab === "món ăn" &&
          order.map((props, key) => <KpiCard key={key} {...props} />)}
      </div>
    </section>
  );
};
KpiReport.propTypes = {
  tab: PropTypes.string.isRequired,
};
export default KpiReport;
