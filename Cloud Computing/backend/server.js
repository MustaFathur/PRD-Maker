const express = require("express");
const passport = require('./config/passport');
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const db = require("./models");
const authRoutes = require("./routes/authRoutes");
const prdRoutes = require("./routes/prdRoutes");
const personilRoutes = require("./routes/personilRoutes");

dotenv.config();

const app = express();

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Sync database
db.sequelize.sync().then(() => {
  console.log("Database synced");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/prd", prdRoutes);
app.use("/api/personil", personilRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});