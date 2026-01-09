import React from "react";
import "./TMES.scss";
import tmes_home2 from "../../Assets/tmes_home2.jpg";

const tmes_info_ = () => (
  <div className="tmes_info_ section__padding" id="tmes_info_">
    <div className="tmes_info_-image">
      <img src={tmes_home2} alt="tmes_info_" />
    </div>
    <div className="tmes_info_-content">
      <h4>Some of the noted events are:</h4>

      <ul>
        <li>Freshers introduction</li>
        <li>
          <a href="https://tmesiitkgp.in/">GREAT STEP</a>
        </li>
        <li>Teacher Day Celebration</li>
        <li>Annual Departmental Picnic</li>
        <li>Mine visits</li>
        <li>Final Year Farewell</li>
      </ul>
    </div>
  </div>
);

export default tmes_info_;
