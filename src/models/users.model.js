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
    const sql = `select email, name, id, avatar_url, password from users u where email = $1;`;
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
    const { name, biodata } = body;
    const dataAvail = [];
    
    if (name && name !== '') {
      dataAvail.push("name=");
    }
    if(biodata && biodata !== '') {
      dataAvail.push("biodata=");
    }
    const dataQuery = dataAvail.map((data, i) => `${data}$${i + 1}`).join(`, `);
    const rawValues = [name, biodata, id];
    const values = rawValues.filter((d) => d);
    let sql = `update users set ${dataQuery} where id=$${values.length} returning email, name, biodata;`;
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
