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

const getAllDocument = (data) => {
  return new Promise((resolve, reject) => {
    const { title, statusId, userId, sort, limit, page } = data;
    const filterData = [];
    let sql = `select d.id, d.title, d."content", s.status, d.users_id, d.created_at, d.updated_at from documents d join status s on d.status_id = s.id `;
    //filter
    if (title && title !== "") {
      filterData.push(`lower(d.title) like lower('%${title}%')`);
    }
    if (statusId && statusId !== "") {
      filterData.push(`d.status_id = ${statusId}`);
    }
    if (userId && userId !== "") {
      filterData.push(`d.users_id = ${userId}`);
    }
    const filterFix = filterData.join(" and ");
    if (filterFix) {
      sql += `where ${filterFix} `;
    }
    //sort
    switch (sort) {
      case "idAsc":
        sql += `order by d.id asc `;
        break;
      case "idDesc":
        sql += `order by d.id desc `;
        break;
      case "titleAsc":
        sql += `order by d.title asc `;
        break;
      case "titleDesc":
        sql += `order by d.title desc `;
        break;
      default:
        `order by d.id asc `;
        break;
    }
    const pageLimit = Number(limit || 100);
    const dataPage = Number(page || 1);
    const offset = (dataPage - 1) * pageLimit;
    sql += `limit ${pageLimit} offset ${offset}`;
    db.query(sql, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};

module.exports = {
  createDocument,
  getAllDocument,
};
