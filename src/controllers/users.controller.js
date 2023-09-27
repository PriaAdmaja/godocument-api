const userModels = require("../models/users.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUsers = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    //check form
    if (!email || !password || !name || !role) {
      return res.status(401).json({
        msg: "Incomplete register form data",
      });
    }

    //check password strength
    if (password.length < 8) {
      return res.status(401).json({
        msg: "Need longer password",
      });
    }

    //check double email
    const checkEmail = await userModels.checkEmail(email);
    if (checkEmail.rows[0]) {
      return res.status(200).json({
        msg: "Email already exist",
      });
    }

    //encrypting password
    const encryptedPassword = await bcrypt.hash(password, 10);

    //save to db
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
    console.log(error);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //check form
    if (!email && !password) {
      return res.status(401).json({
        msg: "Input your email & password",
      });
    }

    //get data from db
    const userData = await userModels.checkEmail(email);
    const dbData = userData.rows[0];

    //check password
    const checkPassword = await bcrypt.compare(password, dbData.password);
    if (!checkPassword) {
      return res.status(401).json({
        msg: "Try with another email/password",
      });
    }

    //create token
    const payload = {
      id: dbData.id,
      email: dbData.email,
    };
    const jwtOption = {
      expiresIn: "1h",
    };
    jwt.sign(payload, process.env.JWTSECRET, jwtOption, (err, token) => {
      if (err) throw err;
      res.status(200).json({
        msg: "Welcome",
        data: {
          token,
          id: dbData.id,
          email: dbData.email,
          name: dbData.name,
          avatar: dbData.avatar_url,
          role: dbData.role,
        },
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
};

const editUsers = async (req, res) => {
  try {
    const { body, params } = req;
    const result = await userModels.editUsers(body, params.id);
    res.status(201).json({
      data: result.rows,
      msg: "Account updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
};

const editPassword = async(req, res) => {
  try {
    const {body, params} = req;
    const {newPassword, oldPassword} = body
    //check password
    const dbPassword = await userModels.checkPassword(params.id);
    const checkPassword = await bcrypt.compare(oldPassword, dbPassword.rows[0].password);
    if (!checkPassword) {
      return res.status(401).json({
        msg: "Try with another password",
      });
    }

    //change password
    await userModels.changePassword(newPassword, params.id)
    res.status(201).json({
      msg: "Password changed",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
}

module.exports = {
  createUsers,
  login,
  editUsers,
  editPassword
};
