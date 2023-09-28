const jwt = require('jsonwebtoken');
const redisClient = require('../configs/redis');

const checkToken = async (req, res, next) => {
    //get token
    const bearerToken = req.header("Authorization");
    if(!bearerToken) {
        return res.status(401).json({
            msg: "Please login first!"
        })
    };
    const token = bearerToken.split(" ")[1];
    
    //check token in redis
    await redisClient.connect();
    const blTokenList = await redisClient.get(`bl_${token}`);
    if(blTokenList) {
        return res.status(401).json({
            msg: "Invalid token"
        });
    };
    await redisClient.quit();

    jwt.verify(token, process.env.JWTSECRET, (err, payload) => {
        if (err && err.name) {
            return res.status(403).json({
                msg: err.message
            });
        };
        if (err) {
            return res.status(403).json({
                msg: "Internal server error"
            });
        };
        req.authInfo = payload;
        req.token = token;
        next()
    });
};

const spvAccess = (req, res, next) => {
    const { role } = req.authInfo;
    if(role == 1) {
        return res.status(405).json({
            msg: `You are not supervisor!`
        });
    };
    next();
};

const adminAccess = (req, res, next) => {
    const { role } = req.authInfo;
    if(role == 1 || role == 2) {
        return res.status(405).json({
            msg: `You are not admin!`
        });
    };
    next();
};

module.exports = {
    checkToken,
    spvAccess,
    adminAccess
}