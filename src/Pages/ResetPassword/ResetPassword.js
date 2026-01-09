import axios from "axios";
import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

export const ResetPassword = () => {
  const [email, setEmail] = useState();
  let navigate = useNavigate();

  const handleSubmit = () => {
    let tl = toast.loading("please wait...");
    axios
      .post("/auth/resetPassword", {
        email: email,
        url: window.location.origin,
      })
      .then((res) => {
        if (res.data.success) {
          toast.dismiss(tl);
          toast.success(res.data.message);
        } else {
          toast.dismiss(tl);
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        toast.dismiss(tl);
        toast.error("Server unreachable");
      });
  };
  return (
    <>
      <ToastContainer />
      <div className="tw-w-full tw-mx-auto tw-my-10 tw-max-w-xs">
        <div className="tw-h-24 tw-bg-blue-500 tw-rounded-t-lg">
          <p className=" tw-text-2xl tw-font-bold tw-text-white tw-text-center tw-pt-8 ">
            Reset Password
          </p>
        </div>
        <form className="tw-bg-white tw-shadow-md  tw-rounded-b-lg tw-px-8 tw-pt-6 tw-pb-8 tw-mb-4">
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
          <div className="tw-flex tw-items-center tw-justify-between">
            <button
              className="tw-bg-gray-500 hover:tw-bg-gray-700 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-rounded focus:tw-outline-none focus:tw-shadow-outline"
              type="button"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
            <button
              className="tw-bg-blue-500 hover:tw-bg-blue-400 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-rounded focus:tw-outline-none focus:tw-shadow-outline"
              type="button"
              onClick={handleSubmit}
            >
              Reset
            </button>
          </div>
        </form>
        <p className="tw-text-center tw-text-gray-500 tw-text-xs">
          &copy;2025 TMES IIT Kgp. All rights reserved.
        </p>
      </div>
    </>
  );
};
