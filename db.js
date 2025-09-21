const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection successful (Render)");

    await sequelize.sync({ alter: true });
    console.log("✅ Tables synchronized");
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    process.exit(1);
  }
}

module.exports = { sequelize, connectDB };
