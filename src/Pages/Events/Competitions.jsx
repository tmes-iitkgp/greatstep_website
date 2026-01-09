import React from "react";
import "./Events.scss";
import Card from "./Card";
import events from "./Events_name";
import { motion } from "framer-motion";
import homeVariants from "../../Components/Variants";
import vid2 from "../Home/vid2.mp4";
import vid1 from "../Home/vid1.mp4";

const Competitions = () => {
  return (
    <motion.div variants={homeVariants} initial="hidden" animate="visible" exit="exit" id="home">
     
      {events.map((event, idx) => {
        const { type, data } = event;
        return (
          <div key={idx}>
            {type && (
              <div className="types">
                <h2
                  className="animate-charcter "
                  style={{
                    backgroundImage: "linear-gradient(-225deg, #ab58ff 0%,#18ffff 29%,#1c0082 67%,#deeeff 100%",
                  }}
                >
                  {type}
                </h2>
              </div>
            )}
            <div className="events_cards">
              {data.map((comp, idx) => {
                return <Card key={idx} {...comp}></Card>;
              })}
            </div>
          </div>
        );
      })}
    </motion.div>
  );
};

export default Competitions;
