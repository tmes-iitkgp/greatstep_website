import React from "react";
import { Link } from "react-router-dom";
import "./Button.scss";

const Button = (props) => {
  const { txt, link, bg_color } = props;
  return (
    <Link to={link}>
      <button className="custom_btn" style={{ background: `${bg_color}` }}>
        {txt}
      </button>
    </Link>
  );
};

export default Button;
