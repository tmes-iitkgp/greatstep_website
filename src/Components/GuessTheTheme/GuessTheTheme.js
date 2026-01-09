import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import OtpInput from "react18-input-otp";
import "./Gtt.scss";
export const GuessTheTheme = (props) => {
  const [word1, setWord1] = useState(props.word1);
  const [word2, setWord2] = useState(props.word2);
  const [btn, setBtn] = useState(true);

  useEffect(() => {
    if (word1 !== "" && word2 !== "") {
      setBtn(false);
    }
  }, []);

  const handleSubmit = () => {
    let curUser = JSON.parse(localStorage.getItem("curUser"));
    if (!curUser) {
      return;
    }
    const lt = toast.loading("please wait...");
    let error = false;
    if (word1.length !== 4) {
      error = true;
      toast.dismiss(lt);
      toast.error("Enter word 1 to submit");
      return;
    }
    if (word2.length !== 7) {
      error = true;
      toast.dismiss(lt);
      toast.error("Enter word 2 to submit");
      return;
    }

    // submit and save to backend
    axios
      .post("/events/addNewEntry", {
        userId: curUser._id,
        guess: word1 + " " + word2,
        fullName: curUser.firstName + " " + curUser.lastName,
      })
      .then((res) => {
        if (res.data.success) {
          toast.dismiss(lt);
          toast.success(res.data.message);
          window.location.reload();
        } else {
          toast.dismiss(lt);
          toast.error("Internal error");
        }
      })
      .catch((er) => {
        toast.dismiss(lt);
        toast.error("Internal error");
      });
  };
  return (
    <>
      <ToastContainer />
      <div className="gth">
        <div className="">
          <div className="">
            <div style={{ display: "flex", justifyContent: "center" }}>
              <p className="animate-charcter head">Guess The Theme</p>
            </div>
            <div className="box">
              <div className="box-side">
                <p className="word"> E M Z A </p>
                <OtpInput
                  value={word1}
                  onChange={(otp) => setWord1(otp)}
                  numInputs={4}
                  containerStyle="tw-justify-center"
                  inputStyle="inputField tw-rounded-lg"
                  separator={<span>&nbsp;</span>}
                />
              </div>
              <div className="box-side">
                <p className="word">E R I M I N A </p>
                <OtpInput
                  value={word2}
                  containerStyle="tw-justify-center"
                  onChange={(otp) => setWord2(otp)}
                  inputStyle="inputField tw-rounded-lg tw-border-dashed"
                  numInputs={7}
                  separator={<span>&nbsp;</span>}
                />
              </div>
            </div>

            <div className="tw-flex tw-flex-col tw-pt-10">
              <div>
                {btn ? (
                  <button
                    onClick={handleSubmit}
                    className="tw-flex tw-flex-row tw-items-center tw-justify-center tw-text-center tw-w-full tw-border tw-rounded-xl tw-outline-none tw-py-3 tw-bg-blue-400 hover:tw-bg-blue-500 tw-border-none tw-text-white tw-text-xl tw-font-bold tw-shadow-sm"
                  >
                    Submit
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        toast.warning("You can not change your submission");
                      }}
                      className="tw-flex tw-flex-row tw-items-center tw-justify-center tw-text-center tw-w-full tw-border tw-rounded-xl tw-outline-none tw-py-3 tw-bg-green-400 hover:tw-bg-green-500 tw-border-none tw-text-white tw-text-xl tw-font-bold tw-shadow-sm"
                    >
                      Already Responded
                    </button>
                    <h2 className="addmember_alert">
                      Your response for the guessing theme has been received.
                      Once the theme is announced, the winners will be notified
                      accordingly.
                    </h2>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
