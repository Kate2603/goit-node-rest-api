const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "contacts_5elx",
  "contacts_5elx_user",
  "Ln6FgXaKndUd889rbvSmwFQcqgz2hyEe",
  {
    host: "dpg-d36t53nfte5s73aoc7q0-a.oregon-postgres.render.com",
    port: 5432,
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
    console.log("✅ Database connection successful");

    await sequelize.sync();
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    process.exit(1);
  }
}

module.exports = { sequelize, connectDB };
