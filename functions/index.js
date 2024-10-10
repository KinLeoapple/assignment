/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});

admin.initializeApp();

exports.countReservations = onRequest((req, res) => {
    cors(req, res, async () => {
        try {
            const booksCollection = admin.firestore().collection("reservations");
            const snapshot = await booksCollection.get();
            const member = req.query.member;
            let count = 0;
            await snapshot.forEach(r => {
                if (r.data().member === member) {
                    count++;
                }
            })

            res.status(200).send({count});
        } catch (error) {
            console.error("Error counting reservations:", error.message);
            res.status(500).send("Error counting reservations");
        }
    });
});

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
