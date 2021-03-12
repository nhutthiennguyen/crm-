const mongoose = require("mongoose");
const Service = require("../models/service");

const OrderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    service: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        default: []
      }
    ],
    createDate: Date,
    timeOut: Date,
    description: {
      type: String,
    },
    status: {
      type: String,
    },
    pending: {
      type: String,
    },
    saleman: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    bonus: {
      type: Number,
      default: null
    }
  },
  { timestamps: true }
);

OrderSchema.pre("save", async function (next) {

  if (this.isModified("service")) {
    const foundedService = await Promise.all(
      this.service.map(async (x) => await Service.findById(x))
    );
    this.bonus = foundedService.reduce((x, y) => x + y.bonus, 0);
  }
  next();
})

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
