import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useAuthState } from "react-firebase-hooks/auth";
import { useLocation } from 'react-router-dom';
import './EventList.css';
import EventModal from '../EventModal/EventModal';

function EventList() {
    const [events, setEvents] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [user] = useAuthState(auth);
    const [userRole, setUserRole] = useState('');
    const location = useLocation();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const searchParams = new URLSearchParams(location.search);
                const searchName = searchParams.get('name')?.toLowerCase() || '';
                const searchLocation = searchParams.get('location')?.toLowerCase() || '';

                const eventsCollection = collection(db, 'Events');
                const eventSnapshot = await getDocs(eventsCollection);
                let eventList = eventSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                if (searchName) {
                    eventList = eventList.filter(event =>
                        event.title.toLowerCase().includes(searchName)
                    );
                }

                if (searchLocation) {
                    eventList = eventList.filter(event =>
                        event.location.toLowerCase().includes(searchLocation)
                    );
                }

                setEvents(eventList);
                setLoadingEvents(false);

                const selectedEventId = location.state?.selectedEventId;
                if (selectedEventId) {
                    const eventToOpen = eventList.find(event => event.id === selectedEventId);
                    if (eventToOpen) {
                        setSelectedEvent(eventToOpen);
                    }
                }
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, [location]);

    useEffect(() => {
        const fetchUserRole = async () => {
            if (user) {
                const userDoc = await getDocs(collection(db, "Users"));
                const userData = userDoc.docs.find(doc => doc.data().email === user.email)?.data();
                setUserRole(userData?.role || 'non-staff');
            }
        };
        fetchUserRole();
    }, [user]);

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

    if (loadingEvents) {
        return <div className="loading-spinner"><div className="spinner"></div><p>Loading events...</p></div>;
    }

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Upcoming Events</h2>
            <div className="row">
                {events.length > 0 ? (
                    events.map((event) => (
                        <div key={event.id} className="col-md-6 col-lg-4 mb-4">
                            <div className="card h-100 shadow-sm">
                                <img
                                    src={event.imageUrl || 'https://via.placeholder.com/400x200'}
                                    className="card-img-top"
                                    alt={event.title}
                                />
                                <div className="card-body">
                                    <h5 className="card-title text-primary">{event.title}</h5>
                                    <p className="card-text"><strong>Date:</strong> {event.date}</p>
                                    <p className="card-text"><strong>Time:</strong> {event.time}</p>
                                    <p className="card-text"><strong>Location:</strong> {event.location}</p>
                                    <button 
                                        onClick={() => handleViewDetails(event)} 
                                        className="btn view-details-btn mt-3"
                                    >
                                        View Details
                                    </button>

                                </div>
                                <div className="card-footer text-muted">
                                    <small>Posted on {event.createdAt ? event.createdAt.toDate().toLocaleDateString() : 'Unknown Date'}</small>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center">No events found matching your search criteria.</p>
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

export default EventList;
