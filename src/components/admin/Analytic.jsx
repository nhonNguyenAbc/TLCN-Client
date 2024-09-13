import { Line } from "react-chartjs-2";
import "chart.js/auto";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from "@material-tailwind/react";
import Kpi from "../shared/Kpi";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Container } from "@mui/material";
import { useGetTotalRevenueOrder5YearsQuery } from "../../apis/orderApi.js";
const Analytic = () => {
  // const data = {
  //   labels: [
  //     "January",
  //     "February",
  //     "March",
  //     "April",
  //     "May",
  //     "June",
  //     "July",
  //     "August",
  //     "September",
  //     "October",
  //     "November",
  //     "December",
  //   ],
  //   datasets: [
  //     {
  //       label: "2022",
  //       data: [10, 20, 30, 40, 50, 60],
  //       fill: false,
  //       backgroundColor: "rgb(50, 100, 100)",
  //       borderColor: "rgba(50, 100, 100, 1)",
  //     },
  //     {
  //       label: "2023",
  //       data: [65, 59, 80, 81, 56, 55],
  //       fill: false,
  //       backgroundColor: "rgb(75, 192, 192)",
  //       borderColor: "rgba(75, 192, 192, 1)",
  //     },
  //   ],
  // };
  const { data, error, isLoading } = useGetTotalRevenueOrder5YearsQuery();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  const chartData = {
    labels: [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ],
    datasets: Object.keys(data.data).map((year) => ({
      label: year,
      data: data.data[year],
      fill: false,
      borderColor:
        year === "2024"
          ? "rgb(50, 100, 100)"
          : year === "2023"
          ? "rgb(75, 192, 192)"
          : year === "2022"
          ? "rgb(100, 100, 100)"
          : year === "2021"
          ? "rgb(100, 100, 200)"
          : "rgb(100, 100, 200)",
    })),
  };
  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  return (
    <>
      <Container className="mt-5">
        <div className="flex justify-between my-auto">
          <Typography variant="h3" className="font-bold ">
            Thống kê
          </Typography>
          <div className="shrink-0">
            <Menu>
              <MenuHandler>
                <Button
                  color="gray"
                  variant="outlined"
                  className="flex items-center gap-1 !border-gray-300"
                >
                  last 24h
                  <ChevronDownIcon
                    strokeWidth={4}
                    className="w-3 h-3 text-gray-900"
                  />
                </Button>
              </MenuHandler>
              <MenuList>
                <MenuItem>last 12h</MenuItem>
                <MenuItem>last 10h</MenuItem>
                <MenuItem>last 24h</MenuItem>
              </MenuList>
            </Menu>
          </div>
        </div>
      </Container>
      <div className="grid grid-cols-4">
        <section className="ms-8 me-8 mt-8 col-span-3">
          <Card>
            <CardBody className="!p-2">
              <div className="flex gap-2 flex-wrap justify-between px-4 !mt-4 ">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                    <Typography
                      variant="small"
                      className="font-normal text-gray-600"
                    >
                      2022
                    </Typography>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                    <Typography
                      variant="small"
                      className="font-normal text-gray-600"
                    >
                      2023
                    </Typography>
                  </div>
                </div>
              </div>
              <Line data={chartData} options={options} />
            </CardBody>
            <CardFooter className="flex gap-6 flex-wrap items-center justify-between">
              <div>
                <Typography variant="h6" color="blue-gray">
                  Doanh thu hàng năm
                </Typography>
                <Typography
                  variant="small"
                  className="font-normal text-gray-600 mt-1"
                >
                  So sánh doanh thu các tháng với năm gần nhất
                </Typography>
              </div>
              <Button variant="outlined">Xem báo cáo</Button>
            </CardFooter>
          </Card>
        </section>
        <Kpi />
      </div>
    </>
  );
};

export default Analytic;
