import React from "react";
import Marquee from "react-fast-marquee";
import styled from "styled-components";
import SkillCard from "./SkillCard";

const Section = styled.div`
  margin: 2rem 0;
  width: 100%;
  overflow: hidden;
`;

const Posters = ({ list }) => {
  return (
    <Section className="posters">
      <Marquee
        style={{ margin: "0 1rem" }}
        pauseOnHover={true}
        speed={100}
        gradient={false}
      >
        {list.map((d) => {
          const { link } = d;
          return <SkillCard img={d.link} />;
        })}
      </Marquee>
    </Section>
  );
};

export default Posters;
