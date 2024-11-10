// src/utils/authHelpers.js
import { auth } from "../firebase/firebase"; // Adjust the path based on your setup

export async function getUserId() {
    const user = auth.currentUser;
    if (user) {
        return user.uid; // This is the Firebase user ID
    } else {
        console.error("No user is currently signed in.");
        return null;
    }
}
