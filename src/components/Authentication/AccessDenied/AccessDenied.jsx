import React from 'react';

function AccessDenied() {

    const handleGoHome = () => {
        window.location.href = "/homepage";  
    };

    return (
        <div className="container mt-5">
        <h3 className="text-center text-danger">Access Denied</h3>
        <p className="text-center">
            You do not have permission to access this page. Please contact a staff admin to request access.
        </p>
        <div className="text-center mt-3">
            <button className="btn btn-primary" onClick={handleGoHome}>
            Return to Homepage
            </button>
        </div>
        </div>
    );
}

export default AccessDenied;

