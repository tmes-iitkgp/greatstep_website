import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { GoogleLogout } from "react-google-login";

const clientId = "624129812015-r37r08ea6qj737c9ftnsm8h32gkiiuns.apps.googleusercontent.com"

function Logout() {
    let navigate = useNavigate();
    const onSuccess = () => {
        console.log("Log Out Successful");
        localStorage.clear();
        navigate('/signin')
    }
    const onFail = (e) => {
        console.log(e)
        localStorage.clear();
    }

    return (
        <div id="signInButton" onClick={onSuccess}>
            <GoogleLogout
                clientId={clientId}
                render={renderProps => (
                    <Button sx={{ m: 2 }} onClick={renderProps.onClick} variant="contained">
                        Logout
                    </Button>
                )}
                buttonText="Logout"
                onLogoutSuccess={onSuccess}
                onFailure={onFail}
            ></GoogleLogout>
        </div>
    )
}

export default Logout;