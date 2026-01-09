import React from "react";
import "./Events.scss";
import homeVariants from "../../Components/Variants";
import { motion } from "framer-motion";

const Events2 = ({ Events_name }) => {
	return (
		<motion.div
			variants={homeVariants}
			initial="hidden"
			animate="visible"
			exit="exit"
			id="home"
		>
			<h2
				className=""
				style={{
					textAlign: "center",
					color: "white",
					fontSize: "4rem",
					minHeight: "60vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				{/* <h3 className="animate-charcter"> Coming Soon</h3> */}
				<div className="waviy">
					<span style={{ "--i": "1" }}>C</span>
					<span style={{ "--i": "2" }}>O</span>
					<span style={{ "--i": "3" }}>M</span>
					<span style={{ "--i": "4" }}>I</span>
					<span style={{ "--i": "5" }}>N</span>
					<span style={{ "--i": "6" }}>G</span>
					<span style={{ "--i": "7" }}> &nbsp; </span>
					<span style={{ "--i": "8" }}>S</span>
					<span style={{ "--i": "9" }}>O</span>
					<span style={{ "--i": "10" }}>O</span>
					<span style={{ "--i": "11" }}>N</span>
				</div>
			</h2>
		</motion.div>
	);
};

export default Events2;
