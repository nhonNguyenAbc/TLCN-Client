import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const CommonSlider = ({ dataList, CardComponent }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  return (
    <div className="relative px-12">
      <button
        ref={prevRef}
        className={`absolute top-1/2 -left-0 z-10 transform -translate-y-1/2 p-2 bg-gray-200 text-black rounded-full hover:bg-gray-400 transition ${
          isBeginning ? 'hidden' : ''
        }`}
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>

      <button
        ref={nextRef}
        className={`absolute top-1/2 -right-0 z-10 transform -translate-y-1/2 p-2 bg-gray-200 text-black rounded-full hover:bg-gray-400 transition ${
          isEnd ? 'hidden' : ''
        }`}
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>

      <Swiper
        slidesPerView={4}
        spaceBetween={30}
        modules={[Navigation]}
        loop={false}
        onInit={(swiper) => {
          swiperRef.current = swiper;
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
          swiper.navigation.init();
          swiper.navigation.update();

          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
      >
        {dataList?.data.map((data) => (
          <SwiperSlide key={data._id} className="mb-8 rounded-2xl">
            <CardComponent {...data} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CommonSlider;
