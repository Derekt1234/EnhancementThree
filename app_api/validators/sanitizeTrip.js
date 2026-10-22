const sanitizeHtml = require('sanitize-html');

function sanitizeTrip(req, res, next) {
    //Only sanitize fields that contain user input
    if (req.body.name) {
        req.body.name = sanitizeHtml(req.body.name, {
            allowedTags: [], // Disallow all HTML tags
            allowedAttributes: {} // Disallow all attributes
        }).trim();
    }
    if (req.body.resort) {
        req.body.resort = sanitizeHtml(req.body.resort, {
            allowedTags: [], // Disallow all HTML tags
            allowedAttributes: {} // Disallow all attributes
        }).trim();
    }
    if (req.body.description) {
        req.body.description = sanitizeHtml(req.body.description, {
            allowedTags: [], // Disallow all HTML tags
            allowedAttributes: {} // Disallow all attributes
        }).trim();
    }

    next(); // Continue to the next middleware or route handler
}

module.exports = sanitizeTrip;
    