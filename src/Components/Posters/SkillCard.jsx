import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import "./SkillCard.scss";

function SkillCard({ img, name, use }) {
  const transition = { duration: 10 };
  return (
    <div className="skillcard_container">
      <img src={img} alt="" />
    </div>
  );
}

export default SkillCard;
