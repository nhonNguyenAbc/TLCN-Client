import React, { useState } from "react";
import { useSelector } from "react-redux";
import ShopList from "../components/restaurant/ShopList";
import { useGetAllRestaurantsQuery } from "../apis/restaurantApi";
import ChatbotButton from "../components/shared/ChatbotButton";
import Loading from "../components/shared/Loading";

const RestaurantPage = () => {
  const searchTerm = useSelector((state) => state.search.term);
  const [sort, setSort] = useState(-1);
  const [field, setField] = useState("rating");
  const [priceRange, setPriceRange] = useState("all");
  const [page, setPage] = useState(1);
  const [provinceCode, setProvinceCode] = useState("10");
  const [districtCode, setDistrictCode] = useState("");
  const [type, setType] = useState("");
  const [reputable, setReputable] = useState("");
  const { data: restaurants, error, isLoading } = useGetAllRestaurantsQuery({
    searchTerm,
    sort,
    field,
    priceRange,
    page,
    provinceCode,
    districtCode,
    type,
    reputable
  });

  if (isLoading) {
    return <div><Loading/></div>;
  }

  if (error) {
    return <div>Error loading restaurants.</div>;
  }

  return (
    <div  className="bg-gray-200 ">
      <ChatbotButton />
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
          setType={setType}
          setReputable = {setReputable}
        />
      </div>
    </div>
  );
};

export default RestaurantPage;