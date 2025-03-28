const jwt = require("jsonwebtoken");

const handleError = (res, statusCode, message) => {
    return res.status(statusCode).json({ error: message });
};

exports.authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return handleError(res, 401, "Access denied, no token provided");
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === "JsonWebTokenError") {
            return handleError(res, 401, "Invalid token");
        } else if (err.name === "TokenExpiredError") {
            return handleError(res, 401, "Token expired");
        }
        return handleError(res, 500, "Internal server error");
    }
};

exports.roleMiddleware = (requiredRole) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return handleError(res, 401, "Unauthorized, user not authenticated");
            }

            if (req.user.role !== requiredRole) {
                return handleError(res, 403, "Forbidden, insufficient privileges");
            }

            next(); // Proceed if the user has the correct role
        } catch (err) {
            return handleError(res, 500, "Internal server error");
        }
    };
};