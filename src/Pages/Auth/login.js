import axios from 'axios'
import { GoogleLogin } from 'react-google-login'
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const clientId = "624129812015-r37r08ea6qj737c9ftnsm8h32gkiiuns.apps.googleusercontent.com"

function Login() {
    let navigate = useNavigate();
    const onSuccess = (res) => {
        console.log("LOGIN SUCCESS! Current user: ", res.profileObj)
        axios.get(`/auth/loginViaGmail?email=${res.profileObj.email}`)
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
                        altMobile: res.data.user.altMobile
                    }
                    localStorage.setItem("curUser", JSON.stringify(dataToBeStored))
                    navigate('/profile');
                }
                else {
                    toast.error(res.data.message);
                }
            })
            .catch(er => { console.log(er) });
    }

    const onFailure = (res) => {
        console.log("LOGIN FAILED! res: ", res)
    }

    return (
        <div id="signInButton">
            <GoogleLogin
                clientId={clientId}
                buttonText="Login with Google"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
            ></GoogleLogin>
            <ToastContainer />
        </div>
    )
}

export default Login;