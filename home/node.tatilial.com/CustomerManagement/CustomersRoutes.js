const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
// const authMiddleware = require("../../middlewares/authMiddleware");

const router = express.Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  getDashboardPage,
  sendResetPasswordEmail,
  resetPassword,
  createUserEr,
} = require("../Controllers/CustomerManagement/CustomersController");



router.get("/getUsers", getUsers);
router.get("/getUsersByid/:id", getUserById);
router.post("/create", createUser);
router.put("/updateUser/:id", updateUser);
router.delete("/deleteUser/:id", deleteUser);

//------------------
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const result = await createUserEr(firstName, lastName, email, password);

  if (result.success) {
    // Check if succeeded instead of success based on your controller logic
    res.status(200).json({
      success: true,
      redirectUrl: "/login", // Optional: Include redirect URL if needed
    });
  } else {
    res.status(400).json({ errors: result.errors });
  }
});

router.route("/login").post(loginUser);

// router
//   .route("/dashboard")
//   .get(authMiddleware.authenticateToken, getDashboardPage);

// Şifre sıfırlama ve "Şifremi Unuttum" rotaları
router.route("/reset-password").post(sendResetPasswordEmail);
router.route("/reset-password/:token").post(resetPassword);

module.exports = router;
