import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../../configs/swiper.css";

import { Autoplay, EffectFade, Pagination, Navigation } from "swiper/modules";

const HeroSection = () => {
    const pagination = {
        clickable: true,
        renderBullet: function (index, className) {
            return '<span class="' + className + '">' + "</span>";
        },
    };
    return (
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
    )
}

export default HeroSection