import express from "express";

const PORT = 3000;

const app = express();

const logger = (req, res, next) => {
  console.log(`🚒 ${req.method} ${req.url}`);
  next();
};
const privateMiddleware = (req, res, next) => {
  const url = req.url;
  if (url == "/protected") {
    return res.send("Not Allowed!!!!");
  }
  next();
};

// const gossipNextMiddleware = (req, res, next) => {
//   console.log("Really?");
//   next();
// };

const handleHome = (req, res) => {
  return res.send("<h1>Welcome!</h1>");
};

const handleAbout = (req, res) => {
  return res.send("<h1>About!</h1>");
};

const handleContact = (req, res) => {
  return res.send("<h1>Contact me!</h1>");
};

const handleLogin = (req, res) => {
  return res.send("<h1>Login here</h1>");
};

const handleProtected = (req, res) => {
  return res.send("<h1>Login here</h1>");
};

const handleNotValid = (req, res) => {
  return res.send("유효하지 않은 주소입니다.");
};

app.use(logger);
app.use(privateMiddleware);

app.get("/", handleHome);
app.get("/about", handleAbout);
app.get("/contact", handleContact);
app.get("/login", handleLogin);
app.get("/protected", handleProtected);
app.get("/*", handleNotValid);

app.listen(PORT, () =>
  console.log(`I'm listening at port http://localhost:${PORT}/`)
);
