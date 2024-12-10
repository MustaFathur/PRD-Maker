require('dotenv').config()
const express = require("express");
const session = require('express-session');
const passport = require('./config/passport');
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const db = require("./models");
const authRoutes = require("./routes/authRoutes");
const prdRoutes = require("./routes/prdRoutes");
const personilRoutes = require("./routes/personilRoutes");


const app = express();

app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
    origin: process.env.REACT_URL,
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

// Route untuk root URL
app.get('/', (req, res) => {
  res.send('Welcome to the PRD Maker with LLM API');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

console.log(process.env.NODE_ENV, process.env.DB_TEST_HOST);
console.log("test");