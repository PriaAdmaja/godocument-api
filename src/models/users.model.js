const db = require('../configs/posgresql');

const createUsers = (email, password, name, role) => {
    return new Promise((resolve, reject) => {
        const sql = `insert into users ("email", "password", "name", "role) values ($1, $2, $3, $4) returning email;`;
        const values = [email, password, name, role];
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