import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@material-tailwind/react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../configs/swiper.css";
import { Autoplay, EffectFade, Pagination, Navigation } from "swiper/modules";
import { Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/restaurant/ProductCard";
import { useGetAllTablesQuery } from "../apis/tableApi";
import { useGetMenusQuery } from "../apis/menuApi";
import Loading from "../components/shared/Loading";
import { useGetAllRestaurantsQuery } from "../apis/restaurantApi";
import { useState } from "react";
const Homepage = () => {
  const navigate = useNavigate();
  const {
    data: menus,
    isLoading: menuLoading,
    error: menuError,
  } = useGetMenusQuery();

  const {
    data: restaurants,
    isLoading: restaurantLoading,
    error: restaurantError,
  } = useGetAllRestaurantsQuery({
    page: 1,
    sort: "new",
    upper: 100000000,
    lower: 0,
  });
  if (menuLoading || restaurantLoading) return <Loading />;
  if (menuError || restaurantError) return <div>Error</div>;
  const list_restaurant = restaurants?.data.map((item) => ({
    _id: item._id,
    name: item.name,
    address: item?.address?.detail,
    openTime: item.openTime,
    closeTime: item.closeTime,
    description: item.description,
    // peopleAmount: item.peopleAmount,
    imageUrls: item.image_url,
    price: item.price_per_table,
  }));
  const list_menus = menus?.data.map((menu) => ({
    id: menu._id,
    name: menu.name,
    price: menu.price,
    discount: menu.discount,
    category: menu.category,
    unit: menu.unit,
    restaurant_id: menu.restaurant._id,
    restaurant_name: menu.restaurant.name,
    image: menu.image.url
  }));
  const pagination = {
    clickable: true,
    renderBullet: function (index, className) {
      return '<span class="' + className + '">' + "</span>";
    },
  };
  return (
    <>
      <div className="w-full h-[500px] mb-5">
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          effect={"fade"}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={pagination}
          navigation
          loop={true}
          modules={[Autoplay, EffectFade, Pagination, Navigation]}
          className="mySwiper"
        >
          <SwiperSlide>
            <img
              src="/img/7.jpg"
              className="w-full h-full object-cover absolute top-0 left-0"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="/img/8.jpg"
              className="w-full h-full object-cover absolute top-0 left-0"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="/img/9.jpg"
              className="w-full h-full object-cover absolute top-0 left-0"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="/img/10.jpg"
              className="w-full h-full object-cover absolute top-0 left-0"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="/img/11.jpg"
              className="w-full h-full object-cover absolute top-0 left-0"
            />
          </SwiperSlide>
        </Swiper>
      </div>
      <div>
        <Container>
          <Typography variant="h2" className="text-left">
            Nhà hàng của chúng tôi
          </Typography>
        </Container>
        <Swiper
          slidesPerView={4}
          spaceBetween={30}
          modules={[Navigation]}
          loop={true}
          className="mySwiper mt-10"
        >
          {restaurants?.data.map((restaurant) => (
            <SwiperSlide key={restaurant.id} className="mb-2">
              <ProductCard {...restaurant} />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="text-center mb-10"></div>
      </div>
      <div>
        <Container>
          <Typography variant="h2" className="text-left">
            Món ăn nổi bật
          </Typography>
        </Container>
        <Swiper
          slidesPerView={4}
          spaceBetween={30}
          loop={true}
          modules={[Navigation]}
          className="mySwiper mb-5"
        >
          {list_menus.map((menu) => (
            <SwiperSlide key={menu.id} className="mb-2">
              <Card
                className="mt-6 cursor-pointer"
                onClick={() => navigate("/restaurant/" + menu.restaurant_id)}
              >
                <CardHeader color="blue-gray" className="relative h-40">
            <img src={menu.image} alt="card-image" className="object-cover" />
          </CardHeader>
                <CardBody className="mx-auto w-full h-[20vh] ">
                  <Typography variant="h5">{menu.name}</Typography>
                  <Typography color="blue-gray" className=" text-center">
                    {menu.restaurant_name}
                  </Typography>
                </CardBody>
                <CardFooter className="w-full pt-0 flex items-center justify-around gap-5">
                  <div></div>
                  <Typography className="text-[#FF333A]" variant="h5">
                    {(menu.price).toLocaleString(
                      "en-US"
                    )}{" "}
                    đ
                  </Typography>
                  
                  <Typography color="black" variant="h6">
                    / {menu.unit}
                  </Typography>
                </CardFooter>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default Homepage;
