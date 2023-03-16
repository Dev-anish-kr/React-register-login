import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
const LOGIN_URL = "/login"

const Login = () => {
    const { setAuth } = useAuth();
    const Navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";


    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState("");
    const [pwd, setpwd] = useState("");
    const [errMsz, setErrMsz] = useState("");

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsz("");
    }, [pwd, user]);

    const handleSubmit = async (e) => {
        e.preventDefault();


        try {
            const response = await axios.post(LOGIN_URL, JSON.stringify({ user, pwd }), {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            }
            );

            console.log(JSON.stringify(response));
            const accessToken = response?.data?.accessToken;
            const roles = response.data.roles;
            setAuth({ user, pwd, roles, accessToken });
            setUser("");
            setpwd("");
            Navigate(from, { replace: true });
        } catch (error) {
            if (!error.response) {
                setErrMsz("No server Response");
            } else if (error.response?.status === 400) {
                setErrMsz("Missing Username or Password");
            } else if (error.response?.status === 401) {
                setErrMsz("Unauthorised");
            } else {
                setErrMsz("Login Faild");
            }
            errRef.current.focus();
        }


    }


    return (

        <section>

            <p ref={errRef} className={errMsz ? "errmsz" : "offscreen"} aria-live="assertive">{errMsz}</p>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => {
                        setUser(e.target.value);
                    }}
                    value={user}
                    required
                />

                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    onChange={(e) => {
                        setpwd(e.target.value);
                    }}
                    value={pwd}
                    required
                />
                <button>Sign In</button>
            </form>
            <p>Need an Account?<br />
                <span className="line">
                    <a href="#">Sign Up</a>
                </span>
            </p>
        </section>
    )
}

export default Login