import axios from "axios";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import isEmail from "validator/lib/isEmail";
import "./Auth.scss";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LockIcon from '@mui/icons-material/Lock';

import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { Paper, Stack, Typography, InputAdornment } from "@mui/material";
import { gapi } from "gapi-script";

const clientId = "624129812015-r37r08ea6qj737c9ftnsm8h32gkiiuns.apps.googleusercontent.com"

function Signup() {
    // hooks for inputs
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [altEmail, setAltEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [altMobile, setAltMobile] = useState("");
    const [password, setPassword] = useState("");

    // hooks for validation
    const [colorFirstName, setColorFirstName] = useState(false);
    const [colorLastName, setColorLastName] = useState(false);
    const [colorUserName, setColorUserName] = useState(false);
    const [colorEmail, setColorEmail] = useState(false);
    const [colorAltEmail, setColorAltEmail] = useState(false);
    const [colorMobile, setColorMobile] = useState(false);
    const [colorPassword, setColorPassword] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        function start() {
            gapi.client.init({
                clientId: clientId,
                scope: ""
            })
        }

        gapi.load('client:auth2', start);
    });

    const emailValidator = () => {
        console.log(isEmail(email));
        if (!isEmail(email)) {
            setColorEmail(true);
            return false;
        } else setColorEmail(false);
        return true;
    };

    const altEmailValidator = () => {
        if (!isEmail(altEmail)) {
            setColorAltEmail(true);
            return false;
        } else setColorAltEmail(false);
        return true;
    };

    const passwordValidator = () => {
        console.log(password);
        let regx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{6,}$/;
        if (!regx.test(password)) {
            setColorPassword(true);
            return false;
        } else setColorPassword(false);
        return true;
    };

    const mobileValidator = () => {
        let regx = /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
        if (!regx.test(mobile)) {
            setColorMobile(true);
            return false;
        } else setColorMobile(false);
        return true;
    }

    const handleInputChange = async (e) => {
        switch (e.target.name) {
            case "firstName":
                setFirstName(e.target.value);
                setColorFirstName(false);
                break;
            case "lastName":
                setLastName(e.target.value);
                setColorLastName(false);
                break;
            case "userName":
                setUserName(e.target.value);
                setColorUserName(false);
                break;
            case "email":
                setEmail(e.target.value);
                setColorEmail(false);
                break;
            case "altEmail":
                setAltEmail(e.target.value);
                setColorAltEmail(false);
                break;
            case "mobile":
                setMobile(e.target.value);
                setColorMobile(false);
                break;
            case "altMobile":
                setAltMobile(e.target.value);
                break;
            case "password":
                setPassword(e.target.value);
                setColorPassword(false);
                break;
            default:
        }
    };


    const handleValidateAndSubmit = () => {
        // all validations
        console.log(colorEmail, colorPassword, colorFirstName);
        let isEmail = emailValidator();
        let isAltEmail = altEmailValidator();
        let isPassword = passwordValidator();
        let isMobile = mobileValidator();
        if (firstName === "") setColorFirstName(true);
        if (lastName === "") setColorLastName(true);
        if (userName === "") setColorUserName(true);
        if (mobile === "") setColorMobile(true);

        if (isEmail && isPassword && firstName !== "" && lastName !== "" && userName !== "" && mobile !== "") {
            const user = {
                firstName: firstName,
                lastName: lastName,
                userName: userName,
                email: email,
                altEmail: altEmail,
                mobile: mobile,
                altMobile: altMobile,
                password: password
            };
            console.log(user);
            axios
                .post("/auth/register", user)
                .then((res) => {
                    console.log(res.data);
                    if (res.data.success)
                        navigate('/signin')
                    else{
                        toast.error(res.data.message)
                    }
                })
                .catch((er) => console.log(er));
        }
        else {
            toast.error("Invalid Entries");
        }
    };

    if (localStorage.getItem('curUser')) {
        navigate('/profile');
    }


    return (
        <>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                // Change the size to fit the parent element of this div
                width: '100%',
                height: '100%',
            }}>
                <Paper
                    sx={{ width: 350, p: 2, backgroundColor: '#fff', m: 2 }}
                >
                    <Stack
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                    >
                        <LockIcon color="primary" sx={{ fontSize: 50 }} />
                        <Typography variant="h5">Sign up </Typography>
                        <TextField
                            fullWidth
                            className="form-field"
                            name="firstName"
                            id="filled-basic"
                            label="First Name"
                            value={firstName}
                            onChange={handleInputChange}
                            variant="outlined"
                            required
                            error={colorFirstName ? 1 : 0}
                            helperText={colorFirstName ? "required" : null}
                        />

                        <TextField
                            fullWidth
                            className="form-field"
                            name="lastName"
                            id="filled-basic"
                            label="Last Name"
                            value={lastName}
                            onChange={handleInputChange}
                            variant="outlined"
                            required
                            error={colorLastName ? 1 : 0}
                            helperText={colorLastName ? "required" : null}
                        />

                        <TextField
                            fullWidth
                            className="form-field"
                            name="userName"
                            id="filled-basic"
                            label="Username"
                            value={userName}
                            onChange={handleInputChange}
                            variant="outlined"
                            required
                            error={colorUserName ? 1 : 0}
                            helperText={colorUserName ? "required" : null}
                        />

                        <TextField
                            fullWidth
                            id="standard-basic"
                            autoComplete="off"
                            name="email"
                            value={email}
                            onInput={handleInputChange}
                            label="Email"
                            variant="outlined"
                            required
                            error={colorEmail}
                            helperText={colorEmail ? "Enter a valid email" : null}
                        />

                        <TextField
                            fullWidth
                            id="standard-basic"
                            type="password"
                            autoComplete="off"
                            className={colorPassword}
                            name="password"
                            value={password}
                            onInput={handleInputChange}
                            label="Password"
                            variant="outlined"
                            required
                            error={colorPassword}
                            helperText={colorPassword ? "Invalid Password. Password must contain atleast 6 characters, one numeric, special and uppercase character" : null}
                        />

                        <TextField
                            fullWidth
                            autoComplete="off"
                            name="altEmail"
                            id="filled-basic"
                            label="Alternate-Email"
                            value={altEmail}
                            onChange={handleInputChange}
                            variant="outlined"
                            error={colorAltEmail}
                            helperText={colorAltEmail ? "Enter a valid email" : null}
                        />

                        <TextField
                            fullWidth
                            className="form-field"
                            name="mobile"
                            id="filled-basic"
                            label="Mobile No."
                            value={mobile}
                            onChange={handleInputChange}
                            variant="outlined"
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Typography>+91</Typography>
                                    </InputAdornment>
                                ),
                            }}
                            startAdornment={
                                <InputAdornment position="start">
                                </InputAdornment>
                            }
                            error={colorMobile ? 1 : 0}
                            helperText={colorMobile ? "Enter a valid 10 digit mobile number" : null}
                        />

                        <TextField
                            fullWidth
                            className="form-field"
                            name="altMobile"
                            id="filled-basic"
                            label="Alternate Mobile"
                            value={altMobile}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Typography>+91</Typography>
                                    </InputAdornment>
                                ),
                            }}
                            onChange={handleInputChange}
                            variant="outlined"
                        />
                    </Stack>
                    <Button sx={{ my: 2 }} variant="contained" onClick={handleValidateAndSubmit}>
                        Sign up
                    </Button>
                    <p className="lower-para" onClick={() => { navigate('/signin') }}>Already registered? Login</p>

                </Paper>
                <ToastContainer />
            </div>
        </>
    );
}

export default Signup;
