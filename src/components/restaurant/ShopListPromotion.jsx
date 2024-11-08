import { useEffect } from "react";
import FilterComponent from "./FilterComponent";
import ProductCard from "./ProductCard";
import Pagination from "../shared/Pagination";
import PromotionProductCard from "./PromotionProductCard";


const ShopList = ({ restaurants, setSort, setField, setPriceRange, setPage, page }) => {
  const filteredRestaurants = restaurants.data;
  const pagination = restaurants.info;


  return (
    <div className="col-span-4 p-4">
      <div className="grid grid-cols-4 gap-x-4 gap-y-8">
        {filteredRestaurants.map((restaurant) => (
          <PromotionProductCard key={restaurant._id} {...restaurant} />
        ))}
      </div>
      <Pagination
        page={pagination.number_of_pages}
        active={page}
        setActive={setPage}
      />
    </div>
  );
};


export default ShopList;
