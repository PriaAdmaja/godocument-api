const db = require('../configs/posgresql');

const createUsers = (email, password, name) => {
    return new Promise((resolve, reject) => {
        const sql = `insert into users ("email", "password", "name") values ($1, $2, $3) returning email;`;
        const values = [email, password, name];
        db.query(sql, values, (err, result) => {
            if(err) {
                return reject(err);
            }
            resolve(result);
        })
    })
}

module.exports = {
    createUsers
}