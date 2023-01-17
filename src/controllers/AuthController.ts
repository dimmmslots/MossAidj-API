import { Prisma } from "@prisma/client";
let prisma = require("../configs/database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");

const AuthController = {
  login: async (req, res) => {
    try {
      let { username, password } = req.body;
      let encryptedPassword = bcrypt.hashSync(password, 10);
      const user = await prisma.users.findFirst({
        where: {
          username: username,
        },
      });
      if (!user) {
        return res.status(404).json({
          message: "Username atau Password salah!",
        });
      }
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        return res.status(404).json({
          message: "Username atau Password salah!",
        });
      }
      // generate access token and refresh token
      const accessToken = jwt.sign(
        {
          username: user.username,
          id: user.id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "10s",
        }
      );
      const refreshToken = jwt.sign(
        {
          username: user.username,
          id: user.id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "1d",
        }
      );
      // save refresh token and access token to client
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
      });
      return res.status(200).json({
        message: "Login berhasil",
        data: {
          username: username,
          password: encryptedPassword,
        },
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
  signup: async (req, res) => {
    try {
      let { username, password } = req.body;
      // validate username and password
      const schema = Joi.object({
        username: Joi.string().min(3).max(30).required().messages({
          "string.min": "Username minimal 3 karakter",
          "string.max": "Username maksimal 30 karakter",
          "string.empty": "Username tidak boleh kosong",
        }),
        password: Joi.string().min(6).max(30).required().messages({
          "string.min": "Password minimal 6 karakter",
          "string.max": "Password maksimal 30 karakter",
          "string.empty": "Password tidak boleh kosong",
        }),
      });
      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          message: error.details[0].message,
        });
      }
      let encryptedPassword = bcrypt.hashSync(password, 10);
      const usernameExists = await prisma.users.findFirst({
        where: {
          username: username,
        },
      });
      if (usernameExists) {
        return res.status(404).json({
          message: "Username tidak tersedia",
        });
      }
      const user = await prisma.users.create({
        data: {
          username: username,
          password: encryptedPassword,
        },
      });
      return res.status(200).json({
        message: "Signup berhasil",
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
  protected: async (req, res) => {
    try {
      return res.status(200).json({
        message: "Protected route",
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return res.status(200).json({
        message: "Logout berhasil",
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
};

export default AuthController;
