const { User, Workday } = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("config");
const Signature = config.get("Signature");
const moment = require("moment");
const { Calendar } = require("node-calendar-js");

const signUp = async (req, res) => {
  const { username, password, email, phone, role } = req.body;
  try {
    const foundedUser = await User.find().or([{ username }, { email }]);
    if (foundedUser.length > 0)
      return res.status(400).send({ message: "user name or email existed" });
    const month = moment().format('M');
    const year = moment().format('YYYY');
    const calendar = new Calendar({
      year,
      month
    });
    const workday = [...new Array(calendar.create().totalDays)].map((_, y) => {
      return new Workday({
        name: y + 1,
        timeKeeping: false,
      })
    });
    const newUser = new User({
      username,
      password,
      email,
      phone,
      role,
      workday,
      status: "active",
    });
    let result = await newUser.save();
    result.toObject();
    delete result.password;
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "something went wrong" });
  }
};
const signIn = async (req, res) => {
  const { username, password } = req.body;
  try {
    const foundedUser = await User.findOne({ username: username });
    if (!foundedUser)
      return res.status(400).send({ message: "Invalid username" });
    const isMatch = await bcrypt.compare(password, foundedUser.password);
    if (!isMatch) return res.status(400).send({ message: "wrong password" });
    const token = await jwt.sign(
      {
        _id: foundedUser.id,
      },
      Signature
    );
    foundedUser.tokens.push(token);
    await foundedUser.save();
    res.send(token);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "something went wrong" });
  }
};
const updateUser = async (req, res) => {
  const { id } = req.query;
  const { oldPassword, newPassword } = req.body;
  try {
    const foundedUser = await User.findById(id);
    if (!foundedUser)
      return res.status(400).send({ message: "invalid username" });
    const isMatch = await bcrypt.compare(oldPassword, foundedUser.password);
    if (!isMatch) return res.status(400).send({ message: "wrong password" });
    foundedUser.password = newPassword;
    const result = await foundedUser.save();
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "something went wrong" });
  }
};
const logOut = async (req, res) => {
  try {
    const index = req.user.tokens.findIndex(x => x === x.token);
    req.user.tokens.splice(index, 1);
    await req.user.save();
    res.send('success')
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "something went wrong" });
  }
};
const updateProfile = async (req, res) => {
  const { name, university, description } = req.body;
  try {
    const foundedUser = req.user;
    foundedUser.profile.name = name;
    foundedUser.profile.university = university;
    foundedUser.profile.description = description;
    const result = await foundedUser.save();
    res.send(result.profile);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "something went wrong" });
  }
};

const getUser = async (req, res) => {
  const user = req.user;
  try {
    const allUser = await User.find();
    res.send(allUser);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "something went wrong" });
  }
};

const timeKeeping = async (req, res) => {
  const { id } = req.query;
  try {
    res.send()
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "something went wrong" });
  }
};

module.exports = {
  signUp,
  signIn,
  updateUser,
  logOut,
  updateProfile,
  getUser,
  // uploadImg,
  timeKeeping

};
