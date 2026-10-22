const mongoose = require('mongoose');
const sanitizeHtml = require('sanitize-html');

// Define the trip schema
const tripSchema = new mongoose.Schema({
    code: { 
        type: String, 
        required: true, 
        trim: true, // Remove leading and trailing whitespace
        index: true, 
    },
    name: { 
        type: String, 
        required: true, 
        trim: true, // Remove leading and trailing whitespace
        minlength: 3,
        maxlength: 100,
        index: true 
    },
    length: { 
        type: String, 
        required: true,
        match: /^[0-9]+\s+nights\s+\/\s+[0-9]+\s+days$/, // Format Validator: Match the format "X nights / Y days"
        trim: true, // Remove leading and trailing whitespace
     },
    start: { 
        type: Date, 
        required: true,
     },
    resort: { 
        type: String, 
        required: true,
        minlength: 3,
        maxlength: 100,
        trim: true, // Remove leading and trailing whitespace
     },
    perPerson: { 
        type: Number, 
        required: true,
        min: 0,
        max: 10000
     },
    image: { 
        type: String, 
        required: true,
        trim: true, // Remove leading and trailing whitespace
     },
    description: { 
        type: String, 
        required: true,
        minlength: 10,
        maxlength: 2000,
        trim: true, // Remove leading and trailing whitespace   
     }
});

// Sanitization hook - strips unsafe HTML and prevents injection attacks 
tripSchema.pre('save', function(next) {
    this.name = sanitizeHtml(this.name, { allowedTags: [], allowedAttributes: {} });
    this.resort = sanitizeHtml(this.resort, { allowedTags: [], allowedAttributes: {} });
    this.description = sanitizeHtml(this.description, { allowedTags: [], allowedAttributes: {} });
    
    next();
});

const Trip = mongoose.model('trips', tripSchema);
module.exports = Trip;