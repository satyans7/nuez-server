const express = require("express");
const { register } = require("module");
const path = require("path");

const app = express();
// require("./src/main/routes/api-routes")(app);

const PORT = process.env.PORT || 3000;
const PUBLIC = "public";
const VIEW = "src/main/views";
const HOME = "index.html";
const LOGIN = "pages/login.html";
const REGISTER = "pages/register.html";
const SUPERADMIN = "pages/superAdmin.html";
const ADMIN = "pages/admin.html";
const CONSUMER="pages/consumer.html";
const TEST_VIEW = "src/main/views";
const TEST = "test.html";
const SAMPLE_DATA_VIEW = "src/main/views";
const SAMPLE_DATA_PAGE = "data.html";
const SAMPLE_DATA_FOLDER = "src/main/data/xml";

// Serve static files (including CSS) from the public directory
app.use(express.static(path.join(__dirname, PUBLIC)));

// Middleware to parse JSON bodies
app.use(express.json());

// Define routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, VIEW, HOME));
});
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, VIEW, LOGIN));
});
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, VIEW, REGISTER));
});
app.get("/superAdmin", (req, res) => {
  res.sendFile(path.join(__dirname, VIEW, SUPERADMIN));
});
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, VIEW, ADMIN));
});
app.get("/consumer", (req, res) => {
  res.sendFile(path.join(__dirname, VIEW, CONSUMER));
});
app.get("/test", (req, res) => {
  res.sendFile(path.join(__dirname, TEST_VIEW, TEST));
});
// app.get("/sample", (req, res) => {
//   res.sendFile(path.join(__dirname, SAMPLE_DATA_VIEW, SAMPLE_DATA_PAGE));
// });

// app.get('/sample/download/:fileName', function(req, res) {
//   const fileName = req.params.fileName;
//   const filePath = path.join(__dirname, SAMPLE_DATA_FOLDER, fileName);

//   res.download(filePath, fileName, function(err) {
//     if (err) {
//       console.error('Error sending file:', err);
//       res.status(500).send('Error sending file');
//     } else {
//       console.log(`${fileName} sent successfully`);
//     }
//   });
// });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});