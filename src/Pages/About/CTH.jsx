import React from "react";
import CTH_data from "./CTH_data";
import { AiFillFacebook, AiFillLinkedin } from "react-icons/ai";
import { BsInstagram } from "react-icons/bs";
import { BsTwitter } from "react-icons/bs";

const CTH = () => {
  const activeStyle = "change-active changebutton";
  const inactiveStyle = "changebutton";
  const [active, setActive] = React.useState(0);

  return (
    <div className="about_container">
      {/* <h2 className="Gsec_h2">Core Team Heads</h2> */}
      <h2
        className="animate-charcter Gsec_h2 "
        style={{
          display: "flex",
          justifyContent: "center",
          backgroundImage:
            "linear-gradient(-225deg, #994bff 0%,#18ffff 29%,#1c0082 67%,#deeeff 100%",
        }}
      >
        Core Team Heads
      </h2>

      <div
        style={{ justifyContent: "center", display: "flex", flexWrap: "wrap" }}
      >
        {CTH_data.map((heads) => {
          const { Head_name, id } = heads;
          return (
            <div
              id="button-2"
              className={active === id ? activeStyle : inactiveStyle}
              onClick={() => setActive(id)}
              key={id}
            >
              <div id="slide"></div>
              <span>{Head_name}</span>
            </div>
          );
        })}
      </div>

      <section>
        {CTH_data.filter((heads) => {
          if (heads.id === active) {
            return heads;
          }
          return null;
        }).map((heads) => {
          const { Head_name, id, data } = heads;
          return (
            <div key={id}>
              <h3
                className="animate-charcter head_name "
                style={{
                  display: "flex",
                  justifyContent: "center",
                  backgroundImage:
                    "linear-gradient(-225deg, #ff87ad 0%,#ff00a6 29%,#1c0082 67%,#deeeff 100%",
                }}
              >
                {Head_name}
              </h3>
              <section className="info_cards">
                {data.map((indi_name, index_2) => {
                  const { name, imgg, insta, fb, li, twe } = indi_name;
                  return (
                    <article key={index_2}>
                      <h4>{name}</h4>
                      <img src={imgg} alt="CTH" />
                      <div className="links">
                        {fb && (
                          <a target="blank" href={fb}>
                            <AiFillFacebook className="icons1 icon" />
                          </a>
                        )}
                        {insta && (
                          <a target="blank" href={insta}>
                            <BsInstagram className="icons2 icon" />
                          </a>
                        )}
                        {twe && (
                          <a target="blank" href={twe}>
                            <BsTwitter className="icons3 icon" />
                          </a>
                        )}
                        {li && (
                          <a target="blank" href={li}>
                            <AiFillLinkedin className="icons3 icon" />
                          </a>
                        )}
                      </div>
                      {/* <img src={img} alt="CTH" /> */}
                    </article>
                  );
                })}
              </section>
              <div className="divider" style={{ margin: " 0 4rem" }}>
                <div></div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default CTH;
