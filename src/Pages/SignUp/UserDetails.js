// This section takes email and password

import React, { useState } from "react";
import isEmail from "validator/lib/isEmail";
import isStrongPassword from "validator/lib/isStrongPassword";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { Button } from "@mui/material";

function UserDetails(props) {
  const user = props.user;
  const [email, setEmail] = useState(user?.email);
  const [password, setPassword] = useState(user?.password);
  const [cpassword, setCpassword] = useState(user?.cpassword);
  const [referral, setReferral] = useState(user?.referral);
  const [valid, setValid] = useState(true);

  // errors
  const [colemail, setColEmail] = useState(false);
  const [colpassword, setColPassword] = useState(false);
  const [colcpassword, setColCpassword] = useState(false);

  const handleChange = (e) => {
    switch (e.target.name) {
      case "email":
        setEmail(e.target.value);
        setColEmail(false);
        break;
      case "password":
        setPassword(e.target.value);
        setColPassword(false);
        break;
      case "cpassword":
        setCpassword(e.target.value);
        setColCpassword(false);
        break;
      case "referral":
        console.log(e.target.value);
        setReferral(e.target.value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async () => {
    setValid(false);
    let toastId = toast.loading("Please wait...");
    let error = false;
    console.log(email, password, cpassword);
    if (!email || !isEmail(email)) {
      error = true;
      setColEmail(true);
    }
    if (
      !password ||
      !isStrongPassword(password, {
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
      })
    ) {
      error = true;
      setColPassword(true);
    }
    if (!cpassword || password !== cpassword) {
      error = true;
      setColCpassword(true);
    }

    console.log({ email: email, password: password, cpassword: cpassword });
    if (!error) {
      // check for unique email
      let unique = true;
      await axios
        .get(`/auth/checkEmail/${email}`)
        .then((res) => {
          if (!res.data.success) {
            toast.dismiss(toastId);
            unique = false;
            setValid(true);
            toast.error(res.data.message);
            setColEmail(true);
          }
        })
        .catch((er) => {
          toast.dismiss(toastId);
          toast.error("Unexpected Error");
          setValid(true);
          unique = false;
        });

      // if unique
      if (unique) {
        props.func({
          email: email,
          password: password,
          cpassword: cpassword,
          referral: referral,
        });
        props.next();
        toast.dismiss(toastId);
      }
    } else {
      toast.dismiss(toastId);
      props.toast("Invalid Entries");
      setValid(true);
    }
  };
  return (
    <>
      <div className="tw-mb-4">
        <label
          className="tw-block tw-text-gray-700 tw-text-sm tw-font-bold tw-mb-2"
          htmlFor="username"
        >
          Email
        </label>
        <input
          className=" tw-text-sm tw-shadow tw-appearance-none tw-border tw-rounded tw-w-full tw-py-2 tw-px-3 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline"
          onChange={handleChange}
          type="email"
          name="email"
          label="Email"
          placeholder="abc@gmail.com"
          value={email}
        />
        {colemail && (
          <p style={{ color: "#E14D2A", fontSize: "0.9rem" }}>
            Enter a valid email
          </p>
        )}
        {/* <input className=" tw-text-sm tw-shadow tw-appearance-none tw-border tw-rounded tw-w-full tw-py-2 tw-px-3 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline" id="username" type="text" placeholder="Username" /> */}
      </div>
      <div className="tw-mb-6">
        <label
          className="tw-block tw-text-gray-700 tw-text-sm tw-font-bold tw-mb-2"
          htmlFor="password"
        >
          Password
        </label>
        <input
          className="tw-text-sm tw-shadow tw-appearance-none tw-border tw-rounded tw-w-full tw-py-2 tw-px-3 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline"
          onChange={handleChange}
          type="password"
          name="password"
          label="Password"
          placeholder="********"
          value={password}
        />
        {colpassword && (
          <p style={{ color: "#E14D2A", fontSize: "0.9rem" }}>
            Password should have atleast 6 characters<br></br>One uppercase, one
            lowercase and one number
          </p>
        )}

        {/* <input className="tw-text-sm tw-shadow tw-appearance-none tw-border tw-rounded tw-w-full tw-py-2 tw-px-3 tw-text-gray-700 tw-mb-3 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline" id="password" type="password" placeholder="******************" /> */}
        {/* <p className="tw-text-red-500 tw-text-xs tw-italic">Please choose a password.</p> */}
      </div>
      <div className="tw-mb-4">
        <label
          className="tw-block tw-text-gray-700 tw-text-sm tw-font-bold tw-mb-2"
          htmlFor="username"
        >
          Confirm Password
        </label>
        <input
          className="tw-text-sm tw-shadow tw-appearance-none tw-border tw-rounded tw-w-full tw-py-2 tw-px-3 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline"
          onChange={handleChange}
          type="password"
          name="cpassword"
          label="Confirm Password"
          placeholder="********"
          value={cpassword}
        />
        {colcpassword && (
          <p style={{ color: "#E14D2A", fontSize: "0.9rem" }}>
            Password doesn't match
          </p>
        )}

        {/* <input className=" tw-text-sm tw-shadow tw-appearance-none tw-border tw-rounded tw-w-full tw-py-2 tw-px-3 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline" id="username" type="text" placeholder="Username" /> */}
      </div>
      <div className="tw-mb-6">
        <label
          className="tw-block tw-text-gray-700 tw-text-sm tw-font-bold tw-mb-2"
          htmlFor="password"
        >
          Referral Code(Optional)
        </label>
        <input
          className="tw-text-sm tw-shadow tw-appearance-none tw-border tw-rounded tw-w-full tw-py-2 tw-px-3 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline"
          onChange={handleChange}
          name="referral"
          label="Referral code (optional)"
          placeholder="GS23-RAJ"
          value={referral}
        />

        {/* <input className="tw-text-sm tw-shadow tw-appearance-none tw-border tw-rounded tw-w-full tw-py-2 tw-px-3 tw-text-gray-700 tw-mb-3 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline" id="password" type="password" placeholder="******************" /> */}
        {/* <p className="tw-text-red-500 tw-text-xs tw-italic">Please choose a password.</p> */}
      </div>
      <div className="tw-flex tw-justify-end">
        {valid ? (
          <button
            className="tw-bg-sky-500 tw-px-3 tw-py-2 tw-rounded-lg tw-text-white tw-text-sm hover:tw-bg-sky-400"
            type="submit"
            onClick={handleSubmit}
          >
            Next
          </button>
        ) : (
          <button className="tw-bg-sky-400 tw-px-3 tw-py-2 tw-rounded-lg tw-text-white tw-text-sm">
            Next
          </button>
        )}
      </div>
      <ToastContainer />
    </>
  );
}

export default UserDetails;
