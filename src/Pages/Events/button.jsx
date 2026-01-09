import React from "react";
import { Link } from "react-router-dom";
import "./button.scss";

const Button = (props) => {
  const { txt, link, bg_color, onClick } = props;
  return (
    <Link to={link}>
      <button
        className="custom_btn1"
        onClick={onClick}
        style={{ background: { bg_color } }}
      >
        {txt}
      </button>
    </Link>
  );
};

export default Button;
