const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const config = require("config");
const Signature = config.get("Signature");

const authentication = (roles) => async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = await jwt.verify(token, Signature);
    const allowRole = roles || ["admin", "dev", "sales", "manager"];
    const foundedUser = await User.findOne({
      _id: decoded._id,
      tokens: token,
      role: { $in: allowRole },
    });
    if (!foundedUser)
      return res.status(400).send({ message: "you are not authorization" });
    req.user = foundedUser;
    req.token = token;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "something went wrong" });
  }
};
module.exports = { authentication };
