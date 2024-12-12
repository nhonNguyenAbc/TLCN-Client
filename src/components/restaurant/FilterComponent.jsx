import { Select, Option } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { useGetProvincesQuery, useGetDistrictsByProvinceQuery } from "../../apis/restaurantApi"; // Update this import path

const FilterComponent = ({ 
  handleSort, 
  handlePriceChange, 
  handleProvinceChange, 
  handleDistrictChange 
}) => {
  const [sortValue, setSortValue] = useState("price_per_table-asc");
  const [priceValue, setPriceValue] = useState("all");
  const [selectedProvince, setSelectedProvince] = useState(""); 
  const [selectedDistrict, setSelectedDistrict] = useState(""); 

  // Fetch provinces
  const { data: provinces = [], isLoading: isProvincesLoading } = useGetProvincesQuery();
  
  // Fetch districts for selected province
  const { data: districts = [], isLoading: isDistrictsLoading } = useGetDistrictsByProvinceQuery(
    selectedProvince, 
    { skip: !selectedProvince }
  );

  // Prepare provinces dropdown options
  const provincesWithDefaultOption = [
    { code: "", name: "Khu vực" },
    ...provinces
  ];

  // Prepare districts dropdown options
  const districtsWithDefaultOption = [
    { code: "", name: "Khu vực" },
    ...districts
  ];

  useEffect(() => {
    // Reset district when province changes
    setSelectedDistrict("");
    
    // Call province change handlers
    handleProvinceChange(selectedProvince);
    handleDistrictChange(""); 
  }, [selectedProvince]);

  const handleSortChange = (value) => {
    setSortValue(value);
    handleSort(value);
  };

  const handlePriceChangeInternal = (value) => {
    setPriceValue(value);
    handlePriceChange(value);
  };

  const handleProvinceChangeInternal = (value) => {
    setSelectedProvince(value);
  };

  const handleDistrictChangeInternal = (value) => {
    //setSelectedDistrict(value);
    handleDistrictChange(value);
  };

  return (
    <div className="flex items-center gap-8 mr-4 mb-4">
      {/* Dropdown Giá */}
      <Select
        label="Giá"
        value={priceValue}
        onChange={handlePriceChangeInternal}
        className="rounded !border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent"
      >
        <Option value="all">Tất cả giá</Option>
        <Option value="under_200k">Dưới 200k</Option>
        <Option value="200k_500k">200k - 500k</Option>
        <Option value="500k_1m">500k - 1 triệu</Option>
        <Option value="above_1m">Trên 1 triệu</Option>
      </Select>

      {/* Dropdown Phân loại */}
      <Select
        label="Phân loại"
        value={sortValue}
        onChange={handleSortChange}
        className="rounded !border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent"
      >
        <Option value="price_per_table-asc">Giá tăng dần</Option>
        <Option value="price_per_table-desc">Giá giảm dần</Option>
      </Select>

      {/* Dropdown Province */}
      <Select
        label="Tỉnh/Thành phố"
        value=""
        onChange={handleProvinceChangeInternal}
        disabled={isProvincesLoading}
        className="rounded !border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent"
      >
        {provincesWithDefaultOption.map((province) => (
          <Option key={province.code} value={province.code}>
            {province.name}
          </Option>
        ))}
      </Select>

      {/* Dropdown District */}
      <Select
        label="Quận/Huyện"
        value={selectedDistrict}
        onChange={handleDistrictChangeInternal}
        disabled={isDistrictsLoading || !selectedProvince}
        className="rounded !border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent"
      >
        {districtsWithDefaultOption.map((district) => (
          <Option key={district.code} value={district.code}>
            {district.name}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default FilterComponent;