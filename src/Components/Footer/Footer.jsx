import React from "react";
import "./Footer.scss";
import { Link } from "react-router-dom";

const social_media = {
  fb: "https://www.facebook.com/greatstep/",
  li: "https://in.linkedin.com/company/great-step-iit-kharagpur",
  insta: "https://instagram.com/tmes_iitkgp?igshid=YmMyMTA2M2Y=",
  // metakgp: "https://wiki.metakgp.org/w/Great_Step",
};

const Footer = () => (
  <div className="container-fluid text-white-50 footer pt-5 wow fadeIn">
    <div className="container py-5 text-white-50">
      <div className="row g-5">
        <div className="col-lg-4 col-md-6">
          <h5 className="text-white mb-4">Quick Links</h5>
          <Link className="btn btn-link text-white-50" to="/aboutus">
            About Us
          </Link>
          <Link className="btn btn-link text-white-50" to="/aboutus">
            Contact Us
          </Link>
          <Link className="btn btn-link text-white-50" to="/great-step/events">
            Events
          </Link>
        </div>
        <div className="col-lg-6 col-md-6">
          <h5 className="text-white mb-4">Get In Touch</h5>
          <p className="mb-2">
            <i className="bi bi-geo-alt-fill"></i> &nbsp; &nbsp; Department of
            Mining Engineering, IIT Kharagpur, Kharagpur, West-Bengal 721302
          </p>
          <p className="mb-2">
            <i className="bi bi-chat-right-fill"></i>&nbsp; &nbsp;&nbsp;
            <a href="mailto:greatstept@gmail.com">greatstept@gmail.com</a>
          </p>
          <div className="d-flex pt-2">
            <a
              className="btn btn-outline-light btn-social"
              target="blank"
              href={social_media.fb}
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              className="btn btn-outline-light btn-social"
              target="blank"
              href={social_media.li}
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a
              className="btn btn-outline-light btn-social"
              target="blank"
              href={social_media.insta}
            >
              <i className="bi bi-instagram"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div className="container ">
      <div className="copyright">
        <div className="row ">
          <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
            &copy;
            <a
              className="border-bottom text-white-50"
              href="https://www.tmesiitkgp.in"
            >
              TMES
            </a>
            , All Right Reserved.
          </div>
          <div className="col-md-6 text-center text-md-end">
            <div className="footer-menu">
              <Link to="/">GREAT STEP</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Footer;
