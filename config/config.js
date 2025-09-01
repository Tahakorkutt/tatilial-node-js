require("dotenv").config();

module.exports = {
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false, // if there is no table make it true and run once, then make it false
  logging: false,
  entities: ["dist/models/**/*.js"],
};
