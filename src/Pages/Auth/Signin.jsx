import axios from "axios";
import React from "react";
import isEmail from "validator/lib/isEmail";
import { useState } from "react";
import "./Auth.scss";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Login from "./login";
import { Paper, Stack, Typography } from "@mui/material";

function Signin() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [colorEmail, setColorEmail] = useState(false);
    const [colorPassword, setColorPassword] = useState(false);

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        switch (e.target.name) {
            case "email":
                setEmail(e.target.value);
                break;
            case "password":
                setPassword(e.target.value);
                break;
            default:
        }
    }

    const handleSubmit = () => {
        const user = {
            email: email,
            password: password
        }
        console.log(user)
        axios.post('/auth/login', user)
            .then(res => {
                console.log(res.data);
                if (res.data.success) {
                    let dataToBeStored = {
                        firstName: res.data.user.firstName,
                        lastName: res.data.user.lastName,
                        userName: res.data.user.userName,
                        email: res.data.user.email,
                        altEmail: res.data.user.altEmail,
                        mobile: res.data.user.mobile,
                        altMobile: res.data.user.altMobile,
                        token: res.data.token
                    }
                    localStorage.setItem("curUser", JSON.stringify(dataToBeStored))
                    navigate('/profile');
                }
                else {
                    toast.error(res.data.message);
                }
            })
            .catch(er => console.log(er));
    }

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
                width: '100%',
                height: '100%',
            }}>
                <Paper
                    sx={{ minWidth: 350, p: 3, backgroundColor: '#fff', m: 2 }}
                >
                    <Stack
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                    >
                        <LockIcon sx={{ fontSize: 50, color: '#4285F4' }} />
                        <Typography variant="h5">Sign in </Typography>
                        <Login />
                        <TextField
                            fullWidth
                            id="standard-basic"
                            autoComplete="off"
                            name="email"
                            value={email}
                            onInput={handleInputChange}
                            label="Email"
                            variant="outlined"
                            sx={{ my: 2 }}
                            required
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
                            sx={{ my: 2 }}
                            required
                        />
                    </Stack>
                    <Button sx={{ my: 2 }} variant="contained" onClick={handleSubmit}>
                        Sign in
                    </Button>
                    <p className="lower-para" onClick={() => { navigate('/signup') }}>New to TMES? Create an account</p>
                </Paper>
            </div>

            <ToastContainer />
        </>
    )
}

export default Signin;