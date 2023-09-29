const home = (req, res) => {
    res.json({
        msg: `Welcome to GoDocument API`,
        author: 'M. Pria Admaja',
        source: 'https://github.com/PriaAdmaja/godocument-api'
    });
};

module.exports = {home}