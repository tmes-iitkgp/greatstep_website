import React from "react";
import Button from "./button";
import "./Comp.scss";
import { motion } from "framer-motion";
import homeVariants from "../../Components/Variants";
import { useParams } from "react-router-dom";
import Comp from "./Offline_Comps";
import { useNavigate } from "react-router-dom";
import { FcContacts } from "react-icons/fc";

const Competition = () => {
  let navigate = useNavigate();
  const params = useParams();
  const { compID } = params;
  let { contact, phoneno, name, img, info, prize, rules, PS,id } = Comp.find(
    (obj) => obj.id === compID
  );

  return (
    <motion.div
      variants={homeVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      id="home"
      key={id}
    >
      <div id="off_events">
        <div className="off_events">
          <div className="off_events_left">
            <div className="off_event-heading">
              {/* <h2 className="gradient__text">{name}</h2> */}
              <div className="types">
                <h2
                  className="animate-charcter"
                  style={{
                    backgroundImage:
                      "linear-gradient(-225deg, #6300b4 0%, #003cff 29%,#61f4ff 67%,#b7ccff 100%",
                  }}
                >
                  {name}
                </h2>
              </div>
            </div>
            <div className="off_events-image">
              <img src={img} alt="off_events" />
              <div>
                <div className="off_events_button">
                  {/* <Button txt="Register" /> */}
                  {rules && (
                    <a target="blank" href={rules}>
                      <button className="custom_btn1">Rules</button>
                    </a>
                  )}
                </div>

                {PS && (
                  <div className="off_events_button">
                    <Button txt="Problem statement" />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="off_events_right">
            <div className="off_events-content">
              {/* <div className="off_top">
                {prize && (
                  <h4>
                    Prizes Worth :{" "}
                    <span className="animate-charcter">{prize}</span>
                  </h4>
                )}

                <div>
                  <h4>
                    <FcContacts style={{ display: "inline-block" }} /> Contact :{" "}
                    {contact}
                  </h4>
                  <h5>{phoneno}</h5>
                </div>
              </div> */}
              <ul style={{ color: "white", fontSize: "1rem" }}>
                {info.map((inf) => {
                  return <li style={{ display: "list-item " }}>{inf}</li>;
                })}
              </ul>
            </div>
            <div className="off_events_button">
              <Button
                bg_color="#325d90"
                txt="back"
                onClick={() => navigate(-1)}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Competition;
