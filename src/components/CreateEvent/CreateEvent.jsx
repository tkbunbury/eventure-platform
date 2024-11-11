// import React, { useState } from 'react';
// import './CreateEvent.css';
// import { db, auth, storage } from '../../firebase/firebase'; 
// import { collection, addDoc } from 'firebase/firestore';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
// import { toast } from 'react-toastify';
// import { useAuthState } from "react-firebase-hooks/auth";

// function CreateEvent() {
//     const [title, setTitle] = useState('');
//     const [description, setDescription] = useState('');
//     const [date, setDate] = useState('');
//     const [time, setTime] = useState('');
//     const [location, setLocation] = useState('');
//     const [image, setImage] = useState(null); 
//     const [loading, setLoading] = useState(false);
//     const [user] = useAuthState(auth);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true)
//         if (!image) {
//             toast.error('Please select an image for the event.', {
//                 position: 'bottom-center',
//             });
//             return;
//         }

//         try {
//             const imageRef = ref(storage, `eventImages/${image.name}`);
//             await uploadBytes(imageRef, image);
//             const imageUrl = await getDownloadURL(imageRef);

//             const eventsCollectionRef = collection(db, 'Events');
//             await addDoc(eventsCollectionRef, {
//                 title,
//                 description,
//                 date,
//                 time,
//                 location,
//                 imageUrl, 
//                 createdAt: new Date(),
//                 createdBy: user.uid
//             });

//             toast.success('Event created successfully!', {
//                 position: 'top-center',
//             });
            
//             setTitle('');
//             setDescription('');
//             setDate('');
//             setTime('');
//             setLocation('');
//             setImage(null);
//             e.target.reset();
//         } catch (error) {
//             console.error('Error creating event:', error.message);
//             toast.error('Failed to create event. Please try again.', {
//                 position: 'bottom-center',
//             });
//         } finally {
//             setLoading(false)

//         } 
//     };

//     const handleImageChange = (e) => {
//         if (e.target.files[0]) {
//             setImage(e.target.files[0]);
//         }
//     };

//     return (
//         <div className="container mt-5">
//             <h2 className="text-center mb-4">Create Event</h2>
//             <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow-sm">
//                 <div className="mb-3">
//                     <label className="form-label">Title</label>
//                     <input
//                         type="text"
//                         className="form-control"
//                         placeholder="Event Title"
//                         value={title}
//                         onChange={(e) => setTitle(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <div className="mb-3">
//                     <label className="form-label">Description</label>
//                     <textarea
//                         className="form-control"
//                         rows="3"
//                         placeholder="Event Description"
//                         value={description}
//                         onChange={(e) => setDescription(e.target.value)}
//                         required
//                     ></textarea>
//                 </div>
//                 <div className="mb-3">
//                     <label className="form-label">Date</label>
//                     <input
//                         type="date"
//                         className="form-control"
//                         value={date}
//                         onChange={(e) => setDate(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <div className="mb-3">
//                     <label className="form-label">Time</label>
//                     <input
//                         type="time"
//                         className="form-control"
//                         value={time}
//                         onChange={(e) => setTime(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <div className="mb-3">
//                     <label className="form-label">Location</label>
//                     <input
//                         type="text"
//                         className="form-control"
//                         placeholder="Event Location"
//                         value={location}
//                         onChange={(e) => setLocation(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <div className="mb-3">
//                     <label className="form-label">Event Image</label>
//                     <input
//                         type="file"
//                         className="form-control"
//                         onChange={handleImageChange}
//                         required
//                     />
//                 </div>
//                 <button type="submit" className="btn btn-primary w-100" disabled={loading}>
//                     {loading ? 'Submitting...' : 'Create Event'}
//                 </button>
//                 {loading && (
//                     <div className="text-center mt-3">
//                         <div className="spinner-border text-primary" role="status">
//                             <span className="visually-hidden">Loading...</span>
//                         </div>
//                         <p>Please wait while your event is being submitted...</p>
//                     </div>
//                 )}
//             </form>
//         </div>
//     );
// }

// export default CreateEvent;


import React, { useState } from 'react';
import './CreateEvent.css';
import { db, auth, storage } from '../../firebase/firebase'; 
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import { toast } from 'react-toastify';
import { useAuthState } from "react-firebase-hooks/auth";

function CreateEvent() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [image, setImage] = useState(null); 
    const [loading, setLoading] = useState(false);
    const [user] = useAuthState(auth);

    // Default image URL for events without an image
    const DEFAULT_IMAGE_URL = `https://firebasestorage.googleapis.com/v0/b/${process.env.REACT_APP_FIREBASE_STORAGE_BUCKET}/o/defaultImages%2Fsam-schooler-E9aetBe2w40-unsplash.jpg?alt=media&token=8be83d5c-a029-4940-abbf-1facfede93ad`; 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Confirm with the user if no image is uploaded
        if (!image) {
            const proceedWithoutImage = window.confirm(
                "You haven't uploaded an image for the event. Do you want to proceed with a default image?"
            );
            if (!proceedWithoutImage) {
                setLoading(false);
                return; // Stop form submission if the user chooses to upload an image
            }
        }

        try {
            let imageUrl = DEFAULT_IMAGE_URL; // Set default image URL

            // If an image is selected, upload and get its URL
            if (image) {
                const imageRef = ref(storage, `eventImages/${image.name}`);
                await uploadBytes(imageRef, image);
                imageUrl = await getDownloadURL(imageRef);
            }

            // Save the event data in Firestore
            const eventsCollectionRef = collection(db, 'Events');
            await addDoc(eventsCollectionRef, {
                title,
                description,
                date,
                time,
                location,
                imageUrl, 
                createdAt: new Date(),
                createdBy: user.uid,
            });

            toast.success('Event created successfully!', {
                position: 'top-center',
            });
            
            // Reset form fields
            setTitle('');
            setDescription('');
            setDate('');
            setTime('');
            setLocation('');
            setImage(null);
            e.target.reset();
        } catch (error) {
            console.error('Error creating event:', error.message);
            toast.error('Failed to create event. Please try again.', {
                position: 'bottom-center',
            });
        } finally {
            setLoading(false);
        } 
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Create Event</h2>
            <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow-sm">
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Event Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Event Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input
                        type="date"
                        className="form-control"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Time</label>
                    <input
                        type="time"
                        className="form-control"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Location</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Event Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Event Image</label>
                    <input
                        type="file"
                        className="form-control"
                        onChange={handleImageChange}
                    />
                    <small className="form-text text-muted">Optional: Add an image for the event.</small>
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? 'Submitting...' : 'Create Event'}
                </button>
                {loading && (
                    <div className="text-center mt-3">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p>Please wait while your event is being submitted...</p>
                    </div>
                )}
            </form>
        </div>
    );
}

export default CreateEvent;
