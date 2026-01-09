// This section is for Personal details - first name, last name, College, year, mobile, alt mobile

import React, { useState } from "react";
import {
  Autocomplete,
  Button,
  Input,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import collegeData from "./collegeData";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

function PersonalDetails(props) {
	const user = props.user;
	const [valid, setValid] = useState(true);
	const [firstName, setFirstName] = useState(user?.firstName);
	const [lastName, setLastName] = useState(user?.lastName);
	const [college, setCollege] = useState(user?.college);
	const [other, setOther] = useState("")
	const [year, setYear] = useState(user?.year);
	const [mobile, setMobile] = useState(user?.mobile);

  // errors
  const [colfirstName, setColFirstName] = useState(false);
  const [collastName, setColLastName] = useState(false);
  const [colcollege, setColCollege] = useState(false);
  const [colyear, setColYear] = useState(false);
  const [colmobile, setColMobile] = useState(false);

	const handleChange = (e) => {
		console.log(college);
		switch (e.target.name) {
			case "other":
				setOther(e.target.value)
				break;
			case "firstName":
				setFirstName(e.target.value);
				setColFirstName(false);
				break;
			case "lastName":
				setLastName(e.target.value);
				setColLastName(false);
				break;
			case "year":
				setYear(e.target.value);
				setColYear(false);
				break;
			case "mobile":
				setMobile(e.target.value);
				setColMobile(false);
				break;
			default:
				break;
		}
	};

  const handleSubmit = async () => {
    setValid(false);
    let toastId = toast.loading("Please wait...");
    // fname, lname, college, year, mobile
    console.log(firstName, lastName, college, year, mobile);
    let error = false;
    if (!firstName) {
      error = true;
      setColFirstName(true);
    }
    if (!firstName) {
      error = true;
      setColLastName(true);
    }
    if (!college) {
      error = true;
      setColCollege(true);
    }
    if (
      /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(
        mobile
      ) === false
    ) {
      error = true;
      setColMobile(true);
    }
    if (/^[12][0-9]{3}$/.test(year) == false) {
      error = true;
      setColYear(true);
    }

    if (!error) {
      // check for unique email
      let unique = true;
      await axios
        .get(`/auth/checkMobile/${mobile}`)
        .then((res) => {
          if (!res.data.success) {
            setValid(true);
            toast.dismiss(toastId);
            toast.error(res.data.message);
            setColMobile(true);
            unique = false;
          }
        })
        .catch((er) => {
          setValid(true);
          toast.dismiss(toastId);
          toast.error("Unexpected Error");
          unique = false;
        });

			// if unique
			if (unique) {
				toast.dismiss(toastId);
				props.func({
					firstName: firstName,
					lastName: lastName,
					college: college,
					year: year,
					mobile: mobile,
					otherCollege: other
				});
				props.next();
			}
		} else {
			setValid(true);
			toast.dismiss(toastId);
			props.toast("Invalid Entries");
		}
	};

  return (
    <>
      <ToastContainer />
      <div className="tw-mb-4">
        <label
          className="tw-block tw-text-gray-700 tw-text-sm tw-font-bold tw-mb-2"
          htmlFor="username"
        >
          First Name
        </label>
        <input
          placeholder="First Name"
          className=" tw-text-sm tw-shadow tw-appearance-none tw-border tw-rounded tw-w-full tw-py-2 tw-px-3 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline"
          error={colfirstName}
          onChange={handleChange}
          name="firstName"
          label="First Name"
          value={firstName}
          fullWidth
        />
        {colfirstName && (
          <p style={{ color: "#E14D2A", fontSize: "0.9rem" }}>
            First name can not be empty
          </p>
        )}

        {/* <input className=" tw-text-sm tw-shadow tw-appearance-none tw-border tw-rounded tw-w-full tw-py-2 tw-px-3 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline" id="username" type="text" placeholder="Username" /> */}
      </div>
      <div className="tw-mb-6">
        <label
          className="tw-block tw-text-gray-700 tw-text-sm tw-font-bold tw-mb-2"
          htmlFor="lastName"
        >
          Last Name
        </label>
        <input
          placeholder="Last Name"
          className=" tw-text-sm tw-shadow tw-appearance-none tw-border tw-rounded tw-w-full tw-py-2 tw-px-3 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline"
          error={collastName}
          onChange={handleChange}
          name="lastName"
          label="Last Name"
          value={lastName}
          fullWidth
        />
        {collastName && (
          <p style={{ color: "#E14D2A", fontSize: "0.9rem" }}>
            Last name can not be empty
          </p>
        )}

				{/* <input className="tw-text-sm tw-shadow tw-appearance-none tw-border tw-rounded tw-w-full tw-py-2 tw-px-3 tw-text-gray-700 tw-mb-3 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline" id="password" type="password" placeholder="******************" /> */}
				{/* <p className="tw-text-red-500 tw-text-xs tw-italic">Please choose a password.</p> */}
			</div>
			<div className="tw-mb-6">
				<Autocomplete
					disablePortal
					name="college"
					options={collegeData}
					value={college}
					onChange={(event, items) => {
						setCollege(items);
						setColCollege(false);
					}}
					renderInput={(params) => (
						<TextField
							error={colcollege}
							name="college"
							value={college}
							size="small"
							{...params}
							label="College"
						/>
					)}
				/>
				{colcollege && (
					<p style={{ color: "#E14D2A", fontSize: "0.9rem" }}>
						Select your college
					</p>
				)}
				{
					college?.value === -1 
					&&
					<div className="tw-mb-4 tw-pt-2">
						<label
							className="tw-block tw-text-gray-700 tw-text-sm tw-font-bold tw-mb-2"
							for="username"
						>
							Specify college
						</label>
						<input
							placeholder=" College name"
							className=" tw-text-sm tw-shadow tw-appearance-none tw-border tw-rounded tw-w-full tw-py-2 tw-px-3 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline"
							onChange={handleChange}
							name="other"
							label="Other college"
							value={other}
							fullWidth
						/>
					</div>
				}
			</div>
			<div className="tw-mb-4">
				<label
					className="tw-block tw-text-gray-700 tw-text-sm tw-font-bold tw-mb-2"
					for="username"
				>
					Year of Graduation
				</label>
				<input
					placeholder="eg: 2025"
					className=" tw-text-sm tw-shadow tw-appearance-none tw-border tw-rounded tw-w-full tw-py-2 tw-px-3 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline"
					error={colyear}
					onChange={handleChange}
					name="year"
					label="Graduation Year"
					value={year}
					fullWidth
				/>
				{colyear && (
					<p style={{ color: "#E14D2A", fontSize: "0.9rem" }}>
						Enter your graduation year
					</p>
				)}

        {/* <input className=" tw-text-sm tw-shadow tw-appearance-none tw-border tw-rounded tw-w-full tw-py-2 tw-px-3 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline" id="username" type="text" placeholder="Username" /> */}
      </div>
      <div className="tw-mb-6 ">
        <label
          className="tw-block tw-text-gray-700 tw-text-sm tw-font-bold tw-mb-2"
          htmlFor="username"
        >
          Mobile Number
        </label>
        <div className="flex flex-row ">
          <span className="tw-inline-flex tw-items-center tw-p-[9px] tw-text-sm tw-bg-gray-200 tw-border tw-border-r-0 tw-border-gray-300 tw-rounded-l-md">
            +91
          </span>
          <input
            type="text"
            id="website-admin"
            className=" tw-text-sm tw-shadow tw-appearance-none tw-border  tw-p-2.5 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline tw-w-52 "
            // className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600"
            placeholder="Your Mobile Number"
            onChange={handleChange}
            value={mobile}
            name="mobile"
          />
        </div>
        {/* <TextField
          fullWidth
          className="form-field"
          name="mobile"
          id="filled-basic"
          label="Mobile No."
          value={mobile}
          onChange={handleChange}
          variant="outlined"
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Typography>+91</Typography>
              </InputAdornment>
            ),
          }}
          startAdornment={<InputAdornment position="start"></InputAdornment>}
        /> */}
        {/* <Input
          className=" tw-text-sm tw-shadow tw-appearance-none tw-border tw-rounded tw-w-full tw-py-2 tw-px-3 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline"
          placeholder="+91-1234567980"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Typography variant="body1" sx={{ fontSize: 15 }} gutterBottom>
                  +91
                </Typography>
              </InputAdornment>
            ),
          }}
          error={colmobile}
          onChange={handleChange}
          name="mobile"
          label="Mobile"
          value={mobile}
          fullWidth
        /> */}
        {colmobile && (
          <p style={{ color: "#E14D2A", fontSize: "0.9rem" }}>
            Enter a valid and unique 10 digit mobile number
          </p>
        )}
      </div>
      {/* <Button
        variant="gradient"
        color="white"
        onClick={() => {
          props.prev();
        }}
      >
        Back
      </Button> */}
      {/* <div> */}
      {/* <div className="tw-flex tw-justify-end">
          <button
            className="tw-bg-sky-500 tw-px-3 tw-py-2 tw-rounded-lg tw-text-white tw-text-sm hover:tw-bg-sky-400"
            onClick={handleSubmit}
          >
            Next
          </button>
        </div> */}

      <div className="tw-flex tw-justify-between">
        <button
          className="tw-bg-gray-500 tw-px-3 tw-py-2 tw-rounded-lg tw-text-white tw-text-sm hover:tw-bg-gray-400 hover:tw-text-black"
          onClick={() => {
            props.prev();
          }}
        >
          Back
        </button>
        {valid ? (
          <button
            className="tw-bg-sky-500 tw-px-3 tw-py-2 tw-rounded-lg tw-text-white tw-text-sm hover:tw-bg-sky-400"
            onClick={handleSubmit}
            type="submit"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            className="tw-bg-sky-400 tw-px-3 tw-py-2 tw-rounded-lg tw-text-white tw-text-sm"
          >
            Next
          </button>
        )}
      </div>
    </>
  );
}

export default PersonalDetails;
