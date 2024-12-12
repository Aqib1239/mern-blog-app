const jwt = require('jsonwebtoken');
const HttpError = require('../models/errorModel');


const authMiddleware = async (req, res, next) => {
    try {
        const Authorization = req.headers.authorization; // Always lowercase
        if (!Authorization || !Authorization.startsWith('Bearer')) {
            console.error("No Authorization header or invalid format");
            return next(new HttpError("Unauthorized, No token found.", 402));
        }

        const token = Authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
            if (err) {
                console.error("JWT Verification Failed:", err.message); // Log detailed error
                return next(new HttpError("Unauthorized, Invalid token.", 403));
            }
            // console.log("Authenticated User:", info); // Log the decoded token
            req.user = info; // Attach user info to the request
            next();
        });
    } catch (error) {
        console.error("Middleware Error:", error.message);
        return next(new HttpError("Unauthorized, Middleware error.", 500));
    }
};

module.exports = authMiddleware;
