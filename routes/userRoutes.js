const express = require("express");
const {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  addProject,
  addSkill,
  removeSkill,
  updateSkill,
  removeProject,
  updateProject,
  addEducation,
  removeEducation,
  updateEducation,
  addCompany,
  removeCompany,
  updateCompany,
} = require("../controllers/userController");
const router = express.Router();

// Define routes

router
  .post("/", createUser)
  .get("/:id", getUserById)
  .patch("/:id", updateUser)
  .delete("/:id", deleteUser)
  .post("/:id/projects", addProject)
  .delete("/:id/projects/:projectId", removeProject)
  .patch("/:id/projects/:projectId", updateProject)
  .post("/:id/skills", addSkill)
  .delete("/:id/skills/:skillId", removeSkill)
  .patch("/:id/skills/:skillId", updateSkill)
  .post("/:id/education", addEducation)
  .delete("/:id/education/:educationId", removeEducation)
  .patch("/:id/education/:educationId", updateEducation)
  .post("/:id/companies", addCompany)
  .delete("/:id/companies/:companyId", removeCompany)
  .patch("/:id/companies/:companyId", updateCompany);
exports.router = router;
