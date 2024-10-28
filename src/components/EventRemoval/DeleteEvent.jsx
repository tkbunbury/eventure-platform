import React, { useState } from 'react';
import { db } from '../../firebase/firebase'; 
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';

function DeleteEventButton({ eventId, onEventDeleted }) {
    const [loading, setLoading] = useState(false);

    const handleDeleteEvent = async () => {
        if (!window.confirm("Are you sure you want to delete this event and all associated signups?")) {
            return;
        }

        setLoading(true);

        try {
            const signupsCollectionRef = collection(db, 'Signups');
            const q = query(signupsCollectionRef, where('eventId', '==', eventId));
            const querySnapshot = await getDocs(q);

            const deleteSignupPromises = querySnapshot.docs.map((signupDoc) => {
                return deleteDoc(doc(db, 'Signups', signupDoc.id)); 
            });
            await Promise.all(deleteSignupPromises); 

            await deleteDoc(doc(db, 'Events', eventId));

            toast.success('Event and associated signups successfully deleted!', {
                position: 'top-center',
            });
            onEventDeleted(eventId);

        } catch (error) {
            console.error('Error deleting event or signups:', error);
            toast.error('Failed to delete the event. Please try again.', {
                position: 'bottom-center',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <button 
            onClick={handleDeleteEvent}
            disabled={loading}
            className="btn btn-danger"
        >
            {loading ? 'Deleting...' : 'Delete Event'}
        </button>
    );
}

export default DeleteEventButton;
