import React, { useEffect } from 'react';
import { getUserId } from '../../../utils/AuthHelpers';


function ConnectToCalendar() {

    const google = window.google

    useEffect(() => {
        if (typeof google === 'undefined') {
            console.error("Google API script is not loaded.");
        }
    }, [google]);
    
    async function requestCalendarAccess() {
        if (typeof google === 'undefined') {
            console.error("Google API not available.");
            return;
        }
        const userId = await getUserId(); 
        const client = google.accounts.oauth2.initCodeClient({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            scope: 'https://www.googleapis.com/auth/calendar.events',
            access_type: 'offline',
            ux_mode: 'popup',
            callback: (response) => {
                if (response.code) {
                    const sendCodeToBackend = async () => {
                        try {
                            const res = await fetch('https://exchangecodefortokens-sxxqetowla-uc.a.run.app', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    code: response.code,
                                    userId: userId, 
                                }),
                            });
                            
                            if (res.ok) {
                                console.log("Tokens saved successfully.");
                            } else {
                                console.error("Failed to exchange code for tokens.");
                            }
                        } catch (error) {
                            console.error("Error sending code to backend:", error);
                        }
                    };
                    sendCodeToBackend();

                } else {
                    console.error("Failed to get authorization code.");
                }
            },
        });
        client.requestCode();
    }

    return (
        <button onClick={requestCalendarAccess}>
            Connect to Google Calendar
        </button>
    );
}

export default ConnectToCalendar;
