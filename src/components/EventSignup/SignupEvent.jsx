import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { db } from '../../firebase/firebase'; 
import { collection, addDoc, getDocs, getDoc, query, where, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify'; 
import { addEventToGoogleCalendar, removeEventFromGoogleCalendar } from '../../utils/googleCalendarUtils'; 
import "./SignupEvent.css"

function SignupEvent({ user, eventId, isSignedUp: initialSignedUpStatus, eventDetails }) {
    const navigate = useNavigate(); 
    const [loading, setLoading] = useState(false);
    const [calendarLoading, setCalendarLoading] = useState(true);
    const [isSignedUp, setIsSignedUp] = useState(initialSignedUpStatus); 
    const [calendarEventId, setCalendarEventId] = useState(null);
    const [signupId, setSignupId] = useState(null); 
    const [isGmailUser, setIsGmailUser] = useState(false); 
    const [accessToken, setAccessToken] = useState(null);  

    useEffect(() => {
        if (user && user.email.endsWith('@gmail.com')) {
            setIsGmailUser(true);
        } else {
            setIsGmailUser(false);
        }
    }, [user]);

    useEffect(() => {
        const fetchAccessToken = async () => {
            if (user) {
                try {
                    const userDocRef = doc(db, 'Users', user.uid);
                    const userDoc = await getDoc(userDocRef);
    
                    if (userDoc.exists() && userDoc.data().tokens) {
                        setAccessToken(userDoc.data().tokens.access_token);
                    } else {
                        console.error("Access token not found in user's document.");
                        setAccessToken(null);
                    }
                } catch (error) {
                    console.error('Error retrieving access token:', error.message);
                }
            }
        };
    
        fetchAccessToken();
    }, [user]);  
    

    useEffect(() => {
        const fetchSignupId = async () => {
            if (user && isSignedUp) {
                try {
                    const signupsCollectionRef = collection(db, 'Signups');
                    const q = query(signupsCollectionRef, where('userId', '==', user.uid), where('eventId', '==', eventId));
                    const querySnapshot = await getDocs(q);

                    if (!querySnapshot.empty) {
                        const signupDoc = querySnapshot.docs[0];  
                        setSignupId(signupDoc.id);  
                    }
                } catch (error) {
                    console.error('Error retrieving signup ID:', error.message);
                }
            }
        };

        fetchSignupId();
    }, [user, isSignedUp, eventId]);


    useEffect(() => {
        const fetchCalendarId = async () => {
            if (user && isSignedUp) {
                try {
                    const signupsCollectionRef = collection(db, 'Signups');
                    const q = query(signupsCollectionRef, where('userId', '==', user.uid), where('eventId', '==', eventId));
                    const querySnapshot = await getDocs(q);

                    if (!querySnapshot.empty) {
                        const signupDoc = querySnapshot.docs[0];  
                        const signupData = signupDoc.data()
                        setCalendarEventId(signupData.googleCalendarEventId);  
                        
                    }
                } catch (error) {
                    console.error('Error retrieving signup ID:', error.message);
                } finally {
                    setCalendarLoading(false);
                }
            } else {
                setCalendarLoading(false);
            }
        };

        fetchCalendarId();
    }, [user, isSignedUp, eventId]);

    
    const handleSignup = async () => {
        if (!user) {
            navigate('/register');
            return;
        }

        setLoading(true);
        try {
            const signupsCollectionRef = collection(db, 'Signups');
            const signupDocRef = await addDoc(signupsCollectionRef, {
                userId: user.uid,
                eventId: eventId,
                signedUpAt: new Date(),
            });

            setSignupId(signupDocRef.id)

            toast.success('Successfully signed up for the event!', {
                position: 'top-center',
            });
            setIsSignedUp(true); 
        } catch (error) {
            console.error('Error signing up for event:', error.message);
            toast.error('Failed to sign up. Please try again.', {
                position: 'bottom-center',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUnregister = async () => {
        setLoading(true);
        try {
            const signupsCollectionRef = collection(db, 'Signups');
            const q = query(signupsCollectionRef, where('userId', '==', user.uid), where('eventId', '==', eventId));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach(async (signupDoc) => {
                await deleteDoc(doc(db, 'Signups', signupDoc.id));
            });

            toast.success('Successfully unregistered from the event!', {
                position: 'top-center',
            });
            setIsSignedUp(false); 
            setSignupId(null);
        } catch (error) {
            console.error('Error unregistering from event:', error.message);
            toast.error('Failed to unregister. Please try again.', {
                position: 'bottom-center',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAddToGoogleCalendar = async () => {
        setLoading(true);
        try {          
            if(signupId && accessToken) {
                const googleCalendarId = await addEventToGoogleCalendar(eventDetails, accessToken); 
                
                const signupDocRef = doc(db, 'Signups', signupId);
                await updateDoc(signupDocRef, { googleCalendarEventId: googleCalendarId });
                setCalendarEventId(googleCalendarId); 
                toast.success('Event added to Google Calendar!', {
                    position: 'top-center',
                });          
            } else {
                toast.error('Signup ID not found. Please try again.', { position: 'bottom-center' });
            }          
        } catch (error) {
            console.error('Error adding to Google Calendar:', error.message);
            toast.error('Failed to add event to Google Calendar. Please try again.', {
                position: 'bottom-center',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFromGoogleCalendar = async () => {
        setLoading(true);
        try {
            await removeEventFromGoogleCalendar(calendarEventId); 
            const signupDocRef = doc(db, 'Signups', signupId);
            await updateDoc(signupDocRef, { googleCalendarEventId: null });
            toast.success('Event removed from Google Calendar!', {
                position: 'top-center',
            });

            setCalendarEventId(null)
        } catch (error) {
            console.error('Error removing event from Google Calendar: ', error);
            toast.error('Failed to remove event from Google Calendar. Please try again.', {
                position: 'bottom-center',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-event-buttons d-flex flex-column gap-3 align-items-center">
            {isSignedUp ? (
                <>
                    <button
                        onClick={handleUnregister}
                        disabled={loading}
                        className={`btn btn-danger custom-btn ${loading ? 'btn-loading' : ''}`}
                    >
                        {loading ? 'Unregistering...' : 'Unregister'}
                    </button>
                    <button type="button" className="btn btn-success custom-btn" disabled>
                        Already Signed Up
                    </button>
                    {calendarLoading ? (
                        <div className="loading-spinner">Loading...</div>
                    ) : isGmailUser && (
                        <div className="d-flex flex-column gap-2 align-items-center">
                            {calendarEventId ? (
                                <button
                                    type="button"
                                    onClick={handleRemoveFromGoogleCalendar}
                                    className={`btn btn-warning custom-btn ${loading ? 'btn-loading' : ''}`}
                                    disabled={loading}
                                >
                                    {loading ? 'Removing from Calendar...' : 'Remove from Google Calendar'}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleAddToGoogleCalendar}
                                    className={`btn btn-primary custom-btn ${loading ? 'btn-loading' : ''}`}
                                    disabled={loading}
                                >
                                    {loading ? 'Adding to Calendar...' : 'Add to Google Calendar'}
                                </button>
                            )}
                        </div>
                    )}
                </>
            ) : (
                <button
                    onClick={handleSignup}
                    disabled={loading}
                    className={`btn btn-primary custom-btn ${loading ? 'btn-loading' : ''}`}
                >
                    {loading ? 'Signing Up...' : 'Sign Up for Event'}
                </button>
            )}
        </div>
    );
    
    
}

export default SignupEvent;
