const home = (req, res) => {
    res.json({
        msg: `Welcome to GoDocument API`
    });
};

module.exports = {home}