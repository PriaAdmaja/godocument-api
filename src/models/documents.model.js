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

const getMetaAllDocument = (data) => {
  return new Promise((resolve, reject) => {
    const { title, statusId, userId, sort, limit, page } = data;
    const filterData = [];
    const endpoint = [];
    let sql = `select count(*) as total_document from documents d join status s on d.status_id = s.id `;
    //filter
    if (title && title !== "") {
      filterData.push(`lower(d.title) like lower('%${title}%')`);
      endpoint.push(`title=${title}`);
    }
    if (statusId && statusId !== "") {
      filterData.push(`d.status_id = ${statusId}`);
      endpoint.push(`statusId=${statusId}`);
    }
    if (userId && userId !== "") {
      filterData.push(`d.users_id = ${userId}`);
      endpoint.push(`userId=${userId}`);
    }
    const filterFix = filterData.join(" and ");
    if (filterFix) {
      sql += `where ${filterFix} `;
    }
    db.query(sql, (err, result) => {
      if (err) {
        return reject(err);
      }
      const totalDocument = Number(result.rows[0].total_document);
      const dataPage = Number(page || 1);
      const dataLimit = Number(limit || 100);
      const totalPage = Math.ceil(totalDocument / dataLimit);
      switch (sort) {
        case "idAsc":
          endpoint.push(`sort=idAsc`);
          break;
        case "idDesc":
          endpoint.push(`sort=idDesc`);
          break;
        case "titleAsc":
          endpoint.push(`sort=titleAsc`);
          break;
        case "titleDesc":
          endpoint.push(`sort=titleDesc`);
          break;
      }
      if (limit) {
        endpoint.push(`limit=${limit}`);
      }
      let prev = `/document?${endpoint.join("&")}&page=${dataPage - 1}`;
      let next = `/document?${endpoint.join("&")}&page=${dataPage + 1}`;
      if (dataPage === 1) {
        prev = null;
      }
      if (dataPage === totalPage) {
        next = null;
      }
      const meta = {
        totalDocument,
        totalPage,
        prev,
        next,
      };
      resolve(meta);
    });
  });
};

const getSingleDocument = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `select d.id, d.users_id, d.title, d.status_id, d."content", d.updated_at, s.status from documents d join status s on d.status_id = s.id where d.id = $1;`;
    db.query(sql, [id], (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};

const editDocument = (body, id) => {
  return new Promise((resolve, reject) => {
    const { title, content, statusId } = body;
    const dataAvail = [];
    if (title && title !== "") {
      dataAvail.push(`title=`);
    }
    if (content && content !== "") {
      dataAvail.push(`content=`);
    }
    if (statusId && statusId !== "") {
      dataAvail.push(`status_id=`);
    }
    const dataQuery = dataAvail.map((data, i) => `${data}$${i + 1}`).join(`, `);
    const rawValues = [title, content, statusId];
    const values = rawValues.filter((d) => d);
    const sql = `update documents set ${dataQuery} where id=${id} returning *;`;
    db.query(sql, values, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};

const deleteDocument = (id) => {
    return new Promise((resolve, reject) => {
        const sql = `delete from documents where id=$1;`;
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
  createDocument,
  getAllDocument,
  getMetaAllDocument,
  getSingleDocument,
  editDocument,
  deleteDocument
};
