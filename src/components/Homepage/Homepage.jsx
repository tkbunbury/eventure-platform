import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/firebase'; 
import { collection, query, where, getDocs } from 'firebase/firestore'; 
import './Homepage.css'; 

function Homepage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); 
    const [featuredEvents, setFeaturedEvents] = useState([]); 

    useEffect(() => {
        const fetchFeaturedEvents = async () => {
            try {
                const eventsCollection = collection(db, 'Events');
                const q = query(eventsCollection, where('isFeatured', '==', true)); 
                const querySnapshot = await getDocs(q);
                const eventsList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setFeaturedEvents(eventsList);
            } catch (error) {
                console.error('Error fetching featured events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedEvents();
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div>
        <section className="hero-section text-center text-white">
            <div className="container">
            <h1 className="display-3">Discover Worldwide Events</h1>
            <p className="lead">Join events happening around you, or across the globe!</p>
            <button
                onClick={() => navigate('/events')}
                className="btn btn-primary btn-lg rounded-pill px-4 shadow-lg custom-button"
                style={{ background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,121,184,1) 35%, rgba(0,212,255,1) 100%)', border: 'none' }}
            >
                <i className="bi bi-calendar-event-fill me-2"></i> Explore Events
            </button>

            </div>
        </section>

        <section className="container my-5">
            <h2 className="text-center mb-4">Featured Events</h2>
            <div className="row">
                {featuredEvents.length > 0 ? (
                    featuredEvents.map(event => (
                        <div key={event.id} className="col-md-4 mb-3">
                            <div className="card">
                                <img
                                    src={event.imageUrl || 'https://via.placeholder.com/150'}
                                    className="card-img-top"
                                    alt={event.title}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{event.title}</h5>
                                    <p className="card-text">{event.description}</p>
                                    <button
                                        onClick={() => navigate('/events', { state: { selectedEventId: event.id } })}
                                        className="btn btn-info learn-more-button"
                                    >
                                        Learn More
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center">No featured events available at the moment.</p>
                )}
            </div>
        </section>
        </div>
    );
}

export default Homepage;


