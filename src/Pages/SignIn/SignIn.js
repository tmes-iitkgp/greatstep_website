import React, { useState } from "react";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import BaseUrl from "../../BaseUrl";

let t = true;
export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (location?.state?.x && t) {
      t = false;
      toast.success(location.state.x + ", Now login");
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const userInfo = {
      email: email,
      password: password,
    };
    console.log(userInfo);
    let toastId = toast.loading("Please wait...");
    axios
      .post(`${BaseUrl}/api/auth/login`, userInfo)
      .then((res) => {
        console.log(res.data);
        if (res.data.success) {
          toast.dismiss(toastId);
          toast.success("Login Successfull");
          let dataToBeStored = {
            _id: res.data.user._id,
            firstName: res.data.user.firstName,
            lastName: res.data.user.lastName,
            userName: res.data.user.userName,
            email: res.data.user.email,
            altEmail: res.data.user.altEmail,
            mobile: res.data.user.mobile,
            altMobile: res.data.user.altMobile,
            token: res.data.token,
            year: res.data.user.year,
            college: res.data.user.college,
            otherCollege: res.data.user.otherCollege,
            user: res.data.user,
            savedDate: new Date(),
          };
          localStorage.setItem("curUser", JSON.stringify(dataToBeStored));
          navigate("/");
          window.location.reload();
        } else {
          toast.dismiss(toastId);
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        toast.dismiss(toastId);
        toast.error("Internal server error");
        console.log(err);
      });
  };

  return (
    <>
      <ToastContainer />
      <form className="tw-w-full tw-mx-auto tw-my-10 tw-max-w-xs">
        <div className="tw-h-24 tw-bg-blue-500 tw-rounded-t-lg">
          <p className=" tw-text-2xl tw-font-bold tw-text-white tw-text-center tw-pt-8 ">
            Sign In
          </p>
        </div>
        <div className="tw-bg-white tw-shadow-md  tw-rounded-b-lg tw-px-8 tw-pt-6 tw-pb-8 tw-mb-4">
          <div className="tw-mb-4">
            <label
              className="tw-block tw-text-gray-700 tw-text-sm tw-font-bold tw-mb-2"
              htmlFor="username"
            >
              Email
            </label>
            <input
              className="tw-shadow tw-appearance-none tw-border tw-rounded tw-w-full tw-py-2 tw-px-3 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline"
              id="username"
              type="text"
              placeholder="eg: himanshu@gmail.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className="tw-mb-6">
            <label
              className="tw-block tw-text-gray-700 tw-text-sm tw-font-bold tw-mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="tw-shadow tw-appearance-none tw-border tw-rounded tw-w-full tw-py-2 tw-px-3 tw-text-gray-700 tw-mb-3 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline"
              id="password"
              type="password"
              value={password}
              placeholder="******************"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            {!password && (
              <p className="tw-text-red-500 tw-text-xs tw-italic">
                Please choose a password.
              </p>
            )}
          </div>
          <div className="tw-flex tw-items-center tw-justify-between">
            <button
              className="tw-bg-blue-500 hover:tw-bg-blue-700 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-rounded focus:tw-outline-none focus:tw-shadow-outline"
              type="submit"
              onClick={handleSubmit}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                navigate("/resetPassword");
              }}
              className="tw-inline-block tw-align-baseline tw-font-bold tw-text-sm tw-text-blue-500 hover:tw-text-blue-800"
            >
              Forgot Password?
            </button>
          </div>
          <p className="tw-text-xs tw-pt-4">
            New to TMES?{" "}
            <Link to="/signup" className="tw-text-blue-500 tw-font-bold ">
              Sign Up
            </Link>
          </p>
        </div>
        <p className="tw-text-center tw-text-gray-500 tw-text-xs">
          &copy;2025 TMES IIT Kgp. All rights reserved.
        </p>
      </form>
    </>
  );
}
