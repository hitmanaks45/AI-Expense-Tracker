const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const connectDB = require("./config/db");
const passport = require("passport");
const expenseRoutes = require("./routes/expense");
const session = require("express-session");
const userRoutes = require("./routes/user");
const aiRoutes = require("./routes/aiRoutes");
const dashboardRoutes = require("./routes/dashboard");
const goalRoutes = require("./routes/goalRoutes");
const receiptRoutes = require("./routes/receiptRoutes");



require("./config/passport");



connectDB();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ai-expense-tracker-gold-ten.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

// session (needed for passport OAuth)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("API is running...");
});

// routes
app.use("/auth", require("./routes/auth"));
app.use("/api/users", userRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/receipts", receiptRoutes);

const protect = require("./middleware/authMiddleware");

app.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

const PORT = process.env.PORT || 5000;

const errorHandler = require("./middleware/errorMiddleware");

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});