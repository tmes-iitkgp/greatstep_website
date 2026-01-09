import React from "react";
import "./About.scss";
import GSec from "./Gsec";
import { AiFillFacebook, AiFillLinkedin } from "react-icons/ai";
import { BsInstagram } from "react-icons/bs";
import { BsTwitter } from "react-icons/bs";
import { motion } from "framer-motion";
import hod from "../../Assets/Profile/hod.jpg";
import sujitha from "../../Assets/Profile/gsec/sujitha.jpg";
import harshal from "../../Assets/Profile/gsec/harshal.jpg";
import president from "../../Assets/Profile/president.jpg";
import homeVariants from "../../Components/Variants";
import CTH from "./CTH";

const About = () => {
  return (
    <motion.section
      variants={homeVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="about"
    >
      <h1
        className="animate-charcter heading"
        style={{
          display: "flex",
          justifyContent: "center",
          backgroundImage:
            "linear-gradient(-225deg, #994bff 0%,#18ffff 29%,#1c0082 67%,#deeeff 100%",
        }}
      >
        About Us
      </h1>

      <div className="about_container">
        <section className="info_cards">
          <article>
            <h2>Head of Department</h2>
            <h3>Prof. Biswajit Samanta</h3>

            <img src={hod} alt="CTH" />
            <div className="links">
              {/* <a target="blank" href={fb}>
                            <AiFillFacebook className="icons1 icon" />
                          </a>
                          <a target="blank" href={insta}>
                            <BsInstagram className="icons2 icon" />
                          </a>
                          <a target="blank" href={twe}>
                            <BsTwitter className="icons3 icon" />
                          </a>
                          <a target="blank" href={li}>
                            <AiFillLinkedin className="icons3 icon" />
                          </a> */}
            </div>
          </article>
          <article>
            <h2>President</h2>
            <h3>Prof. Rakesh Kumar</h3>
            <img src={president} alt="CTH" />
            <div className="links">
              {/* <<a target="blank" href={fb}>
                            <AiFillFacebook className="icons1 icon" />
                          </a>
                          <a target="blank" href={insta}>
                            <BsInstagram className="icons2 icon" />
                          </a>
                          <a target="blank" href={twe}>
                            <BsTwitter className="icons3 icon" />
                          </a>
                          <a target="blank" href={li}>
                            <AiFillLinkedin className="icons3 icon" />
                          </a> */}
            </div>
          </article>
        </section>
      </div>
      <div className="about_container">
        <section className="info_cards">
          <article>
            <h2>Vice President</h2>
            <h3>Sujitha Vaddavalli</h3>
            <img src={sujitha} alt="CTH" />
            <div className="links">
              <a target="blank" href={"https://www.facebook.com/profile.php?id=100079460922360"}>
                <AiFillFacebook className="icons1 icon" />
              </a>
              <a target="blank" href={"https://www.instagram.com/sujitha_vaddavalli/profilecard/?igsh=Zml2bmZzdjQ0emJ6"}>
                <BsInstagram className="icons2 icon" />
              </a>
              {/* <a target="blank" href={twe}>
                <BsTwitter className="icons3 icon" />
              </a> */}
              <a target="blank" href={"https://www.linkedin.com/in/sujitha-vaddavalli-473648228?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"}>
                <AiFillLinkedin className="icons3 icon" />
              </a>
            </div>
          </article>
          <article>
            <h2>Treasurer</h2>
            <h3>Harshal Yuvraj</h3>
            <img src={harshal} alt="CTH" />
            <div className="links">
              <a
                target="blank"
                href="https://www.facebook.com/share/Bm7g8ny3GE4Tn1cq/"
              >
                <AiFillFacebook className="icons1 icon" />
              </a>
              <a target="blank" href="https://www.instagram.com/__harshal_______?igsh=MWxmdXE4YzAzeGtncg==">
                <BsInstagram className="icons2 icon" />
              </a>
              {/* <a target="blank" href={twe}>
                <BsTwitter className="icons3 icon" />
              </a> */}
              <a
                target="blank"
                href="https://www.linkedin.com/in/harshal-yuvraj?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
              >
                <AiFillLinkedin className="icons3 icon" />
              </a>
            </div>
          </article>
        </section>
      </div>
      <div className="divider">
        <div></div>
      </div>
      <div className="about_container">
        <h2
          className="animate-charcter Gsec_h2 "
          style={{
            backgroundImage:
              "linear-gradient(-225deg, #994bff 0%,#18ffff 29%,#1c0082 67%,#deeeff 100%",
          }}
        >
          General Secretaries
        </h2>
        <section className="info_cards">
          {GSec.map((each, index) => {
            const { name, imgg, fb, insta, twe, li } = each;
            return (
              <article key={index}>
                <h3>{name}</h3>
                <img src={imgg} alt="G-Sec" />
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
              </article>
            );
          })}
        </section>
      </div>
      <div className="divider">
        <div></div>
      </div>
      <CTH />
    </motion.section>
  );
};

export default About;
