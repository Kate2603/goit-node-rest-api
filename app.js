const express = require("express");
const contactsRouter = require("./routes/contactsRouter");
const authRouter = require("./routes/authRouter");

const app = express();

app.use(express.json());

app.use("/api/contacts", contactsRouter);
app.use("/api/auth", authRouter);
app.use("/avatars", express.static("public/avatars"));

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

module.exports = app;
