import { auth } from "../firebase/firebase"; 

export async function getUserId() {
    const user = auth.currentUser;
    if (user) {
        return user.uid; 
    } else {
        console.error("No user is currently signed in.");
        return null;
    }
}
