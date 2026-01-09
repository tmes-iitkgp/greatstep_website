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
import getCollege from "./GetCollege";

function Code_Ext() {
  let navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [teamDash, setTeamDash] = useState(false);
  const [team, setTeam] = useState();
  const [activeBtn, setActiveBtn] = useState(true);

  let { contact, phoneno, name, img, info, prize, teamLen, rules, ps, submission } = Comp.find((obj) => obj.id === "code_ext");

  useEffect(() => {
    // return if not logged in
    let curUser = JSON.parse(localStorage.getItem("curUser"));
    if (!curUser) {
      setLoading(false);
      return;
    }

    // find the previous entry if exists
    axios
      .get(`/auth/team/getMyTeam/code_ext/${curUser._id}`)
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

  let curUser = JSON.parse(localStorage.getItem("curUser"));
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
        event: "code_ext",
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
          <motion.div variants={homeVariants} initial="hidden" animate="visible" exit="exit" id="home">
            <div id="off_events">
              <div className="off_events">
                <div className="off_events_left">
                  <div className="off_event-heading">
                    {/* <div className="types">
                      <h2
                        className="animate-charcter"
                        style={{
                          backgroundImage: "linear-gradient(-225deg, #6300b4 0%, #003cff 29%,#61f4ff 67%,#b7ccff 100%",
                          fontSize:"1.8rem"
                        }}
                      >
                        {name}
                      </h2>
                    </div> */}
                  </div>
                  <div className="off_events-image">
                    <img src={img ? img : sample} alt="off_events" />
                    <div>
                      <div className="off_events_button tw-text-center">
                        {/* {teamDash ? (
                          <>
                            <h2 className="addmember_alert">You have been successfully registered</h2>
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              activeBtn && register();
                            }}
                            className="custom_btn1"
                          >
                            Register
                          </button>
                        )} */}

                        <div className="off_events_button">
                          <a target="blank" href={rules}>
                            <button className="custom_btn1">Rules</button>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="off_events_right" style={{justifyContent:"start"}} >
                  <div className="off_events-content">
                    <>
                      {/* <div className="off_top">
                        <h4>
                          Prizes Worth : <span className="animate-charcter">{prize}</span>
                        </h4>
                        <div>
                          <h4>Contact : {contact}</h4>
                          <h5>{phoneno}</h5>
                        </div>
                      </div> */}
                      {info.map((x, index) => {
                        return <p key={index}>{x}</p>;
                      })}
                    </>
                  </div>
                  <div className="off_events_button" style={{ margin: "1rem" }}>
                    <Button bg_color="#102236" txt="back" onClick={() => navigate(-1)} />
                  </div>
                  {team && (
                    <>
                      <TeamDash event={"code_ext"} team={team} teamSize={teamLen} />
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
}

export default Code_Ext;
