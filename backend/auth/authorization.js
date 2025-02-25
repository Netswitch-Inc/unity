/**
 * @type {Module jsonwebtoken|Module jsonwebtoken}
 * @author | Mohammad Raheem
 */
var jwt = require('jsonwebtoken');
var config = require('../config');

var authorization = function (req, res, next) {
    var token = req.headers['x-access-token'];
    var msg = { auth: false, flag: false, message: 'No token provided.' };
    if (!token) {
        return res.status(401).send(msg);
    } else {
        jwt.verify(token, config.SECRET, function (err, decoded) {
            if (err) {
                var msg = { auth: false, flag: false, message: 'Failed to authenticate token.' };
                res.status(401).send(msg);
            } else {
                req.userId = decoded.id;
                req.roleId = decoded.role_id;
                req.userName = decoded?.user_name || "";
                req.companyId = decoded?.company_id || "";
                next();
            }
        });
    }
}

module.exports = authorization;
