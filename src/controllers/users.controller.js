const userModels = require("../models/users.model");
const bcrypt = require("bcrypt");

const createUsers = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    const encryptedPassword = bcrypt.hash(password, 10);
    const result = await userModels.createUsers(
      email,
      encryptedPassword,
      name,
      role
    );
    res.status(201).json({
      data: result.rows,
      msg: "Succes create new account",
    });
  } catch (error) {
    console.log(err);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
};

module.exports = {
    createUsers
}