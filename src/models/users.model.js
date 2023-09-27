const db = require("../configs/postgresql");

const createUsers = (email, password, name, role) => {
  return new Promise((resolve, reject) => {
    const sql = `insert into users ("email", "password", "name", "role") values ($1, $2, $3, $4) returning email;`;
    const values = [email, password, name, role];
    db.query(sql, values, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

const checkEmail = (email) => {
  return new Promise((resolve, reject) => {
    const sql = `select email, name, id, avatarUrl, password from users u where email = $1;`;
    db.query(sql, [email], (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};

module.exports = {
  createUsers,
  checkEmail
};
