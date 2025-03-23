
const verifyRole = (...roles) => {
    return (req, res, next) => {

        if(!req?.role) return res.status(401);

        const rolesArray = [...roles];
        const hasRole = req.user.roles.some(role => rolesArray.includes(role));

        if(!hasRole) return res.sendStatus(403);

        next();
    }
}

module.exports = verifyRole
