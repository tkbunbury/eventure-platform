import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebase/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import './UserEvents.css'; 
import EventModal from '../EventModal/EventModal';

function UserEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null); 
    const [user] = useAuthState(auth);
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const fetchUserRole = async () => {
            if (user) {
                const userDoc = await getDocs(collection(db, 'Users'));
                const userData = userDoc.docs.find(doc => doc.data().email === user.email)?.data();
                setUserRole(userData?.role || 'non-staff');
            }
        };
        fetchUserRole();
    }, [user]);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                if (!user) return;

                let eventsQuery;
                if (userRole === 'staff') {
                    eventsQuery = query(collection(db, 'Events'), where('createdBy', '==', user.uid));
                } else {
                    const signupsQuery = query(collection(db, 'Signups'), where('userId', '==', user.uid));
                    const signupSnapshot = await getDocs(signupsQuery);
                    const eventIds = signupSnapshot.docs.map(doc => doc.data().eventId);

                    if (eventIds.length === 0) {
                        setEvents([]);
                        setLoading(false);
                        return;
                    }

                    eventsQuery = query(collection(db, 'Events'), where('__name__', 'in', eventIds));
                }

                const eventsSnapshot = await getDocs(eventsQuery);
                const eventsList = eventsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setEvents(eventsList);
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [user, userRole]);

    const handleViewDetails = (event) => {
        setSelectedEvent(event);
    };

    const handleCloseModal = () => {
        setSelectedEvent(null);
    };

    const handleEventDeleted = (eventId) => {
        setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
        handleCloseModal();
    };

    if (loading) {
        return <div className="loading-spinner"><div className="spinner"></div><p>Loading events...</p></div>;
    }

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">{userRole === 'staff' ? 'Events Created' : 'Events Signed Up For'}</h2>
            <div className="row">
                {events.length > 0 ? (
                    events.map(event => (
                        <div key={event.id} className="col-md-4 mb-3">
                            <div className="card">
                                <img src={event.imageUrl || 'https://via.placeholder.com/150'} className="card-img-top" alt={event.title} />
                                <div className="card-body">
                                    <h5 className="card-title">{event.title}</h5>
                                    <p className="card-text">{event.description}</p>
                                    <p><strong>Date:</strong> {event.date}</p>
                                    <p><strong>Time:</strong> {event.time}</p>
                                    <p><strong>Location:</strong> {event.location}</p>
                                    <button onClick={() => handleViewDetails(event)} className="btn view-details-btn mt-3">View Details</button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center">No events found.</p>
                )}
            </div>

            {selectedEvent && (
                <EventModal
                    selectedEvent={selectedEvent}
                    user={user}
                    userRole={userRole}
                    onClose={handleCloseModal}
                    onEventDeleted={handleEventDeleted}
                />
            )}
        </div>
    );
}

export default UserEvents;
