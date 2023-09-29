const db = require("../configs/postgresql");

const createFeedback = (data) => {
  return new Promise((resolve, reject) => {
    const { userId, documentId, comment } = data;
    const sql = `insert into feedback (users_id, document_id, "comment") values ($1, $2, $3) returning *;`;
    const values = [userId, documentId, comment];
    db.query(sql, values, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};

const getFeedbackByDocument = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `select f.id, f."comment", u."name", f.created_at from feedback f join users u on f.users_id = u.id  where f.document_id = $1 order by created_at asc;`;
    db.query(sql, [id], (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};

const getFeedbackByUsersId = () => {
  return new Promise((resolve, reject) => {
    const sql = `select f.id, f."comment", f.created_at, f.document_id, d.title as document_title from feedback f join documents d on f.document_id = d.id where f.users_id = $1;`;
    db.query(sql, [id], (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};

const deleteFeedback = (id) => {
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
  createFeedback,
  getFeedbackByDocument,
  getFeedbackByUsersId,
  deleteFeedback
};
