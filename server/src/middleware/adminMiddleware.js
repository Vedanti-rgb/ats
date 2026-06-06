const adminOnly = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403);
        throw new Error('Access denied. Admin privileges required.');
    }
};

module.exports = { adminOnly };
