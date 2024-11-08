import { useEffect } from "react";
import FilterComponent from "./FilterComponent";
import ProductCard from "./ProductCard";
import Pagination from "../shared/Pagination";


const ShopList = ({ restaurants, setSort, setField, setPriceRange, setPage, page }) => {
  const filteredRestaurants = restaurants.data;
  const pagination = restaurants.info;

  const handleSortChange = (value) => {
    const [field, order] = value.split('-');
    setField(field); 
    setSort(order === 'asc' ? 1 : -1);
  };

  const handlePriceChange = (value) => {
    setPriceRange(value); 
    setPage(1); 
  };

  return (
    <div className="col-span-4 p-4">
      <div className="w-full flex items-center gap-4 justify-between mb-8">
        <div>{filteredRestaurants.length} kết quả</div>
        <FilterComponent
          handleSort={handleSortChange}
          handlePriceChange={handlePriceChange}
        />
      </div>
      <div className="grid grid-cols-4 gap-x-4 gap-y-8">
        {filteredRestaurants.map((restaurant) => (
          <ProductCard key={restaurant._id} {...restaurant} />
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
