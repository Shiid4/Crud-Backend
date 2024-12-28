require("dotenv").config(); //load environment form .env into process.env
const express = require("express"); //build server and API
const mongoose = require("mongoose"); //connect with mongodb
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 4000;

//database
mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("Connected to database"))
  .catch((error) => {
    console.error("Database connection error:", error);
    process.exit(1); // Exit the process with a failure code
  });

const db = mongoose.connection;

// middlewares ( to Parse URL-Encoded Data )
app.use(express.urlencoded({ extended: false })); //extended false means it will use the querystring library to parse the data,
app.use(express.json()); //parse JSON
app.use(
  session({
    secret: "my secret key",
    saveUninitialized: true,
    resave: false,
  })
);
app.use((req, res, next) => {
  //custom middleware to flash message
  res.locals.message = req.session.message; //req hold the message
  delete req.session.message; //delete the message after flash ( has been assign to res.local)
  next();
});

//set template engine
app.set("view engine", "ejs"); //tell express to use Embedded JavaScript as template engine
//template engine = allow to create dynamic HTML pages by embadding javascript code in HTML pages

//route prefix
app.use("", require("./routes/routes"));

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
