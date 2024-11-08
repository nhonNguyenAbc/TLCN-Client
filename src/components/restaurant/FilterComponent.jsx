import { Select, Option } from "@material-tailwind/react";
import { useState } from "react";

const FilterComponent = ({ handleSort, handlePriceChange }) => {
  const [sortValue, setSortValue] = useState("createdAt-desc"); // Mặc định "Mới nhất"
  const [priceValue, setPriceValue] = useState("all"); // Mặc định "Tất cả giá"

  const handleSortChange = (value) => {
    setSortValue(value);
    handleSort(value);
  };

  const handlePriceChangeInternal = (value) => {
    setPriceValue(value);
    handlePriceChange(value);
  };

  return (
    <div className="flex items-center gap-8 mr-4 mb-4">
      <Select
        label="Giá"
        value={priceValue} // Quản lý giá trị

        onChange={handlePriceChangeInternal}
        className="rounded !border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
      >
        <Option value="all">Tất cả giá</Option>
        <Option value="under_200k">Dưới 200k</Option>
        <Option value="200k_500k">200k - 500k</Option>
        <Option value="500k_1m">500k - 1 triệu</Option>
        <Option value="above_1m">Trên 1 triệu</Option>
      </Select>
      <Select
        label="Phân loại"
        value={sortValue} // Quản lý giá trị
        onChange={handleSortChange}
        className="rounded !border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
      >
        <Option value="createdAt-desc">Mới nhất</Option>
        <Option value="createdAt-asc">Cũ nhất</Option>
        <Option value="price_per_table-asc">Giá tăng dần</Option>
        <Option value="price_per_table-desc">Giá giảm dần</Option>
      </Select>

    </div>
  );
};

export default FilterComponent;
