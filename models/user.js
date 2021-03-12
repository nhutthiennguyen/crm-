const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");


const WorkDaySchema = new mongoose.Schema({
  name: Number,
  timeKeeping: Boolean,
});

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      minlength: 8,
      maxlength: 30,
      required: true,
      indexes: 1,
    },
    password: {
      type: String,
      minlength: 8,
      required: true,
    },
    email: {
      type: String,
      validate(email) {
        if (!validator.isEmail(email)) {
          throw new Error("Invalid email");
          return;
        }
      },
      indexes: 1,
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    createDate: {
      type: Date,
      default: new Date(),
    },
    profile: {
      name: {
        type: String,
        default: null
      },
      avatar: {
        type: String,
        default: null
      },
      university: {
        type: String,
        default: null
      },
      description: {
        type: String,
        default: null
      },
    },
    tokens: {
      type: [String],
      default: [],
    },
    customerId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        default: []
      }
    ],
    salary: {
      type: Number,
      default: null
    },
    workday: [WorkDaySchema],

    status: {
      type: String,
    }
  },

  { timestamps: true }
);


UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  };
  next();
});

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.tokens;
  return user;
};

const User = mongoose.model("User", UserSchema);
const Workday = mongoose.model("Workday", WorkDaySchema);


module.exports = { User, Workday };

