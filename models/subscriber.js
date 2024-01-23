const mongoose = require("mongoose");

const subscriberschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: "defaultuser",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    default: "default-email",
  },
  subscriberdate: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("Subscriber", subscriberschema);
