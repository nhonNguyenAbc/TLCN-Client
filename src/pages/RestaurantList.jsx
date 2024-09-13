import ShopList from "../components/restaurant/ShopList";
import PriceFilter from "../components/restaurant/PriceFilter";
import { useGetAllRestaurantsQuery } from "../apis/restaurantApi";
import {
  useGetAllTablesQuery,
  useGetAllTablesUserQuery,
} from "../apis/tableApi";
import Loading from "../components/shared/Loading";
import { Divider } from "@mui/material";
import { useState } from "react";
const restaurants = [
  {
    id: 1,
    name: "Hương Sen",
    address: "123 Nguyễn Văn Linh",
    imageUrl:
      "https://images.unsplash.com/photo-1540553016722-983e48a2cd10?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    rating: 4.5,
    numReviews: 100,
    price: 100000,
  },
  {
    id: 2,
    name: "Hương Sen",
    address: "123 Nguyễn Văn Linh",
    imageUrl:
      "https://images.unsplash.com/photo-1540553016722-983e48a2cd10?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    rating: 4.5,
    numReviews: 100,
    price: 100000,
  },
  {
    id: 3,
    name: "Hương Sen",
    address: "123 Nguyễn Văn Linh",
    imageUrl:
      "https://images.unsplash.com/photo-1540553016722-983e48a2cd10?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    rating: 4.5,
    numReviews: 100,
    price: 100000,
  },
  {
    id: 4,
    name: "Hương Sen",
    address: "123 Nguyễn Văn Linh",
    imageUrl:
      "https://images.unsplash.com/photo-1540553016722-983e48a2cd10?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    rating: 4.5,
    numReviews: 100,
    price: 100000,
  },
  {
    id: 5,
    name: "Hương Sen",
    address: "123 Nguyễn Văn Linh",
    imageUrl:
      "https://images.unsplash.com/photo-1540553016722-983e48a2cd10?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    rating: 4.5,
    numReviews: 100,
    price: 100000,
  },
  {
    id: 6,
    name: "Hương Sen",
    address: "123 Nguyễn Văn Linh",
    imageUrl:
      "https://images.unsplash.com/photo-1540553016722-983e48a2cd10?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    rating: 4.5,
    numReviews: 100,
    price: 100000,
  },
  {
    id: 6,
    name: "Hương Sen",
    address: "123 Nguyễn Văn Linh",
    imageUrl:
      "https://images.unsplash.com/photo-1540553016722-983e48a2cd10?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    rating: 4.5,
    numReviews: 100,
    price: 100000,
  },
];
const RestaurantList = () => {
  const [sort, setSort] = useState("new");
  const [filter, setFilter] = useState({
    label: "Tất cả",
    upper: 1000000000,
    lower: 0,
  });
  const [page, setPage] = useState(1);
  const {
    data: restaurants,
    error,
    isLoading,
  } = useGetAllRestaurantsQuery({
    page,
    sort,
    upper: filter.upper,
    lower: filter.lower,
  });
  const {
    data: tables,
    error: tableError,
    isLoading: tableLoading,
  } = useGetAllTablesUserQuery({
    upper: filter.upper,
    lower: filter.lower,
    sort: sort,
    page: page,
  });

  if (isLoading || tableLoading)
    return (
      <span>
        <Loading />
      </span>
    );
  if (error || tableError) return <span>Error occurred...</span>;

  return (
    <>
      <div className="mb-5"></div>
      <div className="grid grid-cols-5 mt-5">
        <div className="ms-5">
          <PriceFilter filter={filter} setFilter={setFilter} />
        </div>
        <ShopList
          sort={sort}
          setSort={setSort}
          restaurants={restaurants.data.length > 0 ? restaurants.data : []}
          pagination={restaurants.info}
          page={page}
          setPage={setPage}
        />
      </div>
    </>
  );
};

export default RestaurantList;
