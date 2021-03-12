const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    createDay: Date,
    timeout: Date,
    bonus: Number,
    status: String,

  },
  { timestamps: true }
);

const Service = mongoose.model("Service", ServiceSchema);
module.exports = Service;
