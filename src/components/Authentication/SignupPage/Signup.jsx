import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState, useEffect } from "react";
import { auth, db } from "../../../firebase/firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import "./Signup.css";
import { useNavigate } from "react-router-dom"; 

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [loading, setLoading] = useState(false); 
    const [success, setSuccess] = useState(false); 

    const navigate = useNavigate(); 

    useEffect(() => {
        if (success) {
            navigate("/homepage");
        }
    }, [success, navigate]); 

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true); 

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (user) {
                const isStaff = email.endsWith('@staffdomain.com'); 

                await setDoc(doc(db, "Users", user.uid), {
                    email: user.email,
                    firstName: fname,
                    lastName: lname,
                    role: isStaff ? "staff" : "non-staff", 
                    photo: ""
                });

                const role = isStaff ? "staff" : "non-staff";
                toast.success(`User Registered Successfully as ${role}!`, {
                    position: "top-center",
                });

                setSuccess(true);
            }
        } catch (error) {
            console.log(error.message);
            toast.error(error.message, {
                position: "bottom-center",
            });
        } finally {
            setLoading(false); 
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-inner">
                {loading ? (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <p className="loading-text">Signing you up, please wait...</p>
                    </div>
                ) : (
                    <form onSubmit={handleRegister}>
                        <h3>Create an Account</h3>

                        <div className="mb-3">
                            <label>First Name</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="First Name"
                                value={fname}
                                onChange={(e) => setFname(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label>Last Name</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Last Name"
                                value={lname}
                                onChange={(e) => setLname(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label>Email Address</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Enter Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Enter Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <p className="text-muted">
                                If you're a staff member, please sign up with your staff email address to gain access to staff privileges.
                            </p>
                        </div>

                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary">
                                Sign Up
                            </button>
                        </div>
                        <p className="forgot-password text-right">
                            Already registered? <a href="/login">Log in</a>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Register;
