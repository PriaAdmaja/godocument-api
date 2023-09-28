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

const getDataAllUser = () => {
  return new Promise((resolve, reject) => {
    const sql = `select id, email, name, avatar_url, biodata, "role" from users;`
    db.query(sql, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};

const getUserData = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `select id, email, name, avatar_url, biodata, "role" from users where id=$1;`;
    db.query(sql, [id], (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};

const checkEmail = (email) => {
  return new Promise((resolve, reject) => {
    const sql = `select email, name, id, avatar_url, password, role from users u where email = $1;`;
    db.query(sql, [email], (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};

const checkPassword = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `select password from users u where id = $1;`;
    db.query(sql, [id], (err, result) => {
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
    const { name, biodata, password, otp } = body;
    const dataAvail = [];
    if (password && password !== '') {
      dataAvail.push("password=");
    };
    if (name && name !== '') {
      dataAvail.push("name=");
    };
    if(biodata && biodata !== '') {
      dataAvail.push("biodata=");
    };
    if(otp && otp !== '') {
      dataAvail.push("otp=");
    };
    const dataQuery = dataAvail.map((data, i) => `${data}$${i + 1}`).join(`, `);
    const rawValues = [password, name, biodata, otp, id];
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

const changePassword = (newPassword, id) => {
  return new Promise((resolve, reject) => {
    const sql = `update users set password=$1 where id=$2 returning id;`;
    db.query(sql, [newPassword, id], (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};



module.exports = {
  getDataAllUser,
  getUserData,
  createUsers,
  checkEmail,
  checkPassword,
  editUsers,
  changePassword
};
