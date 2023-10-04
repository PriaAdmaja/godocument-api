const db = require("../configs/postgresql");

const createUsers = (email, password, name, role) => {
  return new Promise((resolve, reject) => {
    const sql = `insert into users ("email", "password", "name", "roles_id", "created_at") values ($1, $2, $3, $4, now()) returning email;`;
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
    const sql = `select id, email, name, avatar_url, biodata, roles_id from users;`
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
    const sql = `select u.id, u.email, u.name, u.avatar_url, u.biodata, u.roles_id, r."name" as "role" from users u join roles r on u.roles_id = r.id  where u.id=$1;`;
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
    const sql = `select email, name, id, avatar_url, password, roles_id, otp from users u where email = $1;`;
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
    const { name, biodata, password, otp, role } = body;
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
    if(role && role !== '') {
      dataAvail.push("roles_id=");
    };
    if(otp === null || otp !== '' ) {
      dataAvail.push("otp=");
    };
    const dataQuery = dataAvail.map((data, i) => `${data}$${i + 1}`).join(`, `);
    const rawValues = [password, name, biodata, role, otp, id];
    const values = rawValues.filter((d) => d || d === null);
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

const deleteUser = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `delete from users where id=$1;`
    db.query(sql, [id], (err, result) => {
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
  changePassword,
  deleteUser
};
