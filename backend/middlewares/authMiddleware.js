import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    // Get the token from the Authorization header (format: Bearer <token>)
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided. Unauthorized!' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user data to request for future use
        req.user = decoded;

        next(); // Proceed to next middleware/route
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token. Unauthorized!' });
    }
};

export default authMiddleware;
