import { Button, Typography } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import OtpInput from "react18-input-otp";

const style = {
  backgroundcolor: "#ffffff",
  textalign: "center",
  alignitems: "center",
  fontSize: "20px",
  width: "80%",
  borderRadius: "0.65rem",
  borderWidth: "2px",
  borderColor: "#E5E7EB",
  outline: 0,
};
var OTP = false
function EmailConfirmation(props) {
  const [code, setCode] = useState();
  const [otp, setOtp] = useState("");
  const [colotp, setColOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    if(!OTP){
      let num = Math.floor(Math.random() * 90000) + 10000;
      setCode(num);
      console.log(num);
      // api call to send email
      axios
        .post("/auth/sendEmail", { code: num, email: props.user.email })
        .then();
    }
    OTP = true
  }, []);
  const handleChange = (x) => {
    setColOtp(false);
    setOtp(x);
    if (x.length === 5) {
      let toastId = toast.loading("Please wait...")
      if (x == code) {
        toast.dismiss(toastId)
        props.submit();
      } else {
        setColOtp(true);
        toast.dismiss(toastId)
        props.toast("Incorrect otp");
      }
    }
  };

  return (
    <>
      <div className="tw-mb-4">
        <p className="tw-text-2xl tw-font-bold tw-text-center">
          Email verification
        </p>
        <Typography variant="h5" sx={{ mx: "auto" }}></Typography>
      </div>
      <div className="tw-mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: 200, height: 200, color: "B3FFAE", margin: "auto" }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1"
            d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
          />
        </svg>
        <Typography
          variant="body1"
          sx={{ mx: "auto", fontSize: 15, textAlign: "center", mb: 2}}
        >
          We just sent a verification code at{" "}
          <span style={{ color: "#82C3EC" }}>{props?.user?.email}</span>. Enter
          code to verify your account
        </Typography>
        {colotp && (
          <p style={{ color: "red", textAlign: "center", fontSize: "1rem" }}>
            Incorrect otp
          </p>
        )}
        <OtpInput
          numInputs={5}
          value={otp}
          isInputNum={true}
          onChange={handleChange}
          hasErrored={colotp}
          errorStyle={{ ...style, color: "#FF1E1E" }}
          separator={<span>&nbsp; &nbsp;</span>}
          containerStyle={{ margin: "auto" }}
          inputStyle={style}
        />
        <button
          className="tw-bg-gray-500 tw-px-3 tw-py-2 tw-rounded-lg tw-text-white tw-text-sm tw-mt-5 hover:tw-bg-gray-400 hover:tw-text-black"
          onClick={() => {
            props.prev();
          }}
        >
          Back
        </button>
        {/* <Button
                    variant="gradient"
                    color="white"
                    onClick={() => { props.prev() }}
                >
                    Back
                </Button> */}
      </div>
      {/* <MKBox pt={4} pb={3} px={3}>
                <MKBox component="form" role="form" display='flex' flexDirection='column'>
                    <MKBox mb={2} display='flex'>
                        <Typography variant="h4" sx={{ mx: 'auto' }}>Email verification</Typography>
                    </MKBox>
                    <MKBox mb={2} display='flex'>
                        <svg xmlns="http://www.w3.org/2000/svg" style={{ width: 200, height: 200, color: 'B3FFAE', margin: 'auto' }} fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"
                                d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                        </svg>
                    </MKBox>

                    <MKBox mb={2} display='flex'>
                        <Typography variant="body1" sx={{ mx: 'auto', fontSize: 15, textAlign: 'center' }}>We just sent a verification code at <span style={{ color: '#82C3EC' }}>{props?.user?.email}</span>. Enter code to verify your account</Typography>
                    </MKBox>
                    <MKBox>
                        {colotp && <p style={{ color: 'red', textAlign: 'center', fontSize: '1rem' }}>Incorrect otp</p>}
                    </MKBox>
                    <MKBox mb={2} display='flex'>
                        <OtpInput
                            numInputs={5}
                            value={otp}
                            onChange={handleChange}
                            hasErrored={colotp}
                            errorStyle={{ ...style, color: '#FF1E1E' }}
                            separator={<span>&nbsp; &nbsp;</span>}
                            containerStyle={{ margin: 'auto' }}
                            inputStyle={style}
                        />
                    </MKBox>
                    <MKBox mt={1} >
                        <MKButton
                            variant="gradient"
                            color="white"
                            onClick={() => { props.prev() }}
                        >
                            Back
                        </MKButton>
                    </MKBox>
                </MKBox>
            </MKBox> */}
    </>
  );
}

export default EmailConfirmation;
