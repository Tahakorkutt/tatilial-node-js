const jwt = require("jsonwebtoken");
const { getRepository } = require("typeorm");
const User = require("../models/CustomerManagement/CustomersModel");

const checkUser = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.locals.user = null;
        next();
      } else {
        try {
          const userRepository = getRepository(User);
          const user = await userRepository.findOneBy({
            id: decodedToken.userId,
          });
          res.locals.user = user;
          next();
        } catch (error) {
          console.error("Error fetching user:", error);
          res.locals.user = null;
          next();
        }
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.redirect("/login");
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log("JWT doğrulama hatası:", err.message);
        return res.redirect("/login");
      }

      res.locals.user = decoded; // res.locals.user içine decoded bilgilerini atıyoruz
      next();
    });
  } catch (error) {
    console.error("Token doğrulama hatası:", error);
    res.status(401).json({ error: "Yetkisiz Erişim" });
  }
};


module.exports = { authenticateToken, checkUser };
