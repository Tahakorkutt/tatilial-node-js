const { getRepository } = require("typeorm");
const User = require("../../models/CustomerManagement/CustomersModel");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const getUsers = async (req, res) => {
  try {
    const userRepository = getRepository(User);
    const users = await userRepository.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const userRepo = await getRepository(User);
    const user = await userRepo.findOneBy({
      id: id, // where id is your column name
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const userRepository = getRepository(User);

    // Hash the password
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance with the hashed password
    const user = userRepository.create({
      ...req.body,
      password: hashedPassword,
    });

    // Save the user to the database
    const savedUser = await userRepository.save(user);

    // Respond with the created user object (without the password)
    const { password: _, ...userWithoutPassword } = savedUser; // Exclude the password from the response
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    // Check if the error is related to a unique constraint violation on the email field
    if (
      error.code === "ER_DUP_ENTRY" ||
      error.message.includes("UNIQUE constraint failed")
    ) {
      res
        .status(400)
        .json({
          message:
            "This email address is already registered. Please use a different email.",
        });
    } else {
      // Generic error response
      res.status(400).json({ message: error.message });
    }
  }
};

const createUserEr = async (firstName, lastName, email, password) => {
  const errors = {};

  // Validate input
  if (!validator.isAlpha(firstName)) {
    errors.firstName = "First name must contain only letters.";
  }
  if (!validator.isAlpha(lastName)) {
    errors.lastName = "Last name must contain only letters.";
  }
  if (!validator.isEmail(email)) {
    errors.email = "Invalid email address.";
  }
  if (password.length < 4) {
    errors.password = "Password must be at least 4 characters long.";
  }

  // Return errors if any validation failed
  if (Object.keys(errors).length > 0) {
    return { success: false, errors }; // Changed to 'success' for consistency
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get the user repository
    const userRepository = getRepository(User);
    //const userRepository = AppDataSource.getRepository(User);

    // Create a new user instance
    const newUser = userRepository.create({
      firstName,
      lastName,
      email,
      password: hashedPassword, // Use the hashed password
    });

    // Save the user to the database
    await userRepository.save(newUser);

    // Return success response
    return {
      success: true, // Changed to 'success' for consistency
      redirectUrl: "/login", // You can use this in the frontend to redirect
    };
  } catch (error) {
    // Check for unique constraint violation
    if (error.code === "ER_DUP_ENTRY") {
      return { success: false, errors: { email: "Email already exists." } }; // Ensure consistency with 'success'
    }

    // General error
    return { success: false, errors: { general: "Server error occurred." } };
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userRepo = await getRepository(User);
    const user = await userRepo.findOneBy({
      id: id, // where id is your column name
    });
    if (user) {
      getRepository(User).merge(user, req.body);
      const result = await getRepository(User).save(user);
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const result = await getRepository(User).delete(req.params.id);
    if (result.affected) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Get the user repository
    const userRepository = await getRepository(User);
    // const userRepository = AppDataSource.getRepository(User);

    // Find the user by email
    const user = await userRepository.findOneBy({ email });

    if (!user) {
      return res.status(401).json({
        succeeded: false,
        error: "There is no such user",
      });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // Create a JWT token
      const token = createToken(user.id, user.email); // Use user.id instead of user._id

      // Set the token in a cookie
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      return res.status(200).json({
        succeeded: true,
        redirectUrl: "/",
      });
    } else {
      return res.status(401).json({
        succeeded: false,
        error: "Passwords do not match",
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    if (!res.headersSent) {
      return res.status(500).json({
        succeeded: false,
        error: "Server error",
      });
    }
  }
};

const sendResetPasswordEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const userRepository = await getRepository(User);
    //const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ email });

    if (!user) {
      return res
        .status(404)
        .json({ succeeded: false, error: "E-posta adresi bulunamadı." });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const resetLink = `${req.protocol}://${req.get(
      "host"
    )}/reset-password/${token}`;

    // E-posta gönderme işlemi
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.NODE_MAIL,
        pass: process.env.NODE_PASS,
      },
    });

    await transporter.sendMail({
      to: email,
      subject: "Şifre Sıfırlama Talebi",
      html: `<p>Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:</p><a href="${resetLink}">${resetLink}</a>`,
    });

    res.status(200).json({ succeeded: true });
  } catch (error) {
    console.error("Şifre sıfırlama e-posta hatası:", error);
    res.status(500).json({ succeeded: false, error: "Sunucu hatası" });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Token'ı doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userRepository = await getRepository(User);
    //const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: decoded.userId });

    if (!user) {
      return res.status(404).json({
        succeeded: false,
        error: "Kullanıcı bulunamadı.",
      });
    }

    // Şifreyi hashle
    user.password = await bcrypt.hash(password, 10);

    // Kullanıcıyı güncelle
    await userRepository.save(user);

    res.status(200).json({ succeeded: true });
  } catch (error) {
    console.error("Şifre sıfırlama hatası:", error);
    res.status(500).json({ succeeded: false, error: "Bir hata oluştu." });
  }
};

// Function to create a JWT token
const createToken = (userId, email) => {
  return jwt.sign({ userId, email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const getDashboardPage = (req, res) => {
  res.render("dashboard", {
    link: "dashboard",
  });
};

module.exports = {
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
};
