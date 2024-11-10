const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { google } = require("googleapis");
const admin = require("firebase-admin");
const cors = require('cors')({ origin: true });
admin.initializeApp();

exports.helloWorld = onRequest((request, response) => {
    logger.info("Hello logs!", {structuredData: true});
    response.send("Hello from Firebase!");
});

exports.exchangeCodeForTokens = onRequest( async (req, res) => {
    cors(req, res, async () => {

        const { code, userId } = req.body;

        const oAuth2Client = new google.auth.OAuth2(
            process.env.REACT_APP_GOOGLE_CLIENT_ID,
            process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
            
            "postmessage"
        );


        try {
            const { tokens } = await oAuth2Client.getToken(code);
    
            await admin.firestore().collection("Users").doc(userId).set(
                { tokens },
                { merge: true }
            );
        
            res.status(200).send("Tokens saved successfully."); 
        } catch (error) {
        console.error("Error exchanging code for tokens:", error);
        res.status(500).send("Error exchanging code for tokens.");
        }
    });
});
