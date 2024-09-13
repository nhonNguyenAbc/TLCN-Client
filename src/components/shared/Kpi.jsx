import { Typography, Card, CardBody } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";

// import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import PropTypes from "prop-types";
import {
  useTotalRevenueOrderQuery,
  useCountOrderQuery,
  useCountCompletedOrdersQuery,
  useCountOrdersByStatusQuery,
} from "../../apis/orderApi";
const KpiCard = ({ title, price }) => {
  KpiCard.propTypes = {
    title: PropTypes.string.isRequired,
    // percentage: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    // color: PropTypes.string.isRequired,
    // icon: PropTypes.element.isRequired,
  };
  return (
    <Card className="shadow-sm border border-gray-200 !rounded-lg mb-7">
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
// const data = [
//   {
//     title: "Tổng doanh thu",
//     // percentage: "12%",
//     price: formatMoney(0),
//     // color: "red",
//     // icon: <ChevronDownIcon strokeWidth={4} className="w-3 h-3 text-red-500" />,
//   },
//   {
//     title: "Tổng số đơn hàng",
//     // percentage: "16%",
//     price: formatMoney(10342),
//     // color: "green",
//     // icon: <ChevronUpIcon strokeWidth={4} className="w-3 h-3 text-green-500" />,
//   },
//   {
//     title: "Số đơn đặt bàn thành công",
//     // percentage: "10%",
//     price: formatMoney(19720),
//     // color: "green",
//     // icon: <ChevronUpIcon strokeWidth={4} className="w-3 h-3 text-green-500" />,
//   },
//   {
//     title: "Số người dùng",
//     // percentage: "10%",
//     price: formatMoney(20000),
//     // color: "red",
//     // icon: <ChevronDownIcon strokeWidth={4} className="w-3 h-3 text-red-500" />,
//   },
//   {
//     title: "Số bàn đã đặt trước",
//     // percentage: "10%",
//     price: formatMoney(120000),
//     // color: "red",
//     // icon: <ChevronDownIcon strokeWidth={4} className="w-3 h-3 text-red-500" />,
//   },
// ];

const Kpi = () => {
  const [data, setData] = useState([
    { title: "Tổng doanh thu", price: formatMoney(0) },
    { title: "Tổng số đơn hàng", price: "0" },
    { title: "Số đơn đặt bàn thành công", price: "0" },
    // { title: "Số người dùng", price: formatMoney(20000) },
    { title: "Số đơn đã đặt trước", price: "0" },
  ]);
  const { data: totalRevenueData, isSuccess: isTotalRevenueSuccess } =
    useTotalRevenueOrderQuery();
  const { data: totalOrdersData, isSuccess: isTotalOrdersSuccess } =
    useCountOrderQuery();
  const { data: completedOrdersData, isSuccess: isCompletedOrdersSuccess } =
    useCountCompletedOrdersQuery();
  const { data: countOrdersByStatus, isSuccess: isCountOrdersByStatusSuccess } =
    useCountOrdersByStatusQuery();
  useEffect(() => {
    if (isTotalRevenueSuccess && totalRevenueData) {
      setData((prevData) =>
        prevData.map((item) =>
          item.title === "Tổng doanh thu"
            ? { ...item, price: formatMoney(totalRevenueData.data) }
            : item
        )
      );
    }

    if (isTotalOrdersSuccess && totalOrdersData) {
      setData((prevData) =>
        prevData.map((item) =>
          item.title === "Tổng số đơn hàng"
            ? { ...item, price: totalOrdersData.data + " đơn" }
            : item
        )
      );
    }

    if (isCompletedOrdersSuccess && completedOrdersData) {
      setData((prevData) =>
        prevData.map((item) =>
          item.title === "Số đơn đặt bàn thành công"
            ? { ...item, price: completedOrdersData.data + " đơn" }
            : item
        )
      );
    }

    if (isCountOrdersByStatusSuccess && countOrdersByStatus) {
      setData((prevData) =>
        prevData.map((item) =>
          item.title === "Số đơn đã đặt trước"
            ? { ...item, price: countOrdersByStatus.data + " đơn" }
            : item
        )
      );
    }
  }, [
    isTotalRevenueSuccess,
    totalRevenueData,
    isTotalOrdersSuccess,
    totalOrdersData,
    isCompletedOrdersSuccess,
    completedOrdersData,
    isCountOrdersByStatusSuccess,
    countOrdersByStatus,
  ]);

  return (
    <section className="container mx-auto py-5 pe-6">
      <div className="flex justify-between md:items-center"></div>
      <div className="flex flex-col">
        {data.map((props, key) => (
          <KpiCard key={key} {...props} />
        ))}
      </div>
    </section>
  );
};

export default Kpi;
