import React, { useEffect, useState } from "react";
import Button from "./button";
import "./Comp.scss";
import { motion } from "framer-motion";
import homeVariants from "../../Components/Variants";
import Comp from "./Offline_Comps";
import { useNavigate } from "react-router-dom";
import sample from "./publiQuiz.jpg";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

import getCollege from "./GetCollege";

function PubliQuiz() {
  let navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [teamDash, setTeamDash] = useState(false);
  const [team, setTeam] = useState();
  const [activeBtn, setActiveBtn] = useState(true);

  let { contact, phoneno, name, img, info, prize, teamLen } = Comp.find(
    (obj) => obj.id === "MS"
  );

  let curUser = JSON.parse(localStorage.getItem("curUser"));

  useEffect(() => {
    // return if not logged in
    console.log(curUser);

    if (!curUser) {
      setLoading(false);
      return;
    }

    // find the previous entry if exists
    axios
      .get(`/auth/team/getMyTeam/publiQuiz/${curUser._id}`)
      .then((res) => {
        if (res.data.success) {
          if (res.data.team) {
            setTeam(res.data.team);
            setTeamDash(true);
            setLoading(false);
          }
        } else {
          toast.error("Internal server Error");
        }
      })
      .catch((er) => {
        toast.error("Server not reachable");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const register = async () => {
    setActiveBtn(false);
    let tl = toast.loading("please wait...");

    // if not logged in redirect to sign in page

    if (!curUser) {
      navigate("/signin");
      return;
    }

    // if team isn't created create one
    await axios
      .post("/auth/team/createTeam", {
        leader_id: curUser._id,
        event: "publiQuiz",
      })
      .then((res) => {
        if (res.data.success) {
          toast.dismiss(tl);
          window.location.reload();
        } else {
          toast.dismiss(tl);
          toast.error("Internal Server Error");
        }
      })
      .catch((er) => {
        toast.dismiss(tl);
        toast.error("Server not reachable");
      });
  };

  return (
    <>
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
          <ToastContainer />
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
                        Quizomania
                      </h2>
                    </div>
                  </div>
                  <div className="off_events-image">
                    <img src={sample} alt="off_events" />
                    <div>
                      <div className="off_events_button tw-text-center">
                        {teamDash ? (
                          <h2 className="addmember_alert">
                            You are all set to attempt the quiz!
                            <br />
                            Best of luck!
                          </h2>
                        ) : (
                          <button
                            onClick={() => {
                              activeBtn && register();
                            }}
                            className="custom_btn1"
                          >
                            {/* Register */}
                          </button>
                        )}

                        <div className="off_events_button">
                          {/* <a
                                target="blank"
                                href="https://drive.google.com/file/d/15jACtSz-aXDO99LidLKgN3pYB1kZefLG/view?usp=share_link"
                              >
                                <button className="custom_btn1">Rules</button>
                              </a>
                              <Button txt="Problem statement" /> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="off_events_right" style={{ padding: "0" }}>
                  <div className="off_events-content">
                    {team ? (
                      <>
                        <iframe
                          // src="https://docs.google.com/forms/d/e/1FAIpQLSdzdurQApaIoeDmakoxpHfW4mjN5x2TRuApE8tXKfbAjRYgwg/viewform?embedded=true"
                          src={`https://docs.google.com/forms/d/e/1FAIpQLSdzdurQApaIoeDmakoxpHfW4mjN5x2TRuApE8tXKfbAjRYgwg/viewform?usp=pp_url&entry.1344080455=${
                            curUser.firstName + " " + curUser.lastName
                          }&entry.2072205120=${getCollege(curUser.college)}`}
                          style={{
                            width: "100%",
                            height: "80vh",
                            padding: "0",
                            margin: "0",
                          }}
                          frameborder="0"
                        >
                          Loading…
                        </iframe>

                        {/* <TeamDash event={"publiQuiz"} team={team} teamSize={teamLen} /> */}
                      </>
                    ) : (
                      <>
                        <div className="off_top">
                          {/* <h4>
                                  Prizes Worth : {" "}  <span>{prize}</span>
                                </h4>
                                <div>
                                  <h4>Contact : {contact}</h4>
                                  <h5>{phoneno}</h5>
                                </div> */}
                        </div>
                        {/* <p>{info}</p> */}
                      </>
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
}

export default PubliQuiz;
