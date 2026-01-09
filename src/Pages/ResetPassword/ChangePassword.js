import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import isStrongPassword from "validator/lib/isStrongPassword";

export const ChangePassword = () => {
	const [password, setPassword] = useState("");
	const [cpassword, setCpassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [validationErrors, setValidationErrors] = useState({});

	const { email, token } = useParams();

	const navigate = useNavigate();

	console.log("ChangePassword component loaded with:", { email, tokenPresent: !!token });

	// Validate password requirements
	const validatePassword = (password) => {
		const errors = {};

		if (!password) {
			errors.required = "Password is required";
		} else {
			if (password.length < 6) errors.length = "Password must be at least 6 characters";
			if (!/[a-z]/.test(password)) errors.lowercase = "Missing lowercase letter";
			if (!/[A-Z]/.test(password)) errors.uppercase = "Missing uppercase letter";
			if (!/[0-9]/.test(password)) errors.number = "Missing number";
		}

		return errors;
	};

	const handleSubmit = () => {
		console.log("Attempting to change password");

		// Clear previous errors
		setValidationErrors({});

		// Validate password
		const pwdErrors = validatePassword(password);

		if (Object.keys(pwdErrors).length > 0) {
			setValidationErrors(pwdErrors);
			const errorMsg = Object.values(pwdErrors).join(". ");
			toast.error(errorMsg);
			return;
		}

		if (password !== cpassword) {
			toast.error("Passwords do not match");
			return;
		}

		setIsLoading(true);
		const tl = toast.loading("Please wait...");

		console.log("Sending change password request");

		axios
			.put("/auth/changePassword", {
				email: email,
				newPassword: password,
				token: token,
			})
			.then((res) => {
				setIsLoading(false);
				toast.dismiss(tl);

				if (res.data.success) {
					console.log("Password changed successfully");
					toast.success("Password changed successfully");

					// Short delay for the success message to be seen
					setTimeout(() => {
						navigate("/signin", {
							state: { x: "Password changed successfully" },
						});
					}, 1500);
				} else {
					console.log("Password change failed:", res.data.message);
					toast.error(res.data.message);
				}
			})
			.catch((err) => {
				console.error("Password change error:", err);
				setIsLoading(false);
				toast.dismiss(tl);
				toast.error("Server unreachable");
			});
	};

	// Display password requirements and validation state
	const renderPasswordRequirements = () => {
		if (!password) return null;

		return (
			<div className="tw-text-xs tw-mt-1 tw-mb-3">
				<p className="tw-font-semibold">Password requirements:</p>
				<ul className="tw-list-disc tw-pl-5">
					<li className={password.length >= 6 ? "tw-text-green-500" : "tw-text-red-500"}>
						At least 6 characters
					</li>
					<li className={/[a-z]/.test(password) ? "tw-text-green-500" : "tw-text-red-500"}>
						One lowercase letter
					</li>
					<li className={/[A-Z]/.test(password) ? "tw-text-green-500" : "tw-text-red-500"}>
						One uppercase letter
					</li>
					<li className={/[0-9]/.test(password) ? "tw-text-green-500" : "tw-text-red-500"}>
						One number
					</li>
				</ul>
			</div>
		);
	};

	return (
		<>
			<ToastContainer />
			<div className="tw-w-full tw-mx-auto tw-my-10 tw-max-w-xs">
				<div className="tw-h-24 tw-bg-blue-500 tw-rounded-t-lg">
					<p className=" tw-text-2xl tw-font-bold tw-text-white tw-text-center tw-pt-8 ">
						New Password
					</p>
				</div>
				<form className="tw-bg-white tw-shadow-md  tw-rounded-b-lg tw-px-8 tw-pt-6 tw-pb-8 tw-mb-4">
					<div className="tw-mb-4">
						<label
							className="tw-block tw-text-gray-700 tw-text-sm tw-font-bold tw-mb-2"
							htmlFor="username"
						>
							New Password
						</label>
						<input
							className="tw-shadow tw-appearance-none tw-border tw-rounded tw-w-full tw-py-2 tw-px-3 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline"
							type="password"
							placeholder="len 6, A, a, 1"
							value={password}
							onChange={(e) => {
								setPassword(e.target.value);
							}}
						/>
					</div>
					{renderPasswordRequirements()}
					<div className="tw-mb-4">
						<label
							className="tw-block tw-text-gray-700 tw-text-sm tw-font-bold tw-mb-2"
							htmlFor="username"
						>
							Confirm Password
						</label>
						<input
							className="tw-shadow tw-appearance-none tw-border tw-rounded tw-w-full tw-py-2 tw-px-3 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline"
							id="username"
							type="password"
							placeholder="Confirm password"
							value={cpassword}
							onChange={(e) => {
								setCpassword(e.target.value);
							}}
						/>
					</div>
					<div className="tw-flex tw-items-center tw-justify-between">
						<button
							className="tw-bg-blue-500 hover:tw-bg-blue-700 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-rounded focus:tw-outline-none focus:tw-shadow-outline"
							type="button"
							disabled={isLoading}
							onClick={handleSubmit}
						>
							{isLoading ? "Processing..." : "Reset"}
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
