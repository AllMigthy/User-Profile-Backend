const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  dateOfBirth: Date,
  profilePicture: String,
  projects: [
    {
      title: String,
      description: String,
      startDate: Date,
      endDate: Date,
    },
  ],
  skills: [
    {
      name: String,
      level: String,
    },
  ],
  companies: [
    {
      name: String,
      location: String,
      industry: String,
    },
  ],
  education: [
    {
      school: String,
      degree: String,
      fieldOfStudy: String,
      graduationYear: Number,
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
