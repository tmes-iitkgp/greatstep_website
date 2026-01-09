import React from "react";

const T_Shirt_Design = () => {
	return (
		<div className="quiz_container">
			<div className="off_events section__padding" id="off_events">
				<div className="off_events-image">
					<img
						src="https://source.unsplash.com/g5tvZdOK0EM"
						alt="off_events"
					/>
				</div>
				<div className="off_events-content">
					<h1 className="gradient__text">T-Shirt Design</h1>
					<p></p>
					{/* <h3>Upload your design</h3> */}
					<a
						href="https://docs.google.com/forms/d/e/1FAIpQLSfZcfxU8dlkV1PECCCvhFCEGLZ8BKWuT5Y0SpWxURsvSp_UxQ/viewform?usp=sf_link"
						target="_blank"
					>
						<button className="btn">Upload</button>
					</a>
				</div>
			</div>
		</div>
	);
};

export default T_Shirt_Design;
