const db = require("../configs/postgresql");

const createDocument = (body, usersId) => {
    return new Promise((resolve, reject) => {
        const { title, content } = body;
        const sql = `insert into documents ("users_id", "title", "content", "status_id", "created_at") values ($1, $2, $3, 1, now()) returning *;`;
        const values = [usersId, title, content];
        db.query(sql, values, (err, result) => {
            if (err) {
                reject(err);
                return;
              }
              resolve(result);
        });
    });
};

module.exports = {
    createDocument
}