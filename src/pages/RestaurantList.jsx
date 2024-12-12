import React, { useState } from "react";
import { useSelector } from "react-redux";
import ShopList from "../components/restaurant/ShopList";
import { useGetAllRestaurantsQuery } from "../apis/restaurantApi";

const RestaurantPage = () => {
  const searchTerm = useSelector((state) => state.search.term);
  const [sort, setSort] = useState(-1); 
  const [field, setField] = useState("createdAt"); 
  const [priceRange, setPriceRange] = useState("all"); 
  const [page, setPage] = useState(1);
  const [provinceCode, setProvinceCode] = useState("10");
  const [districtCode, setDistrictCode] = useState("");

  const { data: restaurants, error, isLoading } = useGetAllRestaurantsQuery({
    searchTerm,
    sort,
    field,
    priceRange,
    page,
    provinceCode,
    districtCode
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading restaurants.</div>;
  }

  return (
    <>
      <div className="mb-5"></div>
      <div className="grid grid-cols-4 mt-5">
        <ShopList
          restaurants={restaurants}
          setSort={setSort} 
          setField={setField} 
          setPriceRange={setPriceRange} 
          page={page}
          setPage={setPage}
          setProvinceCode={setProvinceCode}
          setDistrictCode={setDistrictCode}
        />
      </div>
    </>
  );
};

export default RestaurantPage;