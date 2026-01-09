import React from "react";
import "./Home.scss";
import { motion } from "framer-motion";
import Prof from "./Prof";
import Swiper from "./Swiper_Scroll";
import SkillsSlider from "./Skill_slider";
import Header from "./Header";

import images from "./images";
import homeVariants from "../../Components/Variants";
// import CoalMine from "../../Assets/CoalMining.mp4";

const GreatStep = () => (
	<motion.div
		variants={homeVariants}
		initial="hidden"
		animate="visible"
		exit="exit"
		id="home"
	>
		{/* <video
      src={CoalMine}
      autoPlay
      muted
      playsInline
      className="bg_video"
      loop
    /> */}
		{/* <Circle /> */}
		<Header />
		<Swiper imgs={images} />
		<Prof />
		{/* <Prof2 /> */}
		{/* <Participants /> */}
		<SkillsSlider />
	</motion.div>
);

export default GreatStep;
