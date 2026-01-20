export default (requiredRole) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        if (req.user.role !== requiredRole) {
            return res.status(403).json({ message: "Insufficient permissions" });
        }

        next();
    };
};
