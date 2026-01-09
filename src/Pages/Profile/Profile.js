import { WindowRounded } from "@mui/icons-material";
import { color } from "@mui/system";
import axios from "axios";
import React, { useState, useEffect } from "react";
// import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import collegeData from "../SignUp/collegeData";
// import "./Profile.css";
// import { useDispatch } from "react-redux";
// import { removeNewUser } from "../../redux-store/slices/userSlice";

const getCollege = (val) => {
  var clg = collegeData.find((item) => item.value === val);

  return clg.label;
};

export default function Profile(props) {
  const navigate = useNavigate();
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  // console.log(users);
  const [rows, setRows] = useState([]);

  let user = JSON.parse(localStorage.getItem("curUser"));
  useEffect(() => {
    if (!user) {
      navigate("/signin");
    } else {
      // update the user
      const fetchUser = async () => {
        await axios
          .get(`/auth/updateUser/${user.email}`, {
            headers: {
              Authorization: user.token,
            },
          })
          .then((res) => {
            if (res.data.success) {
              // update local storage
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

              user = JSON.parse(localStorage.getItem("curUser"));
              // console.log(user);
              setUsers(user);
              setRows([
                ["First Name", user && user.firstName ? user.firstName : "-"],
                ["Last Name", user && user.lastName ? user.lastName : "-"],
                ["email", user && user.email ? user.email : "-"],
                ["Mobile", user && user.mobile ? user.mobile : "-"],
                ["College", user && (user.college ? (user.college === -1 ? user.otherCollege : getCollege(user.college)) : "-")],
                ["Year of Graduation", user && user.year ? user.year : "-"],
              ]);
              setLoading(false);
            } else {
              localStorage.clear();
              toast.error("Error updating your profile, Internal server error");
              setUsers({ ...user });
            }
          })
          .catch((er) => {
            localStorage.clear();
            toast.error("Error updating your profile, Internal server error");
          });
      };
      fetchUser();
    }
  }, []);

  return (
    <>
      <ToastContainer />
      {loading ? (
        <>
          <div className="tw-py-40">
            <div className="waviy tw-text-center">
              <span style={{ "--i": "1" }}>L</span>
              <span style={{ "--i": "2" }}>O</span>
              <span style={{ "--i": "3" }}>A</span>
              <span style={{ "--i": "4" }}>D</span>
              <span style={{ "--i": "5" }}>I</span>
              <span style={{ "--i": "6" }}>N</span>
              <span style={{ "--i": "7" }}>G</span>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="tw-mt-10 tw-flex tw-items-center tw-pb-10 tw-w-full tw-justify-center ">
            <div className="tw-max-w-xs ">
              <div className="tw-bg-white tw-shadow-xl tw-rounded-lg tw-py-3 tw-px-5">
                <div className="photo-wrapper tw-p-2">
                  <img className="tw-w-32 tw-h-32 tw-rounded-full tw-mx-auto" src={"https://picsum.photos/seed/picsum/200/300"} alt="John Doe"></img>
                </div>
                <div className="tw-p-2">
                  <h3 className="tw-text-center tw-text-xl tw-text-gray-900 tw-font-medium tw-leading-8">{users?.firstName + " " + users?.lastName}</h3>
                  <div className="tw-text-center tw-text-gray-400 tw-text-xs tw-font-semibold">

                    <p>
                      {/* Fee Status:{" "}
                      {
                      users?.user?.verified ? (
                        <span style={{ color: "#1F8A70" }}>🟢 Paid</span>
                      ) : (
                        <>
                          <span style={{ color: "green" }} data-te-toggle="tooltip" title="If you have already paid, check back in 12 hours, we will update your payment status.">
                            🔴 Unpaid{" "}
                          </span> */}
                          <br></br>
                      {(
                        <>
                          <button
                            onClick={() => {
                              navigate("/payment");
                            }}
                            type="button"
                            className="tw-p-2 tw-bg-yellow-400 tw-text-white tw-rounded-lg tw-mt-1"
                          >
                            Pay Now
                          </button>
                        </>
                      )}
                    </p>

                  </div>
                  <table className="tw-text-xs tw-my-3">
                    <tbody>
                      {rows.map((e, index) => {
                        return (
                          <tr key={index}>
                            <td className="tw-px-2 tw-py-2 tw-text-gray-500 tw-font-semibold">{e[0]}</td>
                            <td className="tw-px-2 tw-py-2">{e[1]}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  <div className="tw-text-center tw-my-3">
                    <button
                      className="tw-bg-blue-500 hover:tw-bg-blue-700 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-rounded focus:tw-outline-none focus:tw-shadow-outline"
                      type="button"
                      onClick={() => {
                        // dispatch(removeNewUser());
                        localStorage.clear();
                        window.location.reload();
                      }}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>

              <>
                {/* {!users.user?.verified && (
                  <h2 className="addmember_alert">
                    If a payment is made but the fee status remains red, don't worry it will be corrected in 12 hours.
                    <br /> If you have any further questions, please email us at greatstept@gmail.com
                  </h2>
                )} */}

              </>
            </div>
          </div>
        </>
      )}
    </>
  );
}
