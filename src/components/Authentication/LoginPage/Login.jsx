import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState, useEffect } from "react";
import { auth } from "../../../firebase/firebase";
import { toast } from "react-toastify";
import SignInwithGoogle from "../GoogleSignIn/SignInWithGoogle";
import "./Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                window.location.href = "/homepage";
            }
        });
        return () => unsubscribe(); 
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); 

        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("User logged in Successfully");

            
        } catch (error) {
            console.log(error.message);
            setLoading(false); 

            toast.error(error.message, {
                position: "bottom-center",
            });
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-inner">
                {loading ? (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <p className="loading-text">Loading...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <h3>Log in</h3>

                        <div className="mb-3">
                            <label>Email address</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary">
                                Submit
                            </button>
                        </div>
                        <p className="forgot-password text-right">
                            New user <a href="/register">Sign up</a>
                        </p>
                        <SignInwithGoogle />
                    </form>
                )}
            </div>
        </div>
    );
}

export default Login;
