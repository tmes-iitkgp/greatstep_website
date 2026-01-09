import React from "react";
import "./Home.scss";
import president_talks from "./president_talks.mp4";
import vid1 from "./vid1.mp4";
import vid2 from "./vid2.mp4";
const Prof = () => (
  <>
    <div className="video_section Prof section__padding" style={{ height: "fit-content" }}>
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <video src={vid2} controls />
      </div>
    </div>
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      {/* <video src={vid2} controls /> */}
      {/* <video src={president_talks} controls /> */}
    </div>
  </>
);

export default Prof;
