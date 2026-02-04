const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");



const app = express(); 
app.use(express.json());

app.use("/api/expenses", expenseRoutes);
app.use(cors());


app.use("/api/auth", authRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

module.exports = app;
