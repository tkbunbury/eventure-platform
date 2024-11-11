import { doc, getDoc, updateDoc } from "firebase/firestore";

import { db } from "../firebase/firebase";

export const refreshTokenIfNeeded = async (userId) => {
    if (!userId) {
        console.error("User ID is required for refreshing token.");
        return;
    }

    const google = window.google;
    const userDocRef = doc(db, "Users", userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
        console.error("User document not found.");
        return;
    }

    const tokens = userDoc.data().tokens;
    const accessToken = tokens?.access_token;
    const refreshToken = tokens?.refresh_token;
    const expiryDate = tokens?.expiry_date;

    if (!accessToken || !refreshToken || !expiryDate) {
        console.error("Token details are missing.");
        return;
    }

    const currentTime = new Date().getTime();
    if (expiryDate - currentTime > 300000) {  // Only refresh if less than 5 minutes left
        return;  // Token still valid
    }

    const oAuth2Client = new google.auth.OAuth2(
        process.env.REACT_APP_GOOGLE_CLIENT_ID,
        process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
        "postmessage"  // Replace with your redirect URI
    );

    oAuth2Client.setCredentials({ refresh_token: refreshToken });

    try {
        const newTokens = await oAuth2Client.getAccessToken();

        await updateDoc(userDocRef, {
        "tokens.access_token": newTokens.token,
        "tokens.expiry_date": new Date().getTime() + newTokens.res.data.expires_in * 1000,
        });

        console.log("Token refreshed and updated in Firestore.");
    } catch (error) {
        console.error("Error refreshing token:", error);
    }
};
