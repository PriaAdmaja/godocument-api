const userModels = require("../models/users.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { transporter } = require('../configs/nodemailer');
const redisClient = require('../configs/redis')

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

const getDataAllUser = async (req, res) => {
  try {
    const result = await userModels.getDataAllUser();
    res.status(200).json({
      msg: "Success get data",
      data: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
};

const getUserData = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userModels.getUserData(id);
    if (!result.rows[0]) {
      return res.status(200).json({
        msg: "User not found",
      });
    }
    res.status(200).json({
      msg: "Success get data",
      data: result.rows[0],
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
      role: dbData.role,
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
          name: dbData.name,
          avatar: dbData.avatar_url,
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

const logout = async(req, res) => {
  try {
    await redisClient.connect();
    const { authInfo, token } = req;
    const tokenKey = `bl_${token}`;
    await redisClient.set(tokenKey, token);
    await redisClient.expireAt(tokenKey, authInfo.exp);
    await redisClient.quit();
    res.status(200).json({
        msg: 'Token invalidated'
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
        msg: "Internal server error"
    })
  }
}

const editUsers = async (req, res) => {
  try {
    const { id } = req.authInfo;
    const result = await userModels.editUsers(req.body, id);
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

const editPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { id } = req.authInfo;
    //check password
    const dbPassword = await userModels.checkPassword(id);
    const checkPassword = await bcrypt.compare(
      oldPassword,
      dbPassword.rows[0].password
    );
    if (!checkPassword) {
      return res.status(401).json({
        msg: "Try with another password",
      });
    };
    //encrypting new password
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    //change password
    await userModels.changePassword(encryptedPassword, id);
    res.status(201).json({
      msg: "Password changed",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
};

const privateAccess = (req, res) => {
  const { id, email, role } = req.authInfo;
  res.status(200).json({
    payload: {
      id,
      email,
      role,
    },
    msg: "OK",
  });
};

const reqResetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    //check email on db
    const userData = await userModels.checkEmail(email);
    if(!userData.rows[0]) {
      return res.status(404).json({
        msg: 'Email is not registered'
      });
    };
    const { id } = userData.rows[0];

    //create otp
    const char = `0987654321`;
    const otpLength = 5;
    let otp = ``;
    for (let i = 0; i < otpLength; i++) {
      otp += char[Math.floor(Math.random() * char.length)];
    }
    const newData = {
      otp,
    };

    //add otp on db
    await userModels.editUsers(newData, id);

    //send otp to email
    const message = {
      from: "godocument63@gmail.com",
      to: email,
      subject: "GoDocument Reset Password",
      text: `Your OTP is ${otp}`
    };
    const sendMail = await transporter.sendMail(message);
    if(!sendMail.messageId) {
      return res.status(201).json({
        msg: "Failed to send to your email",
      });
    };
    res.status(201).json({
      msg: "Pleace check your email",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, password} = req.body;
    //get data user
    const dataUser = await userModels.checkEmail(email);
    //check otp
    if(dataUser.rows[0].otp !== otp) {
      return res.status(200).json({
        msg: "Pleace check your otp!",
      });
    };
    //encrypting new password
    const encryptedPassword = await bcrypt.hash(password, 10)
    //change password
    const newPassword = {
      password: encryptedPassword,
      otp: null
    }
    await userModels.editUsers(newPassword, dataUser.rows[0].id)
    res.status(200).json({
      msg: "Success reset password",
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal server error",
    });
  };
};

const deleteUser = () => {

}

module.exports = {
  getDataAllUser,
  getUserData,
  createUsers,
  login,
  logout,
  editUsers,
  editPassword,
  privateAccess,
  reqResetPassword,
  resetPassword
};
