import React, { useEffect, useState } from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"; 
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { gapi } from "gapi-script";  

import Login from "./components/Authentication/LoginPage/Login";
import SignUp from "./components/Authentication/SignupPage/Signup";
import Homepage from "./components/Homepage/Homepage";
import CreateEvent from "./components/CreateEvent/CreateEvent";
import EventList from "./components/EventList/EventList";
import UserEvents from './components/UserEvents/UserEvents';
import AccessDenied from "./components/Authentication/AccessDenied/AccessDenied";
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner'; 
import Header from "./components/Header/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { auth, db } from "./firebase/firebase";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { refreshTokenIfNeeded } from "./utils/TokenRefresh"; 

function App() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function start() {
      gapi.client.init({
        apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
        scope: "https://www.googleapis.com/auth/calendar.events",
      }).then(() => {
        const authInstance = gapi.auth2.getAuthInstance();

        authInstance.currentUser.listen((user) => {
          if (user.isSignedIn()) {
            refreshTokenIfNeeded(user.getId());
          }
        });

        const tokenRefreshInterval = setInterval(() => {
          if (user) refreshTokenIfNeeded(user.uid);
        }, 300000); 

        return () => clearInterval(tokenRefreshInterval);
      });
    }

    gapi.load("client:auth2", start);
  }, [user]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userRef = doc(db, "Users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUser(user);
          setUserRole(userData.role);
        } else {
          const userData = {
            email: user.email,
            firstName: user.displayName ? user.displayName.split(" ")[0] : "",
            lastName: user.displayName ? user.displayName.split(" ")[1] : "",
            photo: user.photoURL || "",
            role: "non-staff",
          };

          await setDoc(userRef, userData);
          setUser(user);
          setUserRole(userData.role);
        }
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
}

  return (
    <Router>
      <Header user={user} userRole={userRole} />
      <div className="App">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/homepage" /> : <Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/user-events" element={<UserEvents />} />
          <Route
            path="/create-event"
            element={
              user ? (
                userRole === "staff" ? (
                  <CreateEvent />
                ) : (
                  <AccessDenied />
                )
              ) : (
                <Navigate to="/homepage" />
              )
            }
          />
          <Route path="/events" element={<EventList />} />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;