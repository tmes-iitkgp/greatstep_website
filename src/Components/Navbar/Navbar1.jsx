import React, { useState, useEffect } from "react";
import "./Navbar1.scss";
import { useNavigate } from "react-router-dom";
import { NavLink, useLocation } from "react-router-dom";
import $ from "jquery";
import { GiHamburgerMenu } from "react-icons/gi";

const Navbar = () => {
  const [status, setStatus] = useState("SignIn");
  const [payment, setPayment] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  let curUser = JSON.parse(localStorage.getItem("curUser"));
  useEffect(() => {
    localStorage.getItem("curUser")
      ? setStatus("Profile")
      : setStatus("SignIn");
    if (curUser) {
      setPayment(curUser?.user?.verified);
    }
  }, []);

  function animation() {
    var tabsNewAnim = $("#navbarSupportedContent");
    var activeItemNewAnim = tabsNewAnim.find(".active");
    var activeWidthNewAnimHeight = activeItemNewAnim.innerHeight();
    var activeWidthNewAnimWidth = activeItemNewAnim.innerWidth();
    var itemPosNewAnim = activeItemNewAnim.position();
    if (
      typeof itemPosNewAnim !== "undefined" &&
      typeof itemPosNewAnim.top !== "undefined"
    ) {
      $(".hori-selector").css({
        top: itemPosNewAnim.top + "px",
        left: itemPosNewAnim.left + "px",
        height: activeWidthNewAnimHeight + "px",
        width: activeWidthNewAnimWidth + "px",
      });
    }
    $("#navbarSupportedContent").on("click", ".nav-link", function (e) {
      $("#navbarSupportedContent ul .nav-link").removeClass("active");
      $(this).addClass("active");
      var activeWidthNewAnimHeight = $(this).innerHeight();
      var activeWidthNewAnimWidth = $(this).innerWidth();
      var itemPosNewAnimTop = $(this).position();
      var itemPosNewAnimLeft = $(this).position();
      $(".hori-selector").css({
        top: itemPosNewAnimTop.top + "px",
        left: itemPosNewAnimLeft.left + "px",
        height: activeWidthNewAnimHeight + "px",
        width: activeWidthNewAnimWidth + "px",
      });
    });
  }

  useEffect(() => {
    animation();
    $(window).on("resize", function () {
      setTimeout(function () {
        animation();
      }, 500);
    });
  }, [location.pathname]);

  return (
    <>
      <nav>
        <div className="navbar navbar-expand-lg">
          {/* <NavLink className="navbar-brand navbar-logo" to="/" exact>
          <img src={logo} />
        </NavLink> */}

          <button
            className="toggler"
            onClick={function () {
              setTimeout(function () {
                animation();
              });
            }}
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <GiHamburgerMenu color="white" />
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ml-auto">
              <div className="hori-selector">
                <div className="left"></div>
                <div className="right"></div>
              </div>

              <NavLink className="nav-link" to="/tmes">
                <li className="nav-item ">
                  <i className="bi bi-minecart-loaded"></i>Home
                </li>
              </NavLink>
              <NavLink className="nav-link" to="/">
                <li className="nav-item">
                  <i className="far fa-clone"></i>GreatStep
                </li>
              </NavLink>

              <NavLink className="nav-link " to="/great-step/events">
                <li className="nav-item">
                  <i className="bi bi-calendar-event"></i>Events
                </li>
              </NavLink>

              <NavLink className="nav-link" to="/aboutus">
                <li className="nav-item">
                  <i className="far fa-file-alt"></i>About
                </li>
              </NavLink>
              <NavLink
                className={`nav-link ${(location.pathname === "/signup" ||
                  location.pathname === "/resetPassword" || location.pathname === "/payment"||location.pathname === "/changePassword") &&
                  "active" 
                  }`}
                to={`${status}`}
              >
                <li className="nav-item">
                  <i className="fas fa-user-circle"></i>
                  {status}
                </li>
              </NavLink>
            </ul>
          </div>
        </div>
      </nav>
      <>

        {/* <>
          {!payment && (
            <button
              type="button"
              onClick={() => navigate("/payment")}
              className="tw-absolute tw-top-4 tw-left-0 tw-ml-28 tw-text-gray-900 tw-bg-[#F7BE38] hover:tw-bg-[#F7BE38]/90 focus:tw-ring-4 focus:tw-ring-[#F7BE38]/50 tw-font-medium tw-rounded-lg tw-text-sm tw-px-5 tw-py-2.5 tw-text-center tw-inline-flex tw-items-center dark:focus:tw-ring-[#F7BE38]/50 tw-mr-2 tw-mb-2"
            >
              <svg
                className="tw-mr-2 tw--ml-1 tw-w-4 tw-h-4"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="paypal"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
              >
                <path
                  fill="currentColor"
                  d="M111.4 295.9c-3.5 19.2-17.4 108.7-21.5 134-.3 1.8-1 2.5-3 2.5H12.3c-7.6 0-13.1-6.6-12.1-13.9L58.8 46.6c1.5-9.6 10.1-16.9 20-16.9 152.3 0 165.1-3.7 204 11.4 60.1 23.3 65.6 79.5 44 140.3-21.5 62.6-72.5 89.5-140.1 90.3-43.4 .7-69.5-7-75.3 24.2zM357.1 152c-1.8-1.3-2.5-1.8-3 1.3-2 11.4-5.1 22.5-8.8 33.6-39.9 113.8-150.5 103.9-204.5 103.9-6.1 0-10.1 3.3-10.9 9.4-22.6 140.4-27.1 169.7-27.1 169.7-1 7.1 3.5 12.9 10.6 12.9h63.5c8.6 0 15.7-6.3 17.4-14.9 .7-5.4-1.1 6.1 14.4-91.3 4.6-22 14.3-19.7 29.3-19.7 71 0 126.4-28.8 142.9-112.3 6.5-34.8 4.6-71.4-23.8-92.6z"
                ></path>
              </svg>
              Pay GreatStep Fee
            </button>
          )}
        </> */}
      </>
    </>
  );
};
export default Navbar;
