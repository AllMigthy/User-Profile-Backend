const User = require("../models/userModel");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();
// Generate a 32-byte secret key as a hex-encoded string
const secretKeyHex = process.env.SECRET_KEY;
console.log(secretKeyHex)
// Function to generate a random IV
function generateRandomIV() {
  return crypto.randomBytes(16).toString("hex");
}

// Function to encrypt data
function encryptData(data, iv) {
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(secretKeyHex, 'hex'), Buffer.from(iv, "hex"));

  let encryptedData = cipher.update(data, "utf-8", "hex");
  encryptedData += cipher.final("hex");
  return encryptedData;
}

// Function to decrypt data
function decryptData(encryptedData, iv) {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(secretKeyHex, 'hex'),
    Buffer.from(iv, "hex")
  );

  let decryptedData = decipher.update(encryptedData, "hex", "utf-8");
  decryptedData += decipher.final("utf-8");
  return decryptedData;
}


// Create a new user
exports.createUser = async (req, res) => {
  const newUser = new User(req.body);

  // Generate IVs
  const emailIv = generateRandomIV();
  const passwordIv = generateRandomIV();
  const dobIv = generateRandomIV();

  // Encrypt sensitive fields before saving
  newUser.email = encryptData(newUser.email, emailIv);
  newUser.emailIv = emailIv;
  newUser.password = encryptData(newUser.password, passwordIv);
  newUser.passwordIv = passwordIv;
  newUser.dateOfBirth = encryptData(newUser.dateOfBirth, dobIv);
  newUser.dobIv = dobIv;

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
    const user = await User.findById(id);

    console.log("Encrypted Email:", user.email);
    console.log("Email IV:", user.emailIv);

    // Decrypt sensitive fields before sending the response
    const decryptedEmail = decryptData(user.email, user.emailIv);
    console.log("Decrypted Email:", decryptedEmail);

    user.email = decryptedEmail;
    user.password = decryptData(user.password, user.passwordIv);

    // Date of birth is already a string, no need to decrypt
    user.dateOfBirth = decryptData(user.dateOfBirth, user.dobIv);

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
};


// Update a user by ID
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedData = req.body;

    // Encrypt updated sensitive fields before updating
    if (updatedData.email) {
      const emailIv = generateRandomIV();
      updatedData.email = encryptData(updatedData.email, emailIv);
      updatedData.emailIv = emailIv;
    }
    if (updatedData.password) {
      const passwordIv = generateRandomIV();
      updatedData.password = encryptData(updatedData.password, passwordIv);
      updatedData.passwordIv = passwordIv;
    }
    if (updatedData.dateOfBirth) {
      const dobIv = generateRandomIV();
      updatedData.dateOfBirth = encryptData(updatedData.dateOfBirth, dobIv);
      updatedData.dobIv = dobIv;
    }

    const user = await User.findByIdAndUpdate(id, updatedData, { new: true });

    // Decrypt sensitive fields before sending the response
    user.email = decryptData(user.email, user.emailIv);
    user.password = decryptData(user.password, user.passwordIv);
    user.dateOfBirth = decryptData(user.dateOfBirth, user.dobIv);

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json(error);
  }
};


// Delete a user by ID
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);

    // Decrypt sensitive fields before sending the response
    user.email = decryptData(user.email, user.emailIv);
    user.password = decryptData(user.password, user.passwordIv);
    user.dateOfBirth = decryptData(user.dateOfBirth, user.dobIv);

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

// Add a social link to the user
exports.addSocialLink = async (req, res) => {
  const { id } = req.params;
  const { name, link } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!name || !link) {
      return res.status(400).json({ error: "Name and link are required" });
    }

    // Encrypt the link and store it with IV
    const iv = generateRandomIV(); // Generate IV for the link
    const encryptedLink = encryptData(link, iv);

    user.socialLinks.push({ name, link: encryptedLink, iv });
    await user.save();

    console.log("Link added:", { name, link: encryptedLink, iv });
    res.status(201).json(user.socialLinks);
  } catch (error) {
    console.error("Error adding social link:", error);
    res.status(500).json(error);
  }
};

// Update a social link for the user
exports.updateSocialLink = async (req, res) => {
  const { id, linkId } = req.params;
  const { name, link } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const socialLink = user.socialLinks.id(linkId);

    if (!socialLink) {
      return res.status(404).json({ error: "Social link not found" });
    }

    if (name) socialLink.name = name;
    if (link) {
      // Generate a new IV for the updated link
      const iv = generateRandomIV();
      const encryptedLink = encryptData(link, iv);

      socialLink.link = encryptedLink;
      socialLink.iv = iv;
    }

    await user.save();

    res.status(200).json(user.socialLinks);
  } catch (error) {
    console.error("Error updating social link:", error);
    res.status(500).json(error);
  }
};

// Remove a social link from the user
exports.removeSocialLink = async (req, res) => {
  const { id, linkId } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const socialLinkIndex = user.socialLinks.findIndex(
      (link) => link._id == linkId
    );

    if (socialLinkIndex === -1) {
      return res.status(404).json({ error: "Social link not found" });
    }

    user.socialLinks.splice(socialLinkIndex, 1);
    await user.save();

    res.status(200).json(user.socialLinks);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

// Get the social links in their original format
exports.getSocialLinks = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Decrypt the links before sending the response
    const decryptedLinks = user.socialLinks.map((socialLink) => {
      const { name, link, iv } = socialLink;
      const decryptedLink = decryptData(link, iv);
      return { name, link: decryptedLink };
    });

    console.log("Decrypted links:", decryptedLinks);
    res.status(200).json(decryptedLinks);
  } catch (error) {
    console.error("Error getting social links:", error);
    res.status(500).json(error);
  }
};
