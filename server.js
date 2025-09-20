require("dotenv").config();
const app = require("./app");
const { connectDB, sequelize } = require("./db");

async function startServer() {
  await connectDB();
  await sequelize.sync();

  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
}

startServer();
