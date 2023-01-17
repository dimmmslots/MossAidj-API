import { Router } from "express";
import AuthController from "../controllers/AuthController";
const jwtValidation = require("../middlewares/jwtValidation");
const refreshToken = require("../middlewares/refreshToken");

const router = Router();

router.post("/login", AuthController.login);
router.post("/signup", AuthController.signup);
router.get("/protected", jwtValidation, AuthController.protected);
router.get("/logout", AuthController.logout);

module.exports = router;
