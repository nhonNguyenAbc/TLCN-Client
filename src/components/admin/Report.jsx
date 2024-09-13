import React from "react";
import { Bar, Line } from "react-chartjs-2";
import "chart.js/auto";
import {
  Button,
  Card,
  CardBody,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from "@material-tailwind/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Container } from "@mui/material";
import KpiReport from "./KpiReport";
import { report_items } from "../../constants/menu_item";

const Report = () => {
  const [tab, setTab] = React.useState("doanh thu");
  const lineData = {
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
    datasets: [
      {
        label: "2022",
        data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120],
        fill: false,
        backgroundColor: "rgb(50, 100, 100)",
        borderColor: "rgba(50, 100, 100, 1)",
      },
      {
        label: "2023",
        data: [65, 59, 80, 81, 56, 55, 40, 30, 20, 10, 5, 1],
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 1)",
      },
      {
        label: "2024",
        data: [65, 59, 80, 81, 56, 55, 40, 30, 20, 10, 5, 1],
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 1)",
      },
      {
        label: "2025",
        data: [65, 59, 80, 81, 56, 55, 40, 30, 20, 10, 5, 1],
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 1)",
      },
      {
        label: "2026",
        data: [65, 59, 80, 81, 56, 55, 40, 30, 20, 10, 5, 1],
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 1)",
      },
    ],
  };
  const barData = {
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
    datasets: [
      {
        label: "2024",
        data: [65, 59, 80, 81, 56, 55, 40, 30, 20, 10, 5, 1],
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 1)",
      },
    ],
  };
  const lineOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      title: {
        display: true,
        text:
          `Biểu đồ Top 5 ` + tab + ` các tháng năm ` + new Date().getFullYear(),
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
        text: `Biểu đồ ` + tab + ` 2024`,
        font: {
          size: 20,
        },
      },
    },
  };

  const handleTab = (e) => setTab(e.target.value);
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
                    <ChevronDownIcon
                      strokeWidth={4}
                      className="w-3 h-3 text-gray-900"
                    />
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
            <Button
              className=" !border-gray-300"
              color="gray"
              variant="outlined"
            >
              Export
            </Button>
          </div>
        </div>
      </Container>
      <div>
        <KpiReport tab={tab} />
        <section className="mx-8 mt-5 grid grid-cols-2 gap-4">
          <Card>
            <CardBody className="mx-auto my-auto w-full">
              <Line data={lineData} options={lineOptions} />
            </CardBody>
          </Card>
          <Card>
            <CardBody className="mx-auto my-auto w-full">
              <Bar data={barData} options={barOptions} />
            </CardBody>
          </Card>
        </section>
      </div>
    </>
  );
};

export default Report;
