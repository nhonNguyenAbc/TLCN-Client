import { useState } from "react";
import { Option, Select } from "@material-tailwind/react";
import PropTypes from "prop-types";
import ProductCard from "./ProductCard";
import Pagination from "../shared/Pagination";
const ShopList = ({
  restaurants,
  sort,
  setSort,
  page,
  setPage,
  pagination,
}) => {
  const handleSort = (e) => setSort(e);
  const [active, setActive] = useState(1);
  return (
    <div className="col-span-4">
      <div className="w-full flex items-center gap-4 justify-between mb-20">
        <div>{pagination.total} kết quả</div>
        <div className="flex items-center gap-5">
          <span>Phân loại:</span>
          <span>
            <Select
              value={sort}
              onChange={handleSort}
              className="rounded !border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
              labelProps={{
                className: "hidden",
              }}
            >
              <Option value="new">Mới nhất</Option>
              <Option value="old">Cũ nhất</Option>
              <Option value="A->Z">A {" -> "} Z</Option>
              <Option value="Z->A">Z {" -> "} A</Option>
              <Option value="price-asc">Giá tăng dần</Option>
              <Option value="price-desc">Giá giảm dần</Option>
            </Select>
          </span>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-x-4 gap-y-16">
        {restaurants.map((product) => (
          <ProductCard key={product._id} {...product} />
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
ShopList.propTypes = {
  restaurants: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      colors: PropTypes.arrayOf(
        PropTypes.shape({
          color: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
        }).isRequired
      ).isRequired,
      price: PropTypes.number.isRequired,
      rating: PropTypes.number.isRequired,
      imageUrl: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
};
export default ShopList;
