import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../publicStyles.css';
import { auth } from '../../firebase/firebase';
import ConnectToCalendar from '../Authentication/GoogleCalendar/ConnectToCalendar';

function Header({ user, userRole }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchName, setSearchName] = useState('');
    const [searchLocation, setSearchLocation] = useState('');
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await auth.signOut();
            window.location.href = "/login";
        } catch (error) {
            console.error("Error logging out:", error.message);
        }
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const closeDropdown = () => {
        setShowDropdown(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/events?name=${encodeURIComponent(searchName)}&location=${encodeURIComponent(searchLocation)}`);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
            <div className="container-fluid">
                <Link className="navbar-brand eventure-title" to="/homepage">Eventure</Link>
    
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
    
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mx-auto"> 
                        <li className="nav-item">
                            <form className="d-flex" onSubmit={handleSearch}>
                                <input
                                    className="form-control me-2"
                                    type="search"
                                    placeholder="Search by name"
                                    aria-label="Search by name"
                                    value={searchName}
                                    onChange={(e) => setSearchName(e.target.value)}
                                />
                                <input
                                    className="form-control me-2"
                                    type="search"
                                    placeholder="Search by location"
                                    aria-label="Search by location"
                                    value={searchLocation}
                                    onChange={(e) => setSearchLocation(e.target.value)}
                                />
                                <button
                                    className="btn btn-custom"
                                    type="submit"
                                >
                                    Search
                                </button>

                            </form>
                        </li>
                    </ul>
    
                    <ul className="navbar-nav ms-auto">
                        {!user && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/events">Events</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Log In</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">Sign Up</Link>
                                </li>
                            </>
                        )}
    
                        {user && (
                            <>
                                {userRole === "staff" && (
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/create-event">
                                            <span className="me-1">+</span> Create Event
                                        </Link>
                                    </li>
                                )}
                                <li
                                    className="nav-item dropdown"
                                    onMouseEnter={toggleDropdown}
                                    onMouseLeave={closeDropdown}
                                >
                                    <div className="nav-link dropdown-toggle d-flex align-items-center" id="userDropdown" role="button" aria-expanded="false">
                                        <img
                                            src={`${process.env.PUBLIC_URL}/google_avatar.png`}
                                            alt="User Icon"
                                            className="user-icon rounded-circle me-2"
                                        />
                                        {user.email}
                                    </div>
    
                                    {showDropdown && (
                                        <ul className="dropdown-menu dropdown-menu-end show" aria-labelledby="userDropdown">
                                            <li>
                                                <ConnectToCalendar className="dropdown-item"/>
                                            </li>
                                            <li>
                                                <hr className="dropdown-divider" />
                                            </li>
                                            <li>
                                                <Link className="dropdown-item" to="/events">Browse Events</Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item" to="/user-events">Manage My Events</Link>
                                            </li>
                                            <li>
                                                <hr className="dropdown-divider" />
                                            </li>
                                            <li>
                                                <button className="dropdown-item" onClick={handleLogout}>Log Out</button>
                                            </li>
                                            
                                        </ul>
                                    )}
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
    
}

export default Header;
