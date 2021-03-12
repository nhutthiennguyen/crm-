const mongoose = require("mongoose");
const validator = require("validator");

const CustomerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: null
    },
    business: {
      type: String,
      default: null
    },
    personalPhone: {
      type: String,
      default: null
    },
    businessPhone: {
      type: String,
      default: null
    },
    address: {
      type: String,
      default: null
    },
    email: {
      type: String,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("invalid Email");
        }
      },
      default: null
    },
    saleman: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    typeCustomer: {
      type: String,
      default: "potential"
    },
    status: {
      type: String,
      default: "active"
    }
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", CustomerSchema);

module.exports = Customer;
