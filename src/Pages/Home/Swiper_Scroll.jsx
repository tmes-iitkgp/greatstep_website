import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "./SkillCard.scss";
// import required modules
import { EffectCoverflow, Pagination, Navigation, Autoplay } from "swiper";

export default function Carousel2({ imgs }) {
  return (
    <div className="carousel2">
      {/* <div className="carousel2_title">
        <h2>Welcome</h2>
      </div> */}
      <Swiper
        // effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        spaceBetween={50}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        loop={true}
        loopFillGroupWithBlank={true}
        // fadeEffect={{ crossFade: true }}
        // coverflowEffect={{
        //   rotate: 10,
        //   depth: 30,
        //   modifier: 5,
        // }}
        navigation
        modules={[EffectCoverflow, Navigation, Autoplay]}
        className="mySwiper"
      >
        {imgs.map((image, index) => {
          return (
            <SwiperSlide key={index}>
              <img src={image} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
