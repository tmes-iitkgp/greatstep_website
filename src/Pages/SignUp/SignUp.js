import React from "react";

// sub sections
import UserDetails from "./UserDetails";
import PersonalDetails from "./PersonalInfo";
import EmailConfirmation from "./EmailConfirmation";

// axios
import axios from "axios";

// toast
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom/dist";
import { Box } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";

function SignUpBasic() {
  const [step, setStep] = useState(1);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const nextStep = () => {
    setStep(step + 1);
    console.log(step);
  };

  const prevStep = () => {
    setStep(step - 1);
    console.log(step);
  };

  const loadToast = (message) => {
    console.log(message);
    toast.error(message);
  };

  const handleChange = (fields) => {
    setUser({ ...user, ...fields });
  };

  const submitForm = () => {
    console.log(user);
    const toastId = toast.loading("Please wait...");
    axios
      .post("/auth/register", user)
      .then((res) => {
        if (res.data.success) {
          toast.dismiss(toastId);
          navigate("/signin", { state: { x: "Registration Successfull" } });
        } else {
          toast.dismiss(toastId);
          toast.error("Internal server error");
        }
      })
      .catch((er) => {
        toast.dismiss(toastId);
        toast.error("Internal server error");
      });
  };

  return (
    <>
      <ToastContainer />
      <div className="tw-w-full tw-mx-auto tw-my-10 tw-max-w-xs">
        <div className="tw-h-24 tw-bg-blue-500 tw-rounded-t-lg">
          <p className=" tw-text-2xl tw-font-bold tw-text-white tw-text-center tw-pt-8 ">
            Sign Up
          </p>
        </div>
        <div className="tw-bg-white tw-shadow-md  tw-rounded-b-lg tw-px-8 tw-pt-6 tw-pb-8 tw-mb-4">
          {
            {
              1: (
                <>
                  <UserDetails
                    toast={(x) => loadToast(x)}
                    user={user}
                    next={nextStep}
                    func={(x) => handleChange(x)}
                  />
                </>
              ),
              2: (
                <>
                  <PersonalDetails
                    toast={(x) => loadToast(x)}
                    user={user}
                    next={nextStep}
                    func={(x) => handleChange(x)}
                    prev={prevStep}
                  />
                </>
              ),
              3: (
                <>
                  <EmailConfirmation
                    toast={(x) => loadToast(x)}
                    user={user}
                    prev={prevStep}
                    submit={submitForm}
                  />
                </>
              ),
            }[step]
          }

          <p className="tw-text-xs tw-pt-4">
            Already Registered?{" "}
            <Link to="/signin" className="tw-text-blue-500 tw-font-bold ">
              Sign In
            </Link>
          </p>
        </div>
        <p className="tw-text-center tw-text-gray-500 tw-text-xs">
          &copy;2025 TMES IIT Kgp. All rights reserved.
        </p>
      </div>
    </>
  );
}

export default SignUpBasic;
