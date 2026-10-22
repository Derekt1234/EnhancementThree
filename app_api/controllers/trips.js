const mongoose = require('mongoose');
const Trip = require('../models/travlr'); // Register model
const Model = mongoose.model('trips'); // Retrieve model

// GET: /trips - list all the trips
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client 
const tripsList = async (req, res) => {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(req.query.pageSize) || 5, 1), 100);
    const skip = (page - 1) * pageSize;

    const [trips, total] = await Promise.all([
        Model.find({})
            .sort({ code: 1, _id: 1 })
            .skip(skip)
            .limit(pageSize)
            .exec(),
        Model.countDocuments({})
    ]);

    return res.status(200).json({
        trips,
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
    });
};

// GET: /trips/:tripCode - lists a single trip
// Regardless of outcome, resonse must include HTML status code 
// and JSON message to the requesting client
const tripsFindByCode = async (req, res) => {
    const q = await Model
        .find({ 'code' : req.params.tripCode }) // Return single record
        .exec();

        // Uncomment the folllowing line to show results of query in the console
        // console.log(q);

    if(!q)
    { // Database returned no data
        return res
                .status(404)
                .json(err);
    } else { // Return resulting trip list
        return res
                .status(200)
                .json(q);
    }

};

// POST: /trips - add a new trip
// Regardless of outcome, response must include HTML status code 
// and JSON message to the requesting client
const tripsAddTrip = async (req, res) => {
    try { // Try/Catch added to prevent crashes
        // req.body is already validated + sanitized by middleware
        const newTrip = new Trip({
            code: req.body.code,
            name: req.body.name,
            length: req.body.length,
            start: req.body.start,
            resort: req.body.resort,
            perPerson: req.body.perPerson,
            image: req.body.image,
            description: req.body.description
        });

        const savedTrip = await newTrip.save(); // Save the new trip to the database
        
        return res
            .status(201)
            .json(savedTrip);
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Failed to create trip", error });
    }
      

        // Uncomment the following line to show results of operation
        // on the console
        // console.log(q);
};

// PUT: /trips/:tripCode - Adds a new Trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsUpdateTrip = async(req, res) => {
    try {
        // Uncomment for debugging
        console.log(req.params);
        console.log(req.body);
        
        const updatedTrip = await Model
            .findOneAndUpdate(
                { 'code' : req.params.tripCode },
                {
                    code: req.body.code,
                    name: req.body.name,
                    length: req.body.length,
                    start: req.body.start,
                    resort: req.body.resort,
                    perPerson: req.body.perPerson,
                    image: req.body.image,
                    description: req.body.description
                },
                { new: true } // Return the updated document
            )
            .exec();

            if(!updatedTrip)
            { // Database returned no data
                return res
                    .status(404)
                    .json({ message: "Trip not found" });
            } else { // Return resulting updated trip
                return res
                    .status(200).json(updatedTrip);
                }
        } catch (error) {
            console.error("Error updating trip:", error);
            return res
                .status(500)
                .json({ message: "Failed to update trip", error });
        }


            // Uncomment the following line to show results of operation
            // on the console
            // console.log(q);
};

module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip
};