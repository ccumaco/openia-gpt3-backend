const jwt = require('jsonwebtoken');


const requireLogin = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    } else {
        return res.redirect('/login');
    }
}
const validateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Token inválido' });
            }
            req.user = user;
            next();
        });
    } else {
        res.status(401).json({ message: 'Token no proporcionado' });
    }
}

module.exports = {requireLogin, validateToken}