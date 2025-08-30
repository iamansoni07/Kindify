import jwt from "jsonwebtoken";
import config from "../config/config.js";

const jwtAuthMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;
        
        // Check if token is present
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: "Access denied. No token provided." 
            });
        }

        // Verify token
        const decoded = jwt.verify(token, config.jwt.secret);
        
        // Check if token is expired
        if (decoded.exp && Date.now() >= decoded.exp * 1000) {
            return res.status(401).json({ 
                success: false,
                message: "Token has expired. Please login again." 
            });
        }

        // Check if user is still active
        if (decoded.isActive === false) {
            return res.status(401).json({ 
                success: false,
                message: "Account is deactivated. Please contact support." 
            });
        }

        // Attach user info to request object
        req.user = decoded;
        next();
        
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false,
                message: "Invalid token. Please login again." 
            });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false,
                message: "Token has expired. Please login again." 
            });
        } else {
            return res.status(500).json({ 
                success: false,
                message: "Token verification failed." 
            });
        }
    }
};

export default jwtAuthMiddleware;
