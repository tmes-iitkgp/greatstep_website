import React from "react";
import { C_Btn, Participants } from "../../Components";

import ncl from "../../Assets/Sponsors/ncl.png";
import gmdc from "../../Assets/Sponsors/gmdc.jpg";
import president_talks from "./president_talks.mp4";
import vid1 from "./vid1.mp4";

const Header = () => {
  let curUser = JSON.parse(localStorage.getItem("curUser"));
  return (
    <>
      <div className="header section__padding">
        <div className="header-content">
          <div className="header-image">
            {/* <img src={logo} /> */}
            <div>
              <img style={{ height: "90px" }} src={ncl} alt="" />
            </div>
            <h2 className="text__tmes">&</h2>
            <div>
              <img src={gmdc} alt="" />
            </div>
          </div>

          <h2 className="text__tmes">Technology Mining Engineering Society</h2>
          <p style={{ fontSize: "1.6rem" }} className="animate-charcter">
            Presents
          </p>
          <h1 className="animate-charcter">GREAT-STEP"25</h1>
          <h2 className="animate-charcter" style={{ fontSize: "1.2rem" }}>28th - 30th March </h2>
          <p>
            Upholding the esteem of being the antecedent, the Department of Mining Engineering, IIT Kharagpur has always believed in the flow of practical knowledge with innovation as inspiration,
            which has rejuvenated the ancestral engineering ideals into the modern facts.
          </p>
          <p>
            With this vision as guidance and zeal to keep pace with the developments in the Mining and Geology industries, the Department of Mining engineering initiated{" "}
            <b>
              <a href="https://tmesiitkgp.in/">GREATSTEP</a>
            </b>{" "}
            (acronym for Geo-Resource Engineering and Technology Students' Teachers' and Employers' Partnership) in 2008 to create a common platform for all the budding Mining engineers. The last
            thirteen editions were filled with mind churning challenges, several informative guest lectures and workshops aimed at the expansion of thoughts into the unexplored realms of the field.
          </p>
{/* 
          {!curUser && (
            <div style={{ margin: "4rem 0 0 0" }}>
              <C_Btn txt="Register Now" link="/signup"></C_Btn>
            </div>
          )} */}

          {/* <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "2rem",
          }}
        >autoPlay muted loop
          <img style={{ maxWidth: "800px" }} src={poster} alt="" />
        </div> */}
        </div>
      </div>
      <div className="video_section Prof section__padding" style={{ height: "fit-content" }}>
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          {/* <video src={vid1} autoPlay muted loop /> */}
          {/*
      <video src={president_talks} controls /> */}
        </div>
      </div>
    </>
  );
};

export default Header;
