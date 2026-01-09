import React from "react";
import "./Card.scss";
import Button from "./button";
import { Link } from "react-router-dom";

const Card = (props) => {
  const { to, img, name, live, hover } = props;
  return (
    <div className={`card_first ${live && "text"}`}>
      <div className="card_img">
        <img src={img} alt="event" loading="lazy" />

        <div className="card_hover">
          <Button txt="know more" link={to} />
        </div>
      </div>
      <Link to={to}>
        <div className="card_check">
          <h2>{name}</h2>
        </div>

        {live && (
          <h2
            className="addmember_alert"
            style={{
              backgroundImage:
                "linear-gradient(-225deg, #8c00ff 0%, #0039f6 29%,#009ea9 67%,#d0deff 100%",
              fontSize: "1.2rem",
              color: "white",
            }}
          >
            {/* Event is live */}
          </h2>
        )}
      </Link>
    </div>
  );
};

export default Card;
