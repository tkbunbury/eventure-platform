import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import './EventModal.css';
import SignupEvent from '../EventSignup/SignupEvent'; 
import DeleteEventButton from '../EventRemoval/DeleteEvent'; 

function EventModal({ selectedEvent, user, userRole, onClose, onEventDeleted }) {
    const [loadingSignupStatus, setLoadingSignupStatus] = useState(true);
    const [alreadySignedUp, setAlreadySignedUp] = useState(false);
    const [isFeatured, setIsFeatured] = useState(selectedEvent.isFeatured || false); 
    const [loadingFeature, setLoadingFeature] = useState(false); 

    useEffect(() => {
        const checkUserSignup = async () => {
            setLoadingSignupStatus(true);
            if (user && userRole === 'non-staff') {
                const signupsCollection = collection(db, "Signups");
                const q = query(signupsCollection, where("userId", "==", user.uid), where("eventId", "==", selectedEvent.id));
                const querySnapshot = await getDocs(q);
                setAlreadySignedUp(!querySnapshot.empty);
            }
            setLoadingSignupStatus(false);
        };

        checkUserSignup();
    }, [user, selectedEvent, userRole]);

    
    const handleFeatureChange = async (e) => {
        const isChecked = e.target.checked;
        setLoadingFeature(true);
        try {
            if (isChecked) {
                const eventsCollection = collection(db, 'Events');
                const q = query(eventsCollection, where('isFeatured', '==', true));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.size >= 3) {
                    alert('You can only feature up to 3 events.');
                    setLoadingFeature(false);
                    return;
                }
            }

            const eventDocRef = doc(db, 'Events', selectedEvent.id);
            await updateDoc(eventDocRef, { isFeatured: isChecked });

            setIsFeatured(isChecked);
            setLoadingFeature(false);
        } catch (error) {
            console.error('Error updating feature status:', error.message);
            setLoadingFeature(false);
            alert('Failed to update feature status. Please try again.');
        }
    };

    if (!selectedEvent) return null;

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{selectedEvent.title}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {selectedEvent.imageUrl && (
                            <img
                                src={selectedEvent.imageUrl}
                                alt={selectedEvent.title}
                                className="img-fluid mb-3"
                                style={{ maxHeight: '300px', objectFit: 'cover', width: '100%' }}
                            />
                        )}
                        <p>{selectedEvent.description}</p>
                        <p><strong>Date:</strong> {selectedEvent.date}</p>
                        <p><strong>Time:</strong> {selectedEvent.time}</p>
                        <p><strong>Location:</strong> {selectedEvent.location}</p>

                        {userRole === 'staff' && (
                            <div className="form-check mt-3">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="featureCheckbox"
                                    checked={isFeatured}
                                    onChange={handleFeatureChange}
                                    disabled={loadingFeature}
                                />
                                <label className="form-check-label" htmlFor="featureCheckbox">
                                    {loadingFeature ? 'Updating...' : 'Feature this event'}
                                </label>
                            </div>
                        )}
                    </div>
                    <div className="modal-footer">
                        {loadingSignupStatus ? (
                            <div className="loading-spinner">
                                <div className="spinner"></div>
                                <p>Loading...</p>
                            </div>
                        ) : userRole === 'staff' ? (
                            <DeleteEventButton eventId={selectedEvent.id} onEventDeleted={onEventDeleted} />
                        ) : (
                            <SignupEvent
                                user={user}
                                eventId={selectedEvent.id}
                                isSignedUp={alreadySignedUp}
                                eventDetails={selectedEvent}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventModal;

