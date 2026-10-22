const sanitizeHtml = require('sanitize-html');

function validateTrip(req, res, next) {
    const errors = [];

    const { code, name, length, start, resort, perPerson, image, description } = req.body;

    // Required fields 
    if (!code) errors.push('Code is required');
    if (!name) errors.push('Name is required');
    if (!length) errors.push('Length is required');
    if (!start) errors.push('Start date is required');
    if (!resort) errors.push('Resort is required');
    if (perPerson === undefined || perPerson === null) errors.push('Per person price is required');
    if (!image) errors.push('Image is required');
    if (!description) errors.push('Description is required');

    // Type validation
    if (name && typeof name !== 'string') errors.push('Name must be a string');
    if (resort && typeof resort !== 'string') errors.push('Resort must be a string');
    if (description && typeof description !== 'string') errors.push('Description must be a string');
    if (length && typeof length !== 'string') errors.push('Length must be a string');
    if (perPerson && isNaN(Number(perPerson))) { 
        errors.push('Per person price must be a number'); 
    }

    // Range validation 
    if (name && name.trim().length < 3) {
        errors.push('Name must be at least 3 characters long');
    }
    
    if (description && description.trim().length < 10) {
        errors.push('Description must be at least 10 characters long');
    }
    
    if (description && description.trim().length > 2000) {
        errors.push('Description must not exceed 2000 characters');
    }

    // Format validation
    const lengthPattern = /^[0-9]+\s+nights\s+\/\s+[0-9]+\s+days$/;
    if (length && !lengthPattern.test(length)) {
        errors.push("Length must follow the format: 'X nights / Y days'.");
    }

    // Date validation
    if (start && isNaN(Date.parse(start))) {
        errors.push('Start date must be a valid date');
    }

    // Security validation - reject HTML/script tags
    const unsafe = /<[^>]*>/g;
    if (unsafe.test(name)) {
        errors.push('Name contains unsafe HTML tags');
    }
    if (unsafe.test(resort)) {
        errors.push('Resort contains unsafe HTML tags');
    }
    if (unsafe.test(description)) {
        errors.push('Description contains unsafe HTML tags');
    }

    // If errors exist, return them 
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    next();
}

module.exports = validateTrip;

    