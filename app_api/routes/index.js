const express = require('express'); // Express app
const router = express.Router(); // Express router

const jwt = require('jsonwebtoken'); // Enable JSON Web Tokens

const validateTrip = require('../validators/tripValidator'); // import trip validation middleware
const sanitizeTrip = require('../validators/sanitizeTrip'); // import trip sanitization middleware
// Method to authenticate our JWT
function authenticateJWT(req, res, next) {
    // console.log('In Middleware');

    const authHeader = req.headers['authorization'];
    // console.log('Auth Header: ' + authHeader);
    
    if(authHeader == null)
    {
        console.log('Auth Header Required but NOT PRESENT!');
        return res.sendStatus(401);
    }

    let headers = authHeader.split(' ');
    if(headers.length < 1)
    {
        console.log('Not enough tokens in Auth Header: ' + headers.length);
        return res.sendStatus(501);
    }

    const token = authHeader.split(' ')[1];
    // console.log('Token: ' + token);

    if(token == null)
    {
        console.log('Null Bearer Token');
        return res.sendStatus(401);
    }
    // console.log(process.env.JWT_SECRET);
    // console.log(jwt.decode(token));
    const verified = jwt.verify(token, process.env.JWT_SECRET, (err, verified) => {
        if(err)
        {
            return res.sendStatus(401).json('Token Validation Error!');
        }
        req.auth = verified; // Set the auth paramto the decoded object
    });
    next(); // We need to continue or this will hang forever
}

// This is where we import the controller we will route
const tripsController = require('../controllers/trips'); 
const authController = require("../controllers/authentication");

// Define route for the registration endpoint
router.route("/register").post(authController.register);

// Define route for login endpoint
router.route("/login").post(authController.login);

// define route for our trips endpoint
router
    .route('/trips')
    .get(tripsController.tripsList) // GET: /trips - list all the trips
    .post(authenticateJWT, validateTrip, sanitizeTrip, tripsController.tripsAddTrip); // POST: /trips - add a new trip

// GET Method routes tripsFindByCode - requires parameter
// PUT Method routes tripsUpdateTrip - requires parameter
// DELETE Method routes tripsDeleteTrip - requires parameter
router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode) // GET: /trips/:tripCode - lists a single trip
    .put(authenticateJWT, validateTrip, sanitizeTrip, tripsController.tripsUpdateTrip) // PUT: /trips/:tripCode - updates a single trip
    
module.exports = router; // Export the router for use in the app