import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import "./SkillCard.scss";

function SkillCard({ img, name, use }) {
  const transition = { duration: 10, ease: [0.6, 0.01, -0.05, 0.9] };
  return (
    <div className="skillcard_container">
      <img src={img} alt="" />
    </div>
  );
}

export default SkillCard;
