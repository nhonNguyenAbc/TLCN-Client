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
import { useGetBestSellingMenuItemsQuery, useGetMenusQuery } from "../apis/menuApi";
import Loading from "../components/shared/Loading";
import { useGetAllRestaurantPromotionQuery, useGetAllRestaurantsQuery } from "../apis/restaurantApi";
import { useState } from "react";
import ChatBox from "../components/shared/ChatBot";
import ChatbotButton from "../components/shared/ChatbotButton";
import HeroSection from "../components/shared/HeroSection";
import CommonSlider from "../components/shared/CommonSlider";
import MenuCard from "../components/restaurant/MenuCard";
import PromotionProductCard from "../components/restaurant/PromotionProductCard";
const Homepage = () => {
  const navigate = useNavigate();
  const {
    data: menus,
    isLoading: menuLoading,
    error: menuError,
  } = useGetBestSellingMenuItemsQuery();

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
  const { 
    data: promotionRestaurantsData,
     error, 
     isLoading } = useGetAllRestaurantPromotionQuery({
    page: 1
  });
  if (menuLoading || restaurantLoading) return <Loading />;
  if (menuError || restaurantError) return <div>Error</div>;
  
  const pagination = {
    clickable: true,
    renderBullet: function (index, className) {
      return '<span class="' + className + '">' + "</span>";
    },
  };
  
  return (
    <div className=" bg-gray-200">
      <ChatbotButton />
      <div className='bg-gray-200'>
        <HeroSection />
        <div className='mx-2'>
          <Typography variant="h4" className="text-left mx-12">
            Nhà hàng uy tín
          </Typography>
          <CommonSlider
            dataList={restaurants}
            CardComponent={ProductCard}
            uniqueId="restaurants"
          />
        </div>
        <div className='mx-4'>
          <Typography variant="h4" className="text-left mx-12">
            Chương trình khuyễn mãi
          </Typography>
          <CommonSlider
            dataList={promotionRestaurantsData}
            CardComponent={PromotionProductCard}
            
            uniqueId="promotions"
          />
        </div>

        <div className='mx-4'>
          <Typography variant="h4" className="text-left mx-12">
            Món ăn nổi bật
          </Typography>
          <CommonSlider
            dataList={menus}
            CardComponent={MenuCard}
            uniqueId="menus"
          />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
