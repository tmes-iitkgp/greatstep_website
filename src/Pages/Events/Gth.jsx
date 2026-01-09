import React from "react";
import Button from "./button";
import "./Comp.scss";
import { motion } from "framer-motion";
import homeVariants from "../../Components/Variants";
// import { useParams } from "react-router-dom";
import Comp from "./Offline_Comps";
import { useNavigate } from "react-router-dom";
import sample from "../../Assets/sample.jpg";
import { useState } from "react";
import { useEffect } from "react";
import { GuessTheTheme } from "../../Components/GuessTheTheme/GuessTheTheme";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const GTH = () => {
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState(false);
  const [word1, setWord1] = useState("");
  const [word2, setWord2] = useState("");
  let navigate = useNavigate();
  //   const params = useParams();
  //   const { compID } = params;

  useEffect(() => {
    let curUser = JSON.parse(localStorage.getItem("curUser"));
    if (!curUser) {
      setLoading(false);
      return;
    }

    axios
      .get(`/events/getEntry/${curUser._id}`)
      .then((res) => {
        res = res.data;
        // check if he has already responded for gtt!
        if (res.success && res.already) {
          setGame(true);
          let words = res.gtt.guess.split(" ");
          setWord1(words[0]);
          setWord2(words[1]);
        } else if (!res.success) {
          toast.error("Some internal error occured, contact admin");
        }
      })
      .catch((er) => {
        toast.error("Server unreachable, contact admin");
      })
      .finally(setLoading(false));
  }, []);

  let { img } = Comp.find((obj) => obj.id === "gth");
  const registerGTH = () => {
    let User = JSON.parse(localStorage.getItem("curUser"));
    if (!User) {
      navigate("/signin");
    } else {
      // make register == true in backend

      // move them to game area
      setGame(true);
      // scroll to top
      window.scrollTo(0, 0);
    }
  };
  return (
    <>
      <ToastContainer />
      {loading ? (
        <>
          <div className="tw-py-40">
            <div className="waviy tw-text-center">
              <span style={{ "--i": "1" }}>L</span>
              <span style={{ "--i": "2" }}>O</span>
              <span style={{ "--i": "3" }}>A</span>
              <span style={{ "--i": "4" }}>D</span>
              <span style={{ "--i": "5" }}>I</span>
              <span style={{ "--i": "6" }}>N</span>
              <span style={{ "--i": "7" }}>G</span>
            </div>
          </div>
        </>
      ) : (
        <>
          <motion.div
            variants={homeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            id="home"
          >
            <div id="off_events">
              <div className="off_events">
                <div className="off_events_left">
                  <div className="off_event-heading"></div>
                  <div className="off_events-image">
                    <img src={img ? img : sample} alt="off_events" />
                    <div>
                      <div className="off_events_button">
                        {!game && (
                          <button
                            onClick={registerGTH}
                            className="custom_btn1"
                            // class="tw-bg-transparent hover:tw-bg-blue-500 tw-text-blue-700 tw-font-semibold hover:tw-text-white tw-py-2 tw-px-4 tw-border tw-border-blue-500 hover:tw-border-transparent tw-rounded"
                          >
                            {/* Register */}
                          </button>
                        )}
                        <div className="off_events_button">
                          <a
                            target="blank"
                            href="https://drive.google.com/file/d/14ubMiC3b-pJp32Zu8utN1sf2wTCd15aG/view?usp=share_link"
                          >
                            <button className="custom_btn1">Rules</button>
                          </a>
                        </div>
                      </div>
                      {/* https://drive.google.com/file/d/14ubMiC3b-pJp32Zu8utN1sf2wTCd15aG/view?usp=share_link */}
                    </div>
                  </div>
                </div>
                <div className="off_events_right">
                  <div className="off_events-content">
                    {game ? (
                      <GuessTheTheme word1={word1} word2={word2} />
                    ) : (
                      <div className="off_top">
                        {/* <h4>Please register for Event</h4> */}
                      </div>
                    )}
                  </div>
                  <div className="off_events_button" style={{ margin: "1rem" }}>
                    <Button
                      bg_color="#102236"
                      txt="back"
                      onClick={() => navigate(-1)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
};
export default GTH;
