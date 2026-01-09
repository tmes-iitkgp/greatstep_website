import React from "react";
import "./TMES.scss";
import Prof from "./Prof";
import { motion } from "framer-motion";
import { C_Btn } from "../../Components";
import tmes_home from "../../Assets/tmes_home.jpg";
import Posters from "../../Components/Posters/Posters";

import list from "./image";
import Swiper_Scroll from "../../Pages/Home/Swiper_Scroll";

import homeVariants from "../../Components/Variants";
// import CoalMine from "../../Assets/CoalMining.mp4";

const TMES = () => {
  let curUser = JSON.parse(localStorage.getItem("curUser"));
  return (
    <>
      <motion.div
        variants={homeVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        id="tmes"
      >
        {/* <video
        src={CoalMine}
        autoPlay
        muted
        playsInline
        loop
        className="bg_video"
      ></video> */}
        <div className="header section__padding">
          <div className="header-content">
            <h1 className="text__tmes">WELCOME TO TMES</h1>
            <p>
              Technology Mining Engineering Society (TMES) aims at bringing a
              closer association among the students and faculty members in the
              department. It has initiated Social Cultural and Sports Events,
              which brings them together for a closer interaction.
            </p>

            {/* {!curUser && (
              <div style={{ margin: "4rem 0 0 0" }}>
                <C_Btn txt="Register Now" link="/signup"></C_Btn>
              </div>
            )} */}

          </div>

          <div className="header-image">
            <img
              src={tmes_home}
              style={{ borderRadius: "0.4rem", height: "400px" }}
              alt=""
            />
          </div>
        </div>

        {/* <Brand /> */}
        <Prof />
        <Swiper_Scroll imgs={list} />
      </motion.div>
    </>
  );
};

export default TMES;
