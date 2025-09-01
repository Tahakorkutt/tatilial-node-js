const express = require("express");
const router = express.Router();
const {
  getAdminUsers,
  getAdminUserById,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
} = require("../../controllers/GeneralSettings/adminuserController");

router.get("/getAdminUsers", getAdminUsers);
router.get("/getAdminUserById/:id", getAdminUserById);
router.post("/createAdminUser", createAdminUser);
router.put("/updateAdminUser/:id", updateAdminUser);
router.delete("/deleteAdminUser/:id", deleteAdminUser);

module.exports = router;
