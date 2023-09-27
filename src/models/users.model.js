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

const editUsers = (body, id) => {
  return new Promise((resolve, reject) => {
    const { password, name, role } = body;
    const dataAvail = [];
    if (password && password !== ' ') {
      dataAvail.push("password=");
    }
    if (name && name !== ' ') {
      dataAvail.push("name=");
    }
    if (role && role !== ' ') {
      dataAvail.push("role=");
    }
    const dataQuery = dataAvail.map((data, i) => `${data}$${i + 1}`).join(`, `);
    const rawValues = [password, name, role, id];
    const values = rawValues.filter((d) => d);
    let sql = `update users set ${dataQuery} where id=$${values.length} returning email, name, role;`;
    console.log(sql);
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
  createUsers,
  checkEmail,
  editUsers
};
