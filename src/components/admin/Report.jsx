import React, { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import "chart.js/auto";
import { Button, Card, CardBody, Menu, MenuHandler, MenuItem, MenuList, Typography } from "@material-tailwind/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Container } from "@mui/material";
import KpiReport from "./KpiReport";
import { report_items } from "../../constants/menu_item";
import { useGetTotalRevenueForYearQuery } from "../../apis/orderApi";

const Report = () => {
  const [tab, setTab] = useState("doanh thu");
  const [selectedYear, setSelectedYear] = useState("2024"); // State cho năm đã chọn

  // Gọi API với năm đã chọn
  const { data, isLoading, isError } = useGetTotalRevenueForYearQuery({ year: selectedYear });
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {isError.message}</div>;
  if (data && !Object.keys(data.data).length) {
    return <div>Không có dữ liệu để hiển thị.</div>;
  }
  // Xử lý dữ liệu để đưa vào biểu đồ
  const processChartData = () => {
    if (!data || isLoading || isError) return { lineData: {}, barData: {} };

    const labels = [
      "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
      "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ];

    const yearData = data.data.monthlyData || []; // Lấy dữ liệu doanh thu cho năm đã chọn
    const revenueData = yearData.map(item => item.revenue);  // Mảng chỉ chứa doanh thu của từng tháng
    const orderData = yearData.map(item => item.orders);  // Mảng chỉ chứa doanh thu của từng tháng

    const lineData = {
      labels,
      datasets: [{
        label: selectedYear,  // Hiển thị năm đã chọn
        data: revenueData,
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 1)",
      }]
    };

    const barData = {
      labels,
      datasets: [{
        label: selectedYear,
        data: orderData,
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 1)",
      }]
    };

    return { lineData, barData };
  };

  const { lineData, barData } = processChartData();

  const lineOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      title: {
        display: true,
        text: `Biểu đồ danh thu nhà hàng qua các tháng trong năm ${selectedYear}`,
        font: {
          size: 20,
        },
      },
    },
  };

  const barOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      title: {
        display: true,
        text: `Biểu đồ số lượng đơn hàng thành công trong năm ${selectedYear}`,
        font: {
          size: 20,
        },
      },
    },
  };

  const handleTab = (e) => setTab(e.target.value);
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i <= 5; i++) {
      years.push(currentYear - i); // Thêm các năm từ năm nay trở về 5 năm trước
    }
    return years;
  };
  const handleYearChange = (e) => {
    setSelectedYear(e.target.value); // Cập nhật năm khi chọn từ dropdown
  };

  return (
    <>
      <Container className="mt-5">
        <div className="flex justify-between my-auto">
          <Typography variant="h3" className="font-bold ">
            Báo cáo
          </Typography>
          <div className="flex items-center justify-between gap-4">
            <div className="shrink-0">
              <Menu>
                <MenuHandler>
                  <Button
                    color="gray"
                    variant="outlined"
                    className="flex items-center gap-1 !border-gray-300"
                  >
                    {tab}
                    <ChevronDownIcon strokeWidth={4} className="w-3 h-3 text-gray-900" />
                  </Button>
                </MenuHandler>
                <MenuList>
                  {report_items.map((item) => (
                    <MenuItem
                      key={item}
                      value={item}
                      onClick={handleTab}
                      className="uppercase"
                    >
                      {item}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </div>
            <Button className="!border-gray-300" color="gray" variant="outlined">
              Export
            </Button>
          </div>
        </div>
      </Container>

      <div className="flex justify-end mt-5 mr-8 items-center">
        <label htmlFor="yearSelect" className="mr-2 font-bold"> Năm:</label>
        <select
          id="yearSelect"
          value={selectedYear}
          onChange={handleYearChange}
          className="border border-gray-300 px-2 py-1 rounded"
        >
          {generateYears().map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
          {/* Thêm các năm khác nếu cần */}
        </select>
      </div>

      <div>
        {/* <KpiReport tab={tab} /> */}
        <div className="container mx-auto p-4">
          {/* Tổng doanh thu */}
          <div className="bg-green-200 p-4 rounded-md shadow-md mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Tổng Doanh Thu</h2>
            <p className="text-3xl font-bold text-green-600">
              {data?.data?.totalRevenueYear.toLocaleString()} VND
            </p>
          </div>

          {/* Tổng số đơn hàng */}
          <div className="bg-blue-200 p-4 rounded-md shadow-md">
            <h2 className="text-xl font-semibold text-gray-700">Tổng Số Đơn Hàng</h2>
            <p className="text-3xl font-bold text-blue-600">
               {data?.data?.totalOrdersYear}
            </p>
          </div>
        </div>

        <section className="mx-8 mt-5 grid grid-cols-2 gap-4">
          <Card>
            <CardBody className="mx-auto my-auto w-full">
              {isLoading ? (
                <Typography>Đang tải...</Typography>
              ) : isError ? (
                <Typography>Có lỗi xảy ra</Typography>
              ) : (
                <Line data={lineData} options={lineOptions} />
              )}
            </CardBody>
          </Card>
          <Card>
            <CardBody className="mx-auto my-auto w-full">
              {isLoading ? (
                <Typography>Đang tải...</Typography>
              ) : isError ? (
                <Typography>Có lỗi xảy ra</Typography>
              ) : (
                <Bar data={barData} options={barOptions} />
              )}
            </CardBody>
          </Card>
        </section>
      </div>
    </>
  );
};

export default Report;
