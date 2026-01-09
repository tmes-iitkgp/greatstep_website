import axios from "axios";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "./TeamDash.css";

export const TeamDash = (props) => {
  const { teamSize, team, event } = props;
  const [ts, setTs] = useState(team?.members?.length);
  const [email, setEmail] = useState("");

  const addMember = () => {
    const tm = toast.loading("please wait...");
    // prev check
    for (const member of team.members) {
      console.log(member.email);
      if (member.email === email) {
        toast.dismiss(tm);
        toast.error("Member already added");
        return;
      }
    }
    // leader check
    if (team.leader_id.email === email) {
      toast.dismiss(tm);
      toast.error("Member already added");
      return;
    }

    // post req to backend
    axios
      .post("/auth/team/addMembers", {
        team_id: team._id,
        memberEmail: email,
      })
      .then((res) => {
        if (res.data.success) {
          toast.dismiss(tm);
          window.location.reload();
        } else {
          toast.dismiss(tm);
          toast.error(res.data.message);
        }
      })
      .catch((er) => {
        toast.dismiss(tm);
        toast.error("Server unreachable");
      });
  };

  const delMember = (id) => {
    let tl = toast.loading("please wait...");
    axios
      .delete(`/auth/team/deleteMember/${team._id}/${id}`)
      .then((res) => {
        if (res.data.success) {
          toast.dismiss(tl);
          window.location.reload();
        } else {
          toast.dismiss(tl);
          toast.error(res.data.message);
        }
      })
      .catch((er) => {
        toast.dismiss(tl);
        toast.error("Server unreachable");
      });
  };

  return (
    <>
      <ToastContainer />

      <div className="tableWrapper">
        <table className="tw-w-full tw-text-sm tw-text-left tw-text-gray-400">
          <thead className="tw-text-xs tw-text-gray-700 tw-uppercase tw-bg-gray-700 dark:tw-text-gray-400">
            <tr>
              <th scope="col" className="tw-px-6 tw-py-3">
                Member name
              </th>
              <th scope="col" className="tw-px-6 tw-py-3"></th>
              <th scope="col" className="tw-px-6 tw-py-3">
                Email
              </th>
              <th scope="col" className="tw-px-6 tw-py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="Member Name" className="tw-px-6 tw-py-4 tw-font-medium tw-text-white tw-whitespace-nowrap">
                {team?.leader_id?.firstName + " " + team?.leader_id?.lastName}
              </td>
              <td data-label="Position" scope="row" className="tw-px-6 tw-py-4">
                Leader
              </td>
              <td data-label="Email" className="tw-px-6 tw-py-4">
                {team?.leader_id?.email}
              </td>
              <td data-label="Action" className="tw-px-6 tw-py-4">
                {/* <button className="tw-font-medium tw-text-gray-200 dark:tw-text-gray-400 ">Remove</button> */}
              </td>
            </tr>

            {team?.members?.map((member, index) => {
              return (
                <tr key={index}>
                  <td data-label="Member" className="tw-px-6 tw-py-4 tw-font-medium tw-text-white tw-whitespace-nowrap">
                    {member?.firstName + " " + member?.lastName}
                  </td>
                  <td data-label="Position" scope="row" className="tw-px-6 tw-py-4">
                    Member
                  </td>
                  <td data-label="Email" className="tw-px-6 tw-py-4">
                    {member?.email}
                  </td>
                  <td data-label="Action" className="tw-px-6 tw-py-4">
                    <button onClick={() => delMember(member._id)} className="tw-font-medium tw-text-red-400 dark:tw-text-red-400 hover:tw-underline">
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {ts + 1 < teamSize && (
          <div className="tw-w-full tw-mt-10">
            <div className="tw-shadow-md tw-rounded tw-px-8 tw-pt-6 tw-pb-8 tw-mb-4">
              <div className="tw-mb-4">
                <label className="tw-block tw-text-gray-400 tw-text-sm tw-font-bold tw-mb-2" htmlFor="username">
                  Add Member by Email
                </label>
                <input
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  className="tw-shadow tw-appearance-none tw-border tw-rounded tw-w-full tw-py-2 tw-px-3 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline"
                  id="username"
                  type="text"
                  placeholder="Member's Email"
                />
              </div>

              <div className="tw-flex tw-items-center tw-justify-end">
                <button
                  onClick={addMember}
                  className="tw-bg-blue-500 hover:tw-bg-blue-700 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-rounded focus:tw-outline-none focus:tw-shadow-outline"
                  type="button"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
