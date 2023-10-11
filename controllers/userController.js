const User = require("../models/userModel");

// Create a new user

exports.createUser = async (req, res) => {
  const newUser = new User(req.body);
  try {
    const response = await newUser.save();
    console.log(response);
    res.status(201).json(response);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
};

// Retrieve a user by ID

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const user = await User.findById(id, "-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json(error);
  }
};

// Update a user by ID

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json(error);
  }
};

// Delete a user by ID

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const user = await User.findByIdAndDelete(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json(error);
  }
};

// Add a new skill to the user's profile

exports.addSkill = async (req, res) => {
  const { id } = req.params;
  const { name, level } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.skills.push({ name, level });
    await user.save();

    res.status(200).json(user.skills);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

// Remove a skill from the user's profile
exports.removeSkill = async (req, res) => {
  const { id, skillId } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.skills = user.skills.filter((skill) => skill._id != skillId);
    await user.save();

    res.status(200).json(user.skills);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

// Update a skill in the user's profile
exports.updateSkill = async (req, res) => {
  const { id, skillId } = req.params;
  const { name, level } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const skill = user.skills.find((skill) => skill._id == skillId);

    if (!skill) {
      return res.status(404).json({ error: "Skill not found" });
    }

    if (name) skill.name = name;
    if (level) skill.level = level;

    await user.save();

    res.status(200).json(user.skills);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

// Add a new project to the user's profile
exports.addProject = async (req, res) => {
  const { id } = req.params;
  const { title, description, startDate, endDate } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.projects.push({ title, description, startDate, endDate });
    await user.save();

    res.status(200).json(user.projects);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

// Remove a project from the user's profile
exports.removeProject = async (req, res) => {
  const { id, projectId } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.projects = user.projects.filter((project) => project._id != projectId);
    await user.save();

    res.status(200).json(user.projects);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

// Update a project in the user's profile
exports.updateProject = async (req, res) => {
  const { id, projectId } = req.params;
  const { title, description, startDate, endDate } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const project = user.projects.find((project) => project._id == projectId);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (title) project.title = title;
    if (description) project.description = description;
    if (startDate) project.startDate = startDate;
    if (endDate) project.endDate = endDate;

    await user.save();

    res.status(200).json(user.projects);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

// Add a new education entry to the user's profile
exports.addEducation = async (req, res) => {
  const { id } = req.params;
  const { school, degree, fieldOfStudy, graduationYear } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.education.push({ school, degree, fieldOfStudy, graduationYear });
    await user.save();

    res.status(200).json(user.education);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

// Remove an education entry from the user's profile
exports.removeEducation = async (req, res) => {
  const { id, educationId } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.education = user.education.filter((edu) => edu._id != educationId);
    await user.save();

    res.status(200).json(user.education);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

// Update an education entry in the user's profile
exports.updateEducation = async (req, res) => {
  const { id, educationId } = req.params;
  const { school, degree, fieldOfStudy, graduationYear } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const education = user.education.find((edu) => edu._id == educationId);

    if (!education) {
      return res.status(404).json({ error: "Education entry not found" });
    }

    if (school) education.school = school;
    if (degree) education.degree = degree;
    if (fieldOfStudy) education.fieldOfStudy = fieldOfStudy;
    if (graduationYear) education.graduationYear = graduationYear;

    await user.save();

    res.status(200).json(user.education);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

// Add a new company to the user's profile
exports.addCompany = async (req, res) => {
  const { id } = req.params;
  const { name, location, industry } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.companies.push({ name, location, industry });
    await user.save();

    res.status(200).json(user.companies);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

// Remove a company from the user's profile
exports.removeCompany = async (req, res) => {
  const { id, companyId } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.companies = user.companies.filter(
      (company) => company._id != companyId
    );
    await user.save();

    res.status(200).json(user.companies);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

// Update a company in the user's profile
exports.updateCompany = async (req, res) => {
  const { id, companyId } = req.params;
  const { name, location, industry } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const company = user.companies.find((company) => company._id == companyId);

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    if (name) company.name = name;
    if (location) company.location = location;
    if (industry) company.industry = industry;

    await user.save();

    res.status(200).json(user.companies);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};
