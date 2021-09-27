
const admin = require('firebase-admin');
const serviceAccount = require('../../config/firebaseKey.json');
const firebase = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = { firebase, admin };