import React, { useEffect, useState } from "react";
import Button from "./button";
import "./Comp.scss";
import { motion } from "framer-motion";
import homeVariants from "../../Components/Variants";
import { useParams } from "react-router-dom";
import Comp from "./Offline_Comps";
import { useNavigate } from "react-router-dom";
import sample from "../../Assets/sample.jpg";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { TeamDash } from "../../Components/TeamDash";

function QS() {
  let navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [teamDash, setTeamDash] = useState(false);
  const [team, setTeam] = useState();
  const [activeBtn, setActiveBtn] = useState(true);

  let { contact, phoneno, name, img, info, prize, teamLen, rules } = Comp.find(
    (obj) => obj.id === "QS"
  );

  const quizes = [
    {
      id: 1,
      link: "https://forms.gle/FQPb2S2ZzCNCXvvw5",
      date: "3rd",
      active: true,
    },
    // { id: 2, link: "", date: "4th" },
    // { id: 3, link: "", date: "5th" },
    // { id: 4, link: "", date: "6th" },
    // { id: 5, link: "", date: "7th" },
  ];

  useEffect(() => {
    // return if not logged in
    let curUser = JSON.parse(localStorage.getItem("curUser"));
    if (!curUser) {
      setLoading(false);
      return;
    }

    // find the previous entry if exists
    axios
      .get(`/auth/team/getMyTeam/Quiz_Spiel/${curUser._id}`)
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
    let curUser = JSON.parse(localStorage.getItem("curUser"));
    if (!curUser) {
      navigate("/signin");
      return;
    }

    // if team isn't created create one
    await axios
      .post("/auth/team/createTeam", {
        leader_id: curUser._id,
        event: "Quiz_Spiel",
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
        setActiveBtn(true)
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
                  <div className="off_event-heading"></div>
                  <div className="off_events-image">
                    <img src={img ? img : sample} alt="off_events" />
                    <div>
                      <div className="off_events_button tw-text-center">
                        {teamDash ? (
                          <h2 className="addmember_alert">
                            You have successfully registered
                            <br />
                            Rounds will be started from 3rd-7th March onwards,
                            So stay tuned
                            <br />
                            check rules for more details
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
                          <a target="blank" href={rules}>
                            <button className="custom_btn1">Rules</button>
                          </a>

                          {/* <Button txt="Problem statement" /> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="off_events_right">
                  <div className="off_events-content">
                    <>
                      {/* <div className="off_top">
                        <h4>
                          Prizes Worth :{" "}
                          <span className="animate-charcter">{prize}</span>
                        </h4>
                        <div>
                          <h4>Contact : {contact}</h4>
                          <h5>{phoneno}</h5>
                        </div>
                      </div> */}
                      <p>{info}</p>
                      {!team && <h2
                        // className="addmember_alert"
                        // style={{
                        //   fontSize: "1.2rem",
                        // }}
                      >
                        {/* Please Register for event */}
                      </h2>}
                      <h2
                        // className="addmember_alert"
                        // style={{
                        //   background: "#E90064",
                        //   color: "white",
                        //   fontSize: "1.2rem",
                        // }}
                      >
                        {/* Winner of each quiz round will be awarded cash prize of
                        Rs 500 */}
                      </h2>
                      <h2
                        // className="addmember_alert"
                        // style={{
                        //   background: "#002d9e",
                        //   color: "white",
                        //   fontSize: "1.2rem",
                        // }}
                      >
                        {/* Event has been ended  */}
                      </h2>
                    </>
                  </div>
                  
                  {/* {team && (
                    <>
                      <>
                        <p
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "center",
                          }}
                        >
                          <>
                            <a target="blank" href="https://forms.gle/qECr5vRSnrpkoHfZ8">
                              <button
                                className={`custom_btn3`}
                                style={{
                                  background: "#4E31AA",
                                  fontSize: "1.2rem",
                                  color: "white",
                                }}
                              >
                                Day 5 Quiz Link
                                <p style={{ margin: "6px" }}>
                                  7th March
                                </p>
                              </button>
                            </a>
                          </>
                        </p>
                      </>
                      <TeamDash
                        event={"Quiz_Spiel"}
                        team={team}
                        teamSize={teamLen}
                      />
                    </>
                  )} */}
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

export default QS;
