const express = require("express");
const { signUp, signIn, updateUser, logOut, updateProfile, getUser, uploadImg, uploadAvatar, timeKeeping } = require("../controllers/user");
const { authentication } = require("../helpers/authentication");

const router = express.Router();

router.post("/user/signup", authentication(["admin"]), signUp);

router.post("/user/signin", signIn);

router.patch("/user/update", authentication(), updateUser);

router.post("/user/logout", authentication(), logOut)

router.post("/user/profile", authentication(), updateProfile);

router.get("/user/get", authentication(["admin", "manager"]), getUser);

router.post("/user/timekeeping", authentication(["admin", "manager"]), timeKeeping)

module.exports = router;
